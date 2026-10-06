use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::money::Money;

pub type UserId = String;
pub type GroupId = String;
pub type ExpenseId = String;
pub type SettlementId = String;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Category {
    Food,
    Travel,
    Stay,
    Tickets,
    Groceries,
    Utilities,
    Shopping,
    Entertainment,
    Other,
}

impl Category {
    pub fn emoji(&self) -> &'static str {
        match self {
            Category::Food => "🍕",
            Category::Travel => "🚕",
            Category::Stay => "🏨",
            Category::Tickets => "🎟️",
            Category::Groceries => "🛒",
            Category::Utilities => "⚡",
            Category::Shopping => "🛍️",
            Category::Entertainment => "🎉",
            Category::Other => "💳",
        }
    }

    pub fn display_name(&self) -> &'static str {
        match self {
            Category::Food => "Food & Drinks",
            Category::Travel => "Travel & Cabs",
            Category::Stay => "Stay & Hotel",
            Category::Tickets => "Tickets & Activities",
            Category::Groceries => "Groceries",
            Category::Utilities => "Utilities & Bills",
            Category::Shopping => "Shopping",
            Category::Entertainment => "Entertainment",
            Category::Other => "General",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum SplitType {
    Equal,
    Unequal,
    Percentage,
    ItemBased,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum SettlementStatus {
    Pending,
    MarkedPaid,
    Confirmed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct User {
    pub id: UserId,
    pub name: String,
    pub email: String,
    pub upi_id: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Group {
    pub id: GroupId,
    pub name: String,
    pub category: String,
    pub members: Vec<UserId>,
    pub created_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Expense {
    pub id: ExpenseId,
    pub group_id: GroupId,
    pub description: String,
    pub category: Category,
    pub amount: Money,
    pub paid_by: UserId,
    pub participants: Vec<UserId>,
    pub split_type: SplitType,
    pub split_shares: HashMap<UserId, Money>,
    pub date: String,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SettlementTransaction {
    pub id: SettlementId,
    pub group_id: GroupId,
    pub from_user: UserId,
    pub to_user: UserId,
    pub amount: Money,
    pub status: SettlementStatus,
    pub upi_uri: Option<String>,
}
