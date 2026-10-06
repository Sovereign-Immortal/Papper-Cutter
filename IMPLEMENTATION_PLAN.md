<p align="center">
  <img src="assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Banner" width="480" />
</p>

# Papper Cutter — Implementation Plan & Architecture Specification

**Stack defaults & engineering contracts**

| Concern | Choice | Specification |
| :--- | :--- | :--- |
| **Mobile App (Web/Android)** | React 19 + TypeScript (Vite 8) | Mobile-first ergonomic PWA with Android phone container |
| **Native Mobile Target** | Dioxus 0.6 + Rust | Shared cross-platform Rust domain binding |
| **UI Design System** | Warm Pastel Harmony | [DESIGN.md](design-files/stitch_app_concept_studio/warm_pastel_harmony/DESIGN.md) (Plus Jakarta Sans, cozy cards) |
| **Domain Logic** | Pure Financial Math | Minor currency units (paise) math, zero float rounding |
| **Precision** | `i64` integer paise only | 1 INR = 100 paise; format at boundary |
| **Settlement Engine** | Deterministic Min-Flow Matching | Greedy matching partitions ($O(N \log N)$) |

---

## 1. Product North Star

From root documentation ([solution.md](solution.md), [PRD](design-files/papper_cutter_product_requirements_document_prd.md)):

> **Record who paid → Calculate fair shares → Live net balances → Fewest settlement payments via UPI.**

Primary user question: **"What do I owe, and who do I need to pay?"**

---

## 📱 Concept Studio & UI Showcase

<p align="center">
  <img src="assets/web_assets/screenshots/home_dashboard.png" width="22%" alt="Home Dashboard" />
  <img src="assets/web_assets/screenshots/group_detail.png" width="22%" alt="Group Detail" />
  <img src="assets/web_assets/screenshots/smart_settlement.png" width="22%" alt="Smart Settlement" />
  <img src="assets/web_assets/screenshots/add_expense.png" width="22%" alt="Add Expense Modal" />
</p>

---

## 2. Workspace Layout & Four-Layer Architecture

In strict adherence to [AGENTS.md](AGENTS.md):

```text
Presentation Layer (React Mobile + Capacitor Android APK / Dioxus Native Rust Android NDK)
    ↓
Application & State Coordination Layer (AppContext / Reducers)
    ↓
Domain / Business Rules (Money, Splits, Balances, Min-Flow Settlement)
    ↑
Data & Infrastructure Layer (API, Local Storage, UPI Deep Links)
```

### Physical Directory Tree

```text
Papper-Cutter/
├── assets/                               # Brand logos, icons, wordmarks, and screenshot artifacts
│   ├── Primarylogo.png
│   ├── primary_transparent.png
│   └── web_assets/
│       ├── papper_cutter_logo_horizontal.png
│       ├── papper_cutter_icon.png
│       └── screenshots/
│
├── android-app/                          # React 19 + TypeScript + Vite mobile application
│   ├── src/
│   │   ├── domain/                       # Pure financial business rules (TypeScript)
│   │   │   ├── money.ts                 # Integer paise precision (Money class & Indian formatting)
│   │   │   ├── split.ts                 # Equal, unequal, and percentage split calculations
│   │   │   ├── balance.ts               # Net balance aggregation equation
│   │   │   ├── settlement.ts            # Min-flow greedy settlement optimizer & UPI generator
│   │   │   └── types.ts                 # Domain models (User, Group, Expense, Category, etc.)
│   │   ├── state/                       # App state management
│   │   │   ├── sampleData.ts            # Realistic trip data (Manali Trip, Room 304, College Fest)
│   │   │   ├── AppContext.tsx           # Reactive global state provider
│   │   │   └── useApp.ts                # Fast-refresh custom context hook
│   │   ├── components/                  # Modular UI components
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

## 3. Methods & Domain Mathematical Architecture

### 3.1 Financial Precision (Integer Minor Units)
Ledger values represent minor currency units (**paise**):
- **Never** perform addition, subtraction, or split ratios in floating point.
- Conversions to/from major units (rupees) only occur at the user boundary.
- Display helper uses the Indian grouping system:
  ```text
  formatINR(150000) = "₹1,500.00", formatINR(1842000) = "₹18,420.00"
  ```

### 3.2 Equal Split Algorithm with Deterministic Remainder
Given total paise $T$ and $N$ group participants:

$$
\text{Base} = \lfloor T / N \rfloor, \quad R = T \pmod N
$$

1. If $R > 0$ and the payer is a participant, assign $1\text{ extra paise}$ to the payer.
2. If $R > 1$, allocate remaining single paise to participants sorted by `user_id` lexicographically.
3. Invariant check: $\sum_{i=1}^N \text{Share}(i) \equiv T$.

### 3.3 Group Net Balance Formulation
For each group member $i$:

$$
\text{Net Balance}(i) = \left(\sum \text{Contributions}(i) - \sum \text{Shares}(i)\right) + \left(\sum \text{Sent Settlements}(i) - \sum \text{Received Settlements}(i)\right)
$$

- $\text{Net} > 0$: **Creditor** (should receive money → Sage Matcha `#1A6B4B`).
- $\text{Net} < 0$: **Debtor** (owes money → Soft Apricot `#91462E`).
- $\text{Net} = 0$: **Settled** (even).

### 3.4 Min-Flow Settlement Optimization ($O(N \log N)$)
Instead of requiring $N(N-1)/2$ pairwise peer-to-peer transfers:
1. Filter members with $\text{Net} > 0$ into **Creditors** ($C$) and $\text{Net} < 0$ into **Debtors** ($D$).
2. Sort $C$ descending by credit amount; sort $D$ descending by debt amount.
3. Match the largest debtor with the largest creditor:

$$
\text{Payment Amount} = \min(\text{Creditor Head}, \text{Debtor Head})
$$

4. Decrement debt and credit balances and advance pointers.
5. Guaranteed to minimize total transaction count down to at most $N - 1$.

### 3.5 Automated UPI Deep-Linking
For each generated transaction $T = (\text{From}, \text{To}, \text{Amount})$:

```text
upi://pay?pa={To.upi_id}&pn={To.name}&am={AmountInRupees}&cu=INR&tn=Papper+Cutter+Settlement
```

Tapping **"📲 Pay via UPI"** directly triggers payment apps (Google Pay, PhonePe, Paytm).

---

## 4. UI/UX Direction: Warm Pastel Harmony

Design tokens mapped directly from [DESIGN.md](design-files/stitch_app_concept_studio/warm_pastel_harmony/DESIGN.md):

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--bg-canvas` | `#FAF7F2` | Warm Cozy Cream base background |
| `--surface-card` | `#FFFFFF` | Crisp elevated container card |
| `--surface-low` | `#FDF2E8` | Warm Linen subtle pill / chip background |
| `--surface-high` | `#F1E6DD` | Soft Oat navigation rail / sub-tab track |
| `--surface-border` | `#EFE8DF` | Hairline border separator |
| `--primary` | `#8B7BE8` | Gentle Lavender primary action accent |
| `--primary-dark` | `#6B5CA5` | Deep Lavender active button state |
| `--primary-light` | `#E5DEFF` | Lavender tint pill badge |
| `--credit-text` | `#1A6B4B` | Sage Matcha positive balance ("You are owed") |
| `--credit-bg` | `#E8F8F0` | Sage Matcha pill background |
| `--credit-border` | `#A5F3CA` | Sage Matcha card outline |
| `--debt-text` | `#91462E` | Soft Apricot Coral negative balance ("You owe") |
| `--debt-bg` | `#FFF0ED` | Soft Apricot pill background |
| `--debt-border` | `#FFDAD6` | Soft Apricot card outline |
| `--radius-card` | `26px` | Soft pill-like card curvature |
| `--radius-pill` | `9999px` | Fully rounded ergonomic buttons |

---

## 5. Phased Delivery Roadmap & Current Status

### Phase 0 — Foundation & Environment (Completed)
- [x] Multi-crate workspace setup (`crates/papper-cutter-domain`, `crates/papper-cutter-mobile`)
- [x] Windows MinGW/LLVM toolchain configuration ([`.cargo/config.toml`](.cargo/config.toml))
- [x] Pure financial domain algorithms in Rust (`Money`, `split`, `balance`, `settlement`)
- [x] 100% Rust unit test coverage passing (`cargo test`)
- [x] Complete TypeScript domain port (`money.ts`, `split.ts`, `balance.ts`, `settlement.ts`, `types.ts`)
- [x] Mobile React 19 + TypeScript application initialized and built with Vite 8

### Phase 1 — MVP Ledger & Mobile Experience (Completed)
- [x] In-memory reactive state with seed trip groups (Manali Trip, Room 304, College Fest)
- [x] Home Dashboard with Net Balance Cushion Card & Active Groups Carousel
- [x] Group Pulse Header Card with total spent and user share
- [x] Group Balances subtab with credit/debt pill badges
- [x] Smart Settle subtab with min-flow minimization banner ($N^2 \rightarrow N-1$)
- [x] Automated UPI deep-link generation (`upi://pay?pa=...`)
- [x] Interactive "Mark Paid ✓" tracking with live debt recalculation & celebration empty state
- [x] AI Natural-Language Expense Entry modal with one-click test chips
- [x] Category analytics breakdown with progress bars
- [x] All Expenses filterable feed and Profile view
- [x] Comprehensive documentation and visual asset integration

### Phase 2 — Backend Persistence & Auth (Next Phase)
- [ ] Axum HTTP API service
- [ ] SQLite / PostgreSQL schema migrations
- [ ] Passwordless or session authentication
- [ ] Real-time sync across group members
- [ ] Receipt OCR document upload scanner

---

## 6. How to Run Locally & Build Android APKs

### 1) Run the React Mobile App (Vite)
```bash
cd android-app
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. (Use device toggle `F12` for mobile preview).

### 2) Build Android APK via Capacitor (React + TypeScript)
```bash
cd android-app
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug   # Windows: .\gradlew.bat assembleDebug
# Output: android-app/android/app/build/outputs/apk/debug/app-debug.apk
```

### 3) Run & Build Native Rust Dioxus Android APK
```bash
# Test domain algorithms:
cargo test

# Run desktop mobile simulator:
cargo run -p papper-cutter-mobile

# Build native Android ARM64 release APK (NDK):
cd crates/papper-cutter-mobile
dx build --platform android --release
# Or via cargo-apk:
cargo apk build --package papper-cutter-mobile --release
# Output: target/release/apk/papper_cutter_mobile.apk
```

---

<p align="center">
  <img src="assets/primary_transparent.png" width="100" alt="Papper Cutter Logo" />
  <br />
  <sub>Papper Cutter Engineering Architecture • Updated October 2026</sub>
</p>
