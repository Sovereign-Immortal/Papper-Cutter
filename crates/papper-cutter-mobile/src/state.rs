use std::collections::HashMap;
use papper_cutter_domain::{
    Category, Expense, Group, Money, SettlementTransaction, SplitType, User, UserId,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AppTab {
    Home,
    Expenses,
    Groups,
    Profile,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[allow(dead_code)]
pub enum GroupSubTab {
    Expenses,
    Balances,
    Settle,
    Analytics,
    Members,
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub current_user_id: UserId,
    pub users: Vec<User>,
    pub groups: Vec<Group>,
    pub selected_group_id: String,
    pub active_tab: AppTab,
    pub group_sub_tab: GroupSubTab,
    pub is_add_expense_open: bool,
    pub expenses: Vec<Expense>,
    pub settlements: Vec<SettlementTransaction>,
}

impl Default for AppState {
    fn default() -> Self {
        let users = vec![
            User {
                id: "Harsh".to_string(),
                name: "Harsh Sharma".to_string(),
                email: "harsh@pappercutter.app".to_string(),
                upi_id: Some("harsh@okaxis".to_string()),
            },
            User {
                id: "Rahul".to_string(),
                name: "Rahul Verma".to_string(),
                email: "rahul@pappercutter.app".to_string(),
                upi_id: Some("rahul@oksbi".to_string()),
            },
            User {
                id: "Aman".to_string(),
                name: "Aman Gupta".to_string(),
                email: "aman@pappercutter.app".to_string(),
                upi_id: Some("aman@paytm".to_string()),
            },
            User {
                id: "Piyush".to_string(),
                name: "Piyush Jain".to_string(),
                email: "piyush@pappercutter.app".to_string(),
                upi_id: Some("piyush@icici".to_string()),
            },
        ];

        let members = vec![
            "Harsh".to_string(),
            "Rahul".to_string(),
            "Aman".to_string(),
            "Piyush".to_string(),
        ];

        let groups = vec![
            Group {
                id: "grp-manali".to_string(),
                name: "Manali Trip 🏔️".to_string(),
                category: "Trip".to_string(),
                members: members.clone(),
                created_at: "2026-10-01".to_string(),
            },
            Group {
                id: "grp-room304".to_string(),
                name: "Room 304 🏠".to_string(),
                category: "Roommates".to_string(),
                members: vec!["Harsh".to_string(), "Rahul".to_string()],
                created_at: "2026-09-15".to_string(),
            },
            Group {
                id: "grp-college".to_string(),
                name: "College Fest 🎉".to_string(),
                category: "College".to_string(),
                members: members.clone(),
                created_at: "2026-09-28".to_string(),
            },
        ];

        // Seed realistic trip expenses from the product docs
        let mut exp1_shares = HashMap::new();
        exp1_shares.insert("Harsh".to_string(), Money::from_rupees(1500));
        exp1_shares.insert("Rahul".to_string(), Money::from_rupees(1500));
        exp1_shares.insert("Aman".to_string(), Money::from_rupees(1500));
        exp1_shares.insert("Piyush".to_string(), Money::from_rupees(1500));

        let mut exp2_shares = HashMap::new();
        exp2_shares.insert("Harsh".to_string(), Money::from_rupees(450));
        exp2_shares.insert("Rahul".to_string(), Money::from_rupees(450));
        exp2_shares.insert("Aman".to_string(), Money::from_rupees(450));
        exp2_shares.insert("Piyush".to_string(), Money::from_rupees(450));

        let mut exp3_shares = HashMap::new();
        exp3_shares.insert("Harsh".to_string(), Money::from_rupees(400));
        exp3_shares.insert("Aman".to_string(), Money::from_rupees(400));
        exp3_shares.insert("Piyush".to_string(), Money::from_rupees(400));

        let mut exp4_shares = HashMap::new();
        exp4_shares.insert("Harsh".to_string(), Money::from_rupees(500));
        exp4_shares.insert("Rahul".to_string(), Money::from_rupees(500));
        exp4_shares.insert("Aman".to_string(), Money::from_rupees(500));
        exp4_shares.insert("Piyush".to_string(), Money::from_rupees(500));

        let expenses = vec![
            Expense {
                id: "exp-1".to_string(),
                group_id: "grp-manali".to_string(),
                description: "Snow Crest Resort".to_string(),
                category: Category::Stay,
                amount: Money::from_rupees(6000),
                paid_by: "Harsh".to_string(),
                participants: members.clone(),
                split_type: SplitType::Equal,
                split_shares: exp1_shares,
                date: "Oct 02".to_string(),
                notes: Some("3 nights stay".to_string()),
            },
            Expense {
                id: "exp-2".to_string(),
                group_id: "grp-manali".to_string(),
                description: "Cafe 1947 Riverside Dinner".to_string(),
                category: Category::Food,
                amount: Money::from_rupees(1800),
                paid_by: "Rahul".to_string(),
                participants: members.clone(),
                split_type: SplitType::Equal,
                split_shares: exp2_shares,
                date: "Oct 03".to_string(),
                notes: None,
            },
            Expense {
                id: "exp-3".to_string(),
                group_id: "grp-manali".to_string(),
                description: "Solang Valley Cab".to_string(),
                category: Category::Travel,
                amount: Money::from_rupees(1200),
                paid_by: "Aman".to_string(),
                participants: vec!["Harsh".to_string(), "Aman".to_string(), "Piyush".to_string()],
                split_type: SplitType::Equal,
                split_shares: exp3_shares,
                date: "Oct 04".to_string(),
                notes: None,
            },
            Expense {
                id: "exp-4".to_string(),
                group_id: "grp-manali".to_string(),
                description: "Ropeway & Ski Tickets".to_string(),
                category: Category::Tickets,
                amount: Money::from_rupees(2000),
                paid_by: "Piyush".to_string(),
                participants: members.clone(),
                split_type: SplitType::Equal,
                split_shares: exp4_shares,
                date: "Oct 04".to_string(),
                notes: None,
            },
        ];

        Self {
            current_user_id: "Harsh".to_string(),
            users,
            groups,
            selected_group_id: "grp-manali".to_string(),
            active_tab: AppTab::Home,
            group_sub_tab: GroupSubTab::Expenses,
            is_add_expense_open: false,
            expenses,
            settlements: Vec::new(),
        }
    }
}
