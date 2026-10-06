use std::collections::HashMap;
use thiserror::Error;
use crate::money::Money;
use crate::types::UserId;

#[derive(Error, Debug, PartialEq, Eq)]
pub enum SplitError {
    #[error("No participants provided")]
    EmptyParticipants,
    #[error("Expense amount must be positive")]
    NonPositiveAmount,
    #[error("Payer not found in participants")]
    PayerNotInParticipants,
    #[error("Unequal split sum {sum} does not match total expense amount {total}")]
    UnequalSumMismatch { sum: Money, total: Money },
    #[error("Percentages sum to {sum_basis_points} basis points, expected exactly 10000 (100.00%)")]
    PercentageSumMismatch { sum_basis_points: i64 },
}

/// Computes equal split among participants.
/// Deterministically distributes remainder paise:
/// If remainder > 0, 1 extra paise is allocated first to the payer (if participating),
/// then to participants sorted lexicographically by ID.
pub fn calculate_equal_split(
    total: Money,
    payer: &UserId,
    participants: &[UserId],
) -> Result<HashMap<UserId, Money>, SplitError> {
    if total.paise() <= 0 {
        return Err(SplitError::NonPositiveAmount);
    }
    if participants.is_empty() {
        return Err(SplitError::EmptyParticipants);
    }

    let n = participants.len() as i64;
    let base_share = total.paise() / n;
    let remainder = total.paise() % n;

    let mut sorted_participants = participants.to_vec();
    sorted_participants.sort();

    let mut shares = HashMap::new();
    let mut remainder_left = remainder;

    // First assign 1 extra paise to payer if payer is a participant and remainder > 0
    if remainder_left > 0 && participants.contains(payer) {
        shares.insert(payer.clone(), Money(base_share + 1));
        remainder_left -= 1;
    }

    for p in &sorted_participants {
        if shares.contains_key(p) {
            continue;
        }
        if remainder_left > 0 {
            shares.insert(p.clone(), Money(base_share + 1));
            remainder_left -= 1;
        } else {
            shares.insert(p.clone(), Money(base_share));
        }
    }

    // Verify sum strictly equals total
    let sum: i64 = shares.values().map(|m| m.paise()).sum();
    debug_assert_eq!(sum, total.paise(), "Invariant broken: equal split shares do not sum to total");

    Ok(shares)
}

/// Validates that an unequal split equals the total amount exactly.
pub fn validate_unequal_split(
    total: Money,
    shares: &HashMap<UserId, Money>,
) -> Result<(), SplitError> {
    if total.paise() <= 0 {
        return Err(SplitError::NonPositiveAmount);
    }
    if shares.is_empty() {
        return Err(SplitError::EmptyParticipants);
    }
    let sum: Money = shares.values().copied().fold(Money::ZERO, |acc, x| acc + x);
    if sum != total {
        return Err(SplitError::UnequalSumMismatch { sum, total });
    }
    Ok(())
}

/// Calculates percentage split using basis points (100% = 10,000 basis points).
/// For example, 40.5% = 4,050 basis points.
pub fn calculate_percentage_split(
    total: Money,
    payer: &UserId,
    percentages_bps: &[(UserId, i64)],
) -> Result<HashMap<UserId, Money>, SplitError> {
    if total.paise() <= 0 {
        return Err(SplitError::NonPositiveAmount);
    }
    if percentages_bps.is_empty() {
        return Err(SplitError::EmptyParticipants);
    }

    let sum_bps: i64 = percentages_bps.iter().map(|(_, bps)| bps).sum();
    if sum_bps != 10_000 {
        return Err(SplitError::PercentageSumMismatch { sum_basis_points: sum_bps });
    }

    let mut shares = HashMap::new();
    let mut allocated_paise = 0;

    for (user_id, bps) in percentages_bps {
        let user_paise = (total.paise() * bps) / 10_000;
        shares.insert(user_id.clone(), Money(user_paise));
        allocated_paise += user_paise;
    }

    let remainder = total.paise() - allocated_paise;
    if remainder > 0 {
        // Deterministically assign remainder paise to payer or first participant
        let target = if shares.contains_key(payer) {
            payer.clone()
        } else {
            percentages_bps[0].0.clone()
        };
        let current = shares.get(&target).copied().unwrap_or(Money::ZERO);
        shares.insert(target, Money(current.paise() + remainder));
    }

    Ok(shares)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_equal_split_with_remainder() {
        // ₹100 split among 3 people: Harsh (payer), Rahul, Aman
        let total = Money::from_rupees(100); // 10000 paise
        let payer = "Harsh".to_string();
        let participants = vec!["Harsh".to_string(), "Rahul".to_string(), "Aman".to_string()];

        let shares = calculate_equal_split(total, &payer, &participants).unwrap();
        assert_eq!(shares.len(), 3);

        let sum: i64 = shares.values().map(|m| m.paise()).sum();
        assert_eq!(sum, 10000);

        // Harsh (payer) gets 3334 paise, Rahul 3333, Aman 3333
        assert_eq!(shares.get("Harsh").unwrap().paise(), 3334);
        assert_eq!(shares.get("Rahul").unwrap().paise(), 3333);
        assert_eq!(shares.get("Aman").unwrap().paise(), 3333);
    }

    #[test]
    fn test_unequal_split_validation() {
        let total = Money(6000);
        let mut shares = HashMap::new();
        shares.insert("Harsh".to_string(), Money(3000));
        shares.insert("Rahul".to_string(), Money(3000));
        assert!(validate_unequal_split(total, &shares).is_ok());

        shares.insert("Rahul".to_string(), Money(2000));
        assert!(validate_unequal_split(total, &shares).is_err());
    }

    #[test]
    fn test_percentage_split() {
        let total = Money::from_rupees(1000); // 100000 paise
        let payer = "Harsh".to_string();
        let percentages = vec![
            ("Harsh".to_string(), 5000), // 50%
            ("Rahul".to_string(), 3000), // 30%
            ("Aman".to_string(), 2000),  // 20%
        ];

        let shares = calculate_percentage_split(total, &payer, &percentages).unwrap();
        assert_eq!(shares.get("Harsh").unwrap().paise(), 50000);
        assert_eq!(shares.get("Rahul").unwrap().paise(), 30000);
        assert_eq!(shares.get("Aman").unwrap().paise(), 20000);
    }
}
