<div align="center">
  <img src="./assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Logo" width="460" />
  <p><strong>Smart Group Expense Splitting & Debt Minimization Engine</strong></p>

  [![Rust Tests](https://img.shields.io/badge/Rust_Domain-7%20Passed-brightgreen?style=flat-square&logo=rust)](https://www.rust-lang.org)
  [![Vite React](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%20%2B%20TS-61DAFB?style=flat-square&logo=react)](https://react.dev)
  [![Architecture](https://img.shields.io/badge/Architecture-4--Layer%20Clean%20Domain-8A2BE2?style=flat-square)](#5-system-architecture)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
</div>

---

# Solution & Architectural Specification

## 1. Executive Summary

**Papper Cutter** is an ultra-fast, iOS-inspired smart group-expense management and automated debt-settlement platform engineered for trips, flatmates, hostel wings, college squads, and shared life.

The core product promise is simple:

> **"Track who paid, calculate everyone's fair share with zero rounding leakage, and find the absolute simplest path to settle the group."**

Papper Cutter replaces messy WhatsApp trails, manual spreadsheet recalculations, forgotten cash payments, and awkward "who owes whom?" confrontations with a deterministic financial engine wrapped in a calm, modern Warm Pastel Harmony interface.

---

## 2. The Core Problem

When groups spend money together, making payments is easy—**settling up afterwards is painful**.

```
                   Traditional Shared Spending Chaos
                   
  [Person A: Hotel ₹6,000]   [Person B: Dinner ₹1,800]   [Person C: Cab ₹1,200]
           │                         │                          │
           ▼                         ▼                          ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │ ❓ Who owes whom?   ❓ Unequal splits?   ❓ Floating-point errors?│
  │ ❓ Scattered UPI receipts?   ❓ 12 circular manual bank transfers?│
  └─────────────────────────────────────────────────────────────────┘
```

### Key Failure Modes of Existing Tools:
1. **Circular & Redundant Transfers**: In an $N$-person group, naive debt tracking requires up to $N(N-1)/2$ peer-to-peer transactions.
2. **Floating-Point Imprecision**: Storing money as IEEE 754 floats causes penny/paise leakage (e.g., $100 / 3 = 33.3333...$).
3. **Overcomplicated UX**: Existing apps are bloated with ads, aggressive subscription paywalls, and noisy social feeds.
4. **Disjointed Settlement**: Users must calculate amounts in one app, open another UPI app, type numbers manually, and switch back to verify.

---

## 3. Product Solution Overview

Papper Cutter organizes shared finances into an automated 4-stage pipeline:

```
  1. Record Expense  ──►  2. Precise Integer Split  ──►  3. Net Balances  ──►  4. Min-Flow UPI Settle
  (Amount + Payer)        (Equal/Unequal/Share)           (Zero-Sum Invariant)   (Greedy Debt Bipartite)
```

<div align="center">
  <table border="0">
    <tr>
      <td align="center" width="25%">
        <img src="./assets/web_assets/screenshots/home_dashboard.png" width="220" style="border-radius: 14px;" /><br/>
        <strong>1. Dashboard</strong>
      </td>
      <td align="center" width="25%">
        <img src="./assets/web_assets/screenshots/group_detail.png" width="220" style="border-radius: 14px;" /><br/>
        <strong>2. Group Balances</strong>
      </td>
      <td align="center" width="25%">
        <img src="./assets/web_assets/screenshots/add_expense.png" width="220" style="border-radius: 14px;" /><br/>
        <strong>3. Split Modes</strong>
      </td>
      <td align="center" width="25%">
        <img src="./assets/web_assets/screenshots/smart_settlement.png" width="220" style="border-radius: 14px;" /><br/>
        <strong>4. Min-Flow Settle</strong>
      </td>
    </tr>
  </table>
</div>

---

## 4. Mathematical & Algorithmic Methods

### 4.1 Minor-Unit Integer Financial Arithmetic
Floating point errors are strictly prohibited. All monetary calculations are performed in minor currency units (paise/cents):
$$\text{Amount}_{\text{minor}} = \text{round}(\text{Amount}_{\text{major}} \times 100)$$

For an expense of $A$ paise shared equally across $k$ participants, the quotient $q = \lfloor A / k \rfloor$ and remainder $r = A \pmod k$:
$$\text{Share}_i = \begin{cases} q + 1, & \text{if } i < r \\ q, & \text{if } i \ge r \end{cases}$$
This guarantees $\sum_{i=0}^{k-1} \text{Share}_i = A$ with exact conservation of money.

### 4.2 Net Balance Formulation
For each member $m$ in group $G$, their net financial position $B(m)$ is:
$$B(m) = \sum_{e \in E} \text{Contribution}(m, e) - \sum_{e \in E} \text{Share}(m, e)$$
Where:
- $\text{Contribution}(m, e)$ is the amount member $m$ paid upfront for expense $e$.
- $\text{Share}(m, e)$ is the amount member $m$ owes for expense $e$.

**Zero-Sum Invariant**: Across all members $M$, total net balance is always zero:
$$\sum_{m \in M} B(m) = 0$$

### 4.3 Min-Flow Debt Simplification Algorithm
To eliminate circular and redundant debts, Papper Cutter separates members into Creditors ($B(m) > 0$) and Debtors ($B(m) < 0$). It computes the minimal set of transactions using a greedy bipartite settlement algorithm:

```
Algorithm: MinFlowSettlement(balances)
  Input : Net balances map { MemberId -> Balance }
  Output: Minimal list of Transaction(from, to, amount)

  1. creditors = MaxHeap([ (m, b) for (m, b) in balances if b > 0 ])
  2. debtors   = MaxHeap([ (m, -b) for (m, b) in balances if b < 0 ])
  3. settlements = []

  4. WHILE creditors is not empty AND debtors is not empty:
       (creditor, credit_amt) = creditors.pop_max()
       (debtor, debt_amt)     = debtors.pop_max()

       settle_amt = min(credit_amt, debt_amt)
       settlements.append(Transaction(from: debtor, to: creditor, amount: settle_amt))

       IF credit_amt > settle_amt:
           creditors.push((creditor, credit_amt - settle_amt))
       IF debt_amt > settle_amt:
           debtors.push((debtor, debt_amt - settle_amt))

  5. RETURN settlements
```
**Result**: At most $N - 1$ transactions are required to settle any $N$-person group (compared to $O(N^2)$ without optimization).

### 4.4 One-Click UPI Deep Linking
Each settlement transaction is dispatched directly to native UPI apps (Google Pay, PhonePe, Paytm, BHIM) via standard intent URIs:
```
upi://pay?pa={vpa}&pn={name}&am={amount_major}&cu=INR&tn=PapperCutter+Settlement
```

---

## 5. System Architecture

Papper Cutter follows a strict 4-layer clean architecture separating business logic from presentation:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│      React (Vite) / iOS-Inspired UI / Capacitor        │
├────────────────────────────────────────────────────────┤
│             Application & State Layer                  │
│       AppContext / Custom Hooks / Form Validation      │
├────────────────────────────────────────────────────────┤
│                 Domain Rules Layer                     │
│  Rust Workspace (crates/papper-cutter-domain)          │
│  TypeScript Mirror (android-app/src/domain)            │
│  - Integer minor units  - Split logic  - Min-flow math │
├────────────────────────────────────────────────────────┤
│             Data & Infrastructure Layer                │
│    Local SQLite / IndexedDB / Cloud Sync / UPI Intent  │
└────────────────────────────────────────────────────────┘
```

---

## 6. Project Directory Structure

```
Papper-Cutter/
├── assets/                               # Optimized web & documentation assets
│   ├── primary_transparent.png
│   └── web_assets/
│       ├── papper_cutter_logo_horizontal.png
│       ├── papper_cutter_logo_stacked.png
│       ├── papper_cutter_mark.png
│       └── screenshots/                  # High-res mobile showcase screens
│           ├── home_dashboard.png
│           ├── group_detail.png
│           ├── add_expense.png
│           └── smart_settlement.png
│
├── android-app/                          # React + TypeScript + Vite Android App
│   ├── src/
│   │   ├── domain/                       # Core financial engine (TS mirror)
│   │   │   ├── types.ts                  # Domain models & split types
│   │   │   ├── money.ts                  # Integer minor unit math
│   │   │   ├── balance.ts                # Net balance calculation
│   │   │   └── settlement.ts             # Greedy min-flow algorithm
│   │   ├── context/                      # Reactive global state
│   │   │   └── AppContext.tsx
│   │   ├── components/                   # Modular UI components
│   │   │   ├── Navbar.tsx                # Dynamic top header with avatars
│   │   │   ├── TabBar.tsx                # iOS-style bottom tab bar
│   │   │   ├── Dashboard.tsx             # Home screen
│   │   │   ├── GroupDetail.tsx           # Group detail & member balances
│   │   │   ├── AddExpenseModal.tsx       # Multi-mode expense entry
│   │   │   └── SettlementModal.tsx       # Min-flow list & UPI actions
│   │   ├── index.css                     # Warm Pastel Harmony design tokens
│   │   └── App.tsx                       # Main application shell
│   └── package.json
│
├── crates/                               # High-performance Rust workspace
│   ├── papper-cutter-domain/             # Pure domain logic & settlement engine
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── money.rs                  # Minor units with serde support
│   │       ├── split.rs                  # Equal, unequal, percentage splits
│   │       └── settlement.rs             # Max-heap min-flow optimizer
│   ├── papper-cutter-mobile/             # Cross-platform mobile bridge
│   └── papper-cutter-server/             # Backend sync API (Axum)
│
├── README.md                             # Project overview & quick start
├── IMPLEMENTATION_PLAN.md                # Engineering roadmap & specifications
├── documentation.md                      # Exhaustive feature manual
└── solution.md                           # Architectural whitepaper & algorithms
```

---

## 7. How to Run Locally

### 7.1 Running the Mobile / Web App (React + Vite)
```powershell
cd android-app
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Use Mobile Emulation (iPhone 14 / Pixel 7) in DevTools for the ideal viewport experience.

To test production build:
```powershell
npm run build
```

### 7.2 Running the Rust Domain Engine & Tests
```powershell
cargo test --workspace
```
Runs all unit and integration tests verifying integer rounding conservation, unequal split validation, and min-flow debt minimization.

---

<div align="center">
  <p><strong>Papper Cutter</strong> • Built with precision, calm aesthetics, and mathematical rigor.</p>
</div>
