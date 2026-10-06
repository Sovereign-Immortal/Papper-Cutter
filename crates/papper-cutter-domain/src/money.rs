use std::fmt;
use std::ops::{Add, AddAssign, Neg, Sub, SubAssign};
use serde::{Deserialize, Serialize};

/// Represents an amount in minor currency units (e.g. paise for INR, cents for USD).
/// 1 INR = 100 paise.
/// 
/// In accordance with Papper Cutter engineering principles (AGENTS.md #26),
/// floating-point numbers are never used for accounting.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Default, Hash, Serialize, Deserialize)]
pub struct Money(pub i64);

impl Money {
    pub const ZERO: Money = Money(0);

    pub fn zero() -> Self {
        Self::ZERO
    }

    pub fn from_paise(paise: i64) -> Self {
        Money(paise)
    }

    pub fn from_rupees(rupees: i64) -> Self {
        Money(rupees * 100)
    }

    pub fn paise(&self) -> i64 {
        self.0
    }

    pub fn is_zero(&self) -> bool {
        self.0 == 0
    }

    pub fn is_positive(&self) -> bool {
        self.0 > 0
    }

    pub fn is_negative(&self) -> bool {
        self.0 < 0
    }

    pub fn abs(&self) -> Self {
        Money(self.0.abs())
    }

    /// Formats as standard display string with currency symbol (e.g., "₹1,500.00" or "-₹250.50")
    pub fn format_inr(&self) -> String {
        let is_neg = self.0 < 0;
        let abs_val = self.0.abs();
        let rupees = abs_val / 100;
        let paise = abs_val % 100;

        let formatted_rupees = format_indian_number(rupees);
        if is_neg {
            format!("-₹{}.{:02}", formatted_rupees, paise)
        } else {
            format!("₹{}.{:02}", formatted_rupees, paise)
        }
    }
}

fn format_indian_number(num: i64) -> String {
    let s = num.to_string();
    if s.len() <= 3 {
        return s;
    }
    let (head, tail) = s.split_at(s.len() - 3);
    let mut chunks = Vec::new();
    let mut rem = head;
    while rem.len() > 2 {
        let (left, right) = rem.split_at(rem.len() - 2);
        chunks.push(right);
        rem = left;
    }
    if !rem.is_empty() {
        chunks.push(rem);
    }
    chunks.reverse();
    format!("{},{}", chunks.join(","), tail)
}

impl Add for Money {
    type Output = Self;
    fn add(self, rhs: Self) -> Self::Output {
        Money(self.0 + rhs.0)
    }
}

impl AddAssign for Money {
    fn add_assign(&mut self, rhs: Self) {
        self.0 += rhs.0;
    }
}

impl Sub for Money {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self::Output {
        Money(self.0 - rhs.0)
    }
}

impl SubAssign for Money {
    fn sub_assign(&mut self, rhs: Self) {
        self.0 -= rhs.0;
    }
}

impl Neg for Money {
    type Output = Self;
    fn neg(self) -> Self::Output {
        Money(-self.0)
    }
}

impl fmt::Display for Money {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.format_inr())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_money_math() {
        let a = Money::from_rupees(100);
        let b = Money::from_paise(50);
        assert_eq!((a + b).paise(), 10050);
        assert_eq!((a - b).paise(), 9950);
        assert_eq!((-a).paise(), -10000);
    }

    #[test]
    fn test_format_inr() {
        assert_eq!(Money(10050).format_inr(), "₹100.50");
        assert_eq!(Money(1842000).format_inr(), "₹18,420.00");
        assert_eq!(Money(-50000).format_inr(), "-₹500.00");
        assert_eq!(Money(0).format_inr(), "₹0.00");
    }
}
