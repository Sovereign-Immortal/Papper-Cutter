use std::collections::HashMap;
use uuid::Uuid;
use crate::money::Money;
use crate::types::{GroupId, SettlementStatus, SettlementTransaction, UserId};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SettlementPlan {
    pub transactions: Vec<SettlementTransaction>,
    pub initial_transactions_count: usize,
    pub optimized_transactions_count: usize,
}

/// Generates minimal settlement transactions to clear all net debts.
/// 
/// In accordance with PRD FR-4.2:
/// Partitions members into Creditors (net > 0) and Debtors (net < 0).
/// Greedily matches the largest debtor with the largest creditor.
/// This minimizes total inter-member payments down to the theoretical minimum (at most N - 1 transactions).
pub fn generate_settlement_plan(
    group_id: &GroupId,
    net_balances: &HashMap<UserId, Money>,
    member_upi_map: &HashMap<UserId, String>,
) -> SettlementPlan {
    let mut creditors: Vec<(UserId, i64)> = Vec::new();
    let mut debtors: Vec<(UserId, i64)> = Vec::new();

    for (user_id, balance) in net_balances {
        if balance.paise() > 0 {
            creditors.push((user_id.clone(), balance.paise()));
        } else if balance.paise() < 0 {
            debtors.push((user_id.clone(), -balance.paise()));
        }
    }

    // Sort descending by amount, break ties deterministically by user_id
    creditors.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
    debtors.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));

    let mut transactions = Vec::new();
    let mut c_idx = 0;
    let mut d_idx = 0;

    while c_idx < creditors.len() && d_idx < debtors.len() {
        let (ref cred_id, ref mut cred_amount) = creditors[c_idx];
        let (ref debt_id, ref mut debt_amount) = debtors[d_idx];

        let transfer_paise = (*cred_amount).min(*debt_amount);

        if transfer_paise > 0 {
            let amount = Money(transfer_paise);
            let upi_id = member_upi_map.get(cred_id).cloned();
            let upi_uri = upi_id.as_ref().map(|pa| {
                format!(
                    "upi://pay?pa={}&pn={}&am={:.2}&cu=INR&tn=Papper+Cutter+Settlement",
                    pa,
                    cred_id,
                    (transfer_paise as f64) / 100.0
                )
            });

            transactions.push(SettlementTransaction {
                id: Uuid::new_v4().to_string(),
                group_id: group_id.clone(),
                from_user: debt_id.clone(),
                to_user: cred_id.clone(),
                amount,
                status: SettlementStatus::Pending,
                upi_uri,
            });

            *cred_amount -= transfer_paise;
            *debt_amount -= transfer_paise;
        }

        if *cred_amount == 0 {
            c_idx += 1;
        }
        if *debt_amount == 0 {
            d_idx += 1;
        }
    }

    let initial_count = debtors.len() * creditors.len(); // raw unoptimized pairwise potential
    let optimized_count = transactions.len();

    SettlementPlan {
        transactions,
        initial_transactions_count: initial_count.max(optimized_count),
        optimized_transactions_count: optimized_count,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_min_flow_settlement() {
        let mut net_balances = HashMap::new();
        // Harsh: +₹4,500
        // Rahul: -₹1,500
        // Aman: -₹1,500
        // Piyush: -₹1,500
        net_balances.insert("Harsh".to_string(), Money::from_rupees(4500));
        net_balances.insert("Rahul".to_string(), Money::from_rupees(-1500));
        net_balances.insert("Aman".to_string(), Money::from_rupees(-1500));
        net_balances.insert("Piyush".to_string(), Money::from_rupees(-1500));

        let mut upi_map = HashMap::new();
        upi_map.insert("Harsh".to_string(), "harsh@okaxis".to_string());

        let plan = generate_settlement_plan(&"grp-1".to_string(), &net_balances, &upi_map);

        assert_eq!(plan.transactions.len(), 3);
        for tx in &plan.transactions {
            assert_eq!(tx.to_user, "Harsh");
            assert_eq!(tx.amount, Money::from_rupees(1500));
            assert!(tx.upi_uri.is_some());
        }
    }
}
