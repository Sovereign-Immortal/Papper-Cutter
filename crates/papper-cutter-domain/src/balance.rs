use std::collections::HashMap;
use crate::money::Money;
use crate::types::{Expense, SettlementStatus, SettlementTransaction, UserId};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MemberBalance {
    pub user_id: UserId,
    pub total_contributed: Money,
    pub total_share: Money,
    pub net_balance: Money,
}

/// Computes net balances for all group members given a list of expenses and settlement transactions.
/// 
/// In accordance with PRD FR-4.1:
/// Net Balance_i = \sum Contributions_i - \sum Shares_i + \sum Received_Settlements_i - \sum Sent_Settlements_i
pub fn calculate_group_balances(
    members: &[UserId],
    expenses: &[Expense],
    settlements: &[SettlementTransaction],
) -> HashMap<UserId, MemberBalance> {
    let mut contributions: HashMap<UserId, Money> = HashMap::new();
    let mut shares: HashMap<UserId, Money> = HashMap::new();
    let mut settlements_received: HashMap<UserId, Money> = HashMap::new();
    let mut settlements_sent: HashMap<UserId, Money> = HashMap::new();

    // Initialize all members
    for m in members {
        contributions.insert(m.clone(), Money::ZERO);
        shares.insert(m.clone(), Money::ZERO);
        settlements_received.insert(m.clone(), Money::ZERO);
        settlements_sent.insert(m.clone(), Money::ZERO);
    }

    // Tally expenses
    for exp in expenses {
        *contributions.entry(exp.paid_by.clone()).or_insert(Money::ZERO) += exp.amount;
        for (participant, share_amount) in &exp.split_shares {
            *shares.entry(participant.clone()).or_insert(Money::ZERO) += *share_amount;
        }
    }

    // Tally settlements (only if MarkedPaid or Confirmed)
    for st in settlements {
        if st.status == SettlementStatus::MarkedPaid || st.status == SettlementStatus::Confirmed {
            *settlements_sent.entry(st.from_user.clone()).or_insert(Money::ZERO) += st.amount;
            *settlements_received.entry(st.to_user.clone()).or_insert(Money::ZERO) += st.amount;
        }
    }

    let mut result = HashMap::new();
    for m in members {
        let contrib = contributions.get(m).copied().unwrap_or(Money::ZERO);
        let share = shares.get(m).copied().unwrap_or(Money::ZERO);
        let received = settlements_received.get(m).copied().unwrap_or(Money::ZERO);
        let sent = settlements_sent.get(m).copied().unwrap_or(Money::ZERO);

        let net = (contrib - share) + (sent - received);

        result.insert(
            m.clone(),
            MemberBalance {
                user_id: m.clone(),
                total_contributed: contrib,
                total_share: share,
                net_balance: net,
            },
        );
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{Category, SplitType};

    #[test]
    fn test_trip_balances() {
        // 4 friends: Harsh pays ₹6,000 for Hotel shared equally
        let members = vec![
            "Harsh".to_string(),
            "Rahul".to_string(),
            "Aman".to_string(),
            "Piyush".to_string(),
        ];

        let mut split = HashMap::new();
        split.insert("Harsh".to_string(), Money::from_rupees(1500));
        split.insert("Rahul".to_string(), Money::from_rupees(1500));
        split.insert("Aman".to_string(), Money::from_rupees(1500));
        split.insert("Piyush".to_string(), Money::from_rupees(1500));

        let expense = Expense {
            id: "exp-1".to_string(),
            group_id: "grp-1".to_string(),
            description: "Hotel".to_string(),
            category: Category::Stay,
            amount: Money::from_rupees(6000),
            paid_by: "Harsh".to_string(),
            participants: members.clone(),
            split_type: SplitType::Equal,
            split_shares: split,
            date: "2026-10-06".to_string(),
            notes: None,
        };

        let balances = calculate_group_balances(&members, &[expense], &[]);

        // Harsh paid 6000, share 1500 -> net +4500
        assert_eq!(balances.get("Harsh").unwrap().net_balance, Money::from_rupees(4500));
        // Rahul paid 0, share 1500 -> net -1500
        assert_eq!(balances.get("Rahul").unwrap().net_balance, Money::from_rupees(-1500));
        assert_eq!(balances.get("Aman").unwrap().net_balance, Money::from_rupees(-1500));
        assert_eq!(balances.get("Piyush").unwrap().net_balance, Money::from_rupees(-1500));
    }
}
