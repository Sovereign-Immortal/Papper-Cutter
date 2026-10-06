<p align="center">
  <img src="assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Banner" width="480" />
</p>

<p align="center">
  <strong>Smart group-expense and settlement engine for trips, roommates, hostel groups, and friends.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Domain-Rust%202021-DEA584?style=flat-square&logo=rust" alt="Rust" />
  <img src="https://img.shields.io/badge/Mobile%20App-React%2019%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Build%20Tool-Vite%208-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Design-Warm%20Pastel%20Harmony-8B7BE8?style=flat-square" alt="Design" />
  <img src="https://img.shields.io/badge/Accounting-Integer%20Paise%20Precision-1A6B4B?style=flat-square" alt="Money" />
  <img src="https://img.shields.io/badge/Unit%20Tests-100%25%20Passing-brightgreen?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

> **"UPI moves money. Papper Cutter organizes the logic before the payment."**
> 
> Primary user question: *"What do I owe, and who do I need to pay?"*

---

## 📱 Visual Showcase & UI Gallery

Designed using the **Warm Pastel Harmony** system (inspired by calm iOS and Android ergonomics: Cozy Canvas `#FAF7F2`, Gentle Lavender `#8B7BE8`, Sage Matcha `#1A6B4B`, and Soft Apricot `#91462E`).

<p align="center">
  <img src="assets/web_assets/screenshots/home_dashboard.png" width="22%" alt="Home Dashboard" />
  <img src="assets/web_assets/screenshots/group_detail.png" width="22%" alt="Group Detail" />
  <img src="assets/web_assets/screenshots/smart_settlement.png" width="22%" alt="Smart Settlement" />
  <img src="assets/web_assets/screenshots/add_expense.png" width="22%" alt="Add Expense Modal" />
</p>

| Screen | Core Capabilities |
| :--- | :--- |
| **Home Dashboard** | Real-time **Net Balance Cushion** ("You are owed across groups" vs "You owe"), one-tap **⚡ Settle Up** and **📊 Analytics**, horizontal **Active Groups** carousel, and recent activity feed. |
| **Group Detail** | Group pulse card with total spend and user share, interactive sub-tabs: **Expenses**, **Balances** (with credit/debt badges), **Smart Settle**, **Analytics**, and **Members**. |
| **Smart Settlement** | **Min-flow debt minimization** engine reducing $N^2$ circular IOUs to at most $N - 1$ direct transactions, with one-click **📲 Pay via UPI** deep-linking and **Mark Paid ✓** ledger updates. |
| **AI Expense Entry** | **Natural-language expense parser** (e.g. *"Rahul paid 1800 for riverside dinner"*), amount keyboard, payer selector, category pills, and deterministic remainder split math. |

---

## 🏗️ Repository Architecture & File Structure

This repository follows strict **Separation of Concerns** (Presentation $\rightarrow$ Feature Logic $\rightarrow$ Domain Business Rules $\rightarrow$ Infrastructure) as specified in [AGENTS.md](AGENTS.md):

```text
Papper-Cutter/
├── assets/                               # Logos, app icons, wordmarks, and screenshot artifacts
│   ├── Primarylogo.png
│   ├── primary_transparent.png
│   └── web_assets/
│       ├── papper_cutter_logo_horizontal.png
│       ├── papper_cutter_icon.png
│       └── screenshots/                 # High-res mobile UI captures
│
├── android-app/                          # React 19 + TypeScript + Vite mobile-first application
│   ├── src/
│   │   ├── domain/                       # Pure financial algorithms in TypeScript
│   │   │   ├── money.ts                 # Integer paise precision (Money class & Indian formatting)
│   │   │   ├── split.ts                 # Equal, unequal, and percentage split calculations
│   │   │   ├── balance.ts               # Net balance aggregation equation
│   │   │   ├── settlement.ts            # Min-flow greedy settlement optimizer & UPI generator
│   │   │   └── types.ts                 # Domain models (User, Group, Expense, Category, etc.)
│   │   ├── state/
│   │   │   ├── sampleData.ts            # Realistic trip data (Manali Trip, Room 304, College Fest)
│   │   │   ├── AppContext.tsx           # Reactive global state provider
│   │   │   └── useApp.ts                # Fast-refresh custom context hook
│   │   ├── components/
│   │   │   ├── layout/                  # Device shell, StatusBar, and Pill BottomNavBar
│   │   │   ├── home/                    # Balance cushion, group carousel, recent expenses
│   │   │   ├── group/                   # Header pulse, expenses, balances, settle, analytics, members
│   │   │   ├── expense/                 # AI bottom-sheet modal & all-expenses list
│   │   │   └── profile/                 # Profile, avatar, UPI ID, app configuration
│   │   ├── index.css                    # Warm Pastel Harmony CSS tokens & mobile animations
│   │   ├── App.tsx                      # Root screen controller
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── crates/
│   ├── papper-cutter-domain/            # Pure, zero-dependency Rust financial domain library
│   │   └── src/
│   │       ├── money.rs                 # Money(pub i64) minor units type with operator overloading
│   │       ├── split.rs                 # Deterministic remainder equal & percentage splits
│   │       ├── balance.rs               # Group balance calculation engine
│   │       ├── settlement.rs            # Greedy min-flow settlement algorithm & unit tests
│   │       ├── types.rs                 # Core domain entities
│   │       └── lib.rs
│   │
│   └── papper-cutter-mobile/            # Dioxus-based cross-platform Rust mobile client
│       └── src/
│           ├── main.rs                  # Dioxus component views (Home, Groups, Settle, AI Add)
│           ├── state.rs                 # In-memory reactive state
│           └── theme.rs                 # Design system tokens
│
├── design-files/                         # Concept studio UI specifications & PRD
│   ├── papper_cutter_product_requirements_document_prd.md
│   └── stitch_app_concept_studio/
│       └── warm_pastel_harmony/DESIGN.md
│
├── .cargo/config.toml                   # LLVM-MinGW Windows toolchain & linker configuration
├── Cargo.toml                           # Cargo multi-crate workspace
├── IMPLEMENTATION_PLAN.md               # Phased roadmap and architectural delivery status
├── AGENTS.md                            # Non-negotiable engineering principles & quality guide
└── README.md
```

---

## 🧮 Methods & Financial Math Architecture

### 1. Integer Minor Units Precision (`AGENTS.md #26`)
Floating-point numbers (`f64`, `number`) are **never** used for ledger calculations:
- $1\text{ INR} = 100\text{ paise}$.
- Stored as integers (`i64` in Rust, `Math.round(paise)` in TypeScript).
- Formatted using the Indian numbering system only at presentation boundaries:
  $$\text{Money}(1842000\text{ paise}) \rightarrow \text{"₹18,420.00"}$$

### 2. Equal Split with Deterministic Remainder Distribution
When splitting total $T$ among $N$ participants:
$$\text{Base Share} = \lfloor T / N \rfloor, \quad R = T \pmod N$$
If $R > 0$:
1. $1\text{ extra paise}$ is allocated first to the **payer** (if participating).
2. Any remaining paise are allocated to participants sorted lexicographically by `UserId`.
3. Strict invariant: $\sum_{i} \text{Share}_i = T$ (guaranteed by assertion).

### 3. Net Balance Formulation
For each group member $i$:
$$\text{Net Balance}_i = \left(\sum \text{Contributions}_i - \sum \text{Shares}_i\right) + \left(\sum \text{Settlements Sent}_i - \sum \text{Settlements Received}_i\right)$$
- $\text{Net} > 0$: **Creditor** (should receive money $\rightarrow$ Green Sage Matcha badge).
- $\text{Net} < 0$: **Debtor** (owes money $\rightarrow$ Red Apricot Coral badge).
- $\text{Net} = 0$: **Settled** (even).

### 4. Deterministic Min-Flow Settlement Engine ($O(N \log N)$)
Instead of requiring $N(N-1)/2$ pairwise transfers, Papper Cutter solves debt minimization:
1. Partition members into **Creditors** ($C$) and **Debtors** ($D$).
2. Sort $C$ descending by credit amount; sort $D$ descending by debt amount (ties broken deterministically by ID).
3. Greedily match largest debtor with largest creditor:
   $$\text{Transfer} = \min(\text{Creditor Amount}, \text{Debtor Amount})$$
4. Decrement balances and advance pointers until all debts clear.
5. Produces at most $N - 1$ transactions.

### 5. Automated UPI Deep-Linking
For each generated transaction $T = (\text{From}, \text{To}, \text{Amount})$:
$$\text{upi://pay?pa=}\text{\{To.upi\_id\}}\text{\&pn=}\text{\{To.name\}}\text{\&am=}\text{\{AmountInRupees\}}\text{\&cu=INR\&tn=Papper+Cutter+Settlement}$$
Tapping **"📲 Pay via UPI"** directly launches Google Pay, PhonePe, or Paytm on mobile devices.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Rust** (1.80+ or latest stable)

---

### Option 1: Run the React Mobile App (Vite Dev Server)

```bash
# 1. Navigate to the frontend directory
cd android-app

# 2. Install dependencies (instant clean install)
npm install

# 3. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.  
*(Press `F12` $\rightarrow$ Toggle Device Toolbar to view in iPhone / Android mobile frame format).*

To verify code quality and build:
```bash
npm run lint    # Oxlint high-speed linting
npm run build   # TypeScript typecheck + production bundle
```

---

### Option 2: Run the Rust Domain & Mobile Workspace

```bash
# From repository root:

# 1. Run all domain financial unit tests
cargo test

# 2. Run the Dioxus mobile client
cargo run -p papper-cutter-mobile
```

*Note for Windows users:* The workspace includes a configured `.cargo/config.toml` that seamlessly links with LLVM-MinGW.

---

## 📖 Product & Architecture Documentation

- [AGENTS.md](AGENTS.md) — Non-negotiable engineering principles and rules of truth
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — Phased architectural roadmap and feature checklist
- [documentation.md](documentation.md) — Complete product surface and capabilities
- [solution.md](solution.md) — Problem space and positioning
- [user_flow.md](user_flow.md) — User journeys (first-time setup vs returning settlement)
- [idea_origin.md](idea_origin.md) — Product genesis and market insight
- [PRD](design-files/papper_cutter_product_requirements_document_prd.md) — Product Requirements Document

---

<p align="center">
  <img src="assets/primary_transparent.png" width="120" alt="Papper Cutter Logo Icon" />
  <br />
  <sub>Built with precision for seamless settlements. © 2026 Papper Cutter Team.</sub>
</p>
