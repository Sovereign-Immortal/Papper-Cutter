<p align="center">
  <img src="assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Banner" width="480" />
</p>

<p align="center">
  <strong>Native Android group-expense and settlement engine for trips, roommates, hostel groups, and friends.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20Mobile%20First-3DDC84?style=flat-square&logo=android" alt="Android" />
  <img src="https://img.shields.io/badge/Android%20APK-Capacitor%20%2B%20Dioxus%20Ready-3DDC84?style=flat-square&logo=android" alt="APK Ready" />
  <img src="https://img.shields.io/badge/Rust%20Mobile-Dioxus%200.6%20NDK-DEA584?style=flat-square&logo=rust" alt="Rust Dioxus" />
  <img src="https://img.shields.io/badge/Mobile%20App-React%2019%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react" alt="React Mobile" />
  <img src="https://img.shields.io/badge/Design-Warm%20Pastel%20Harmony-8B7BE8?style=flat-square" alt="Design" />
  <img src="https://img.shields.io/badge/Accounting-Integer%20Paise%20Precision-1A6B4B?style=flat-square" alt="Money" />
  <img src="https://img.shields.io/badge/Unit%20Tests-100%25%20Passing-brightgreen?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

> **"Papper Cutter is not just a website — it is a native-first Android application with complete APK generation pipelines."**
> 
> Engineered across two high-performance production pathways:
> 1. **Capacitor Mobile Core (`android-app/`)**: React 19 + TypeScript mobile shell with native Android Gradle packaging, camera receipt scanning, and 1-click UPI deep linking.
> 2. **Native Rust Mobile Client (`crates/papper-cutter-mobile/`)**: 100% pure Rust mobile client powered by **Dioxus 0.6**, compiling directly to native Android ARM64 APKs via the Android NDK.
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

This repository follows strict **Separation of Concerns** (Presentation → Feature Logic → Domain Business Rules → Infrastructure) as specified in [AGENTS.md](AGENTS.md):

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
  ```text
  Money(1842000 paise) → "₹18,420.00"
  ```

### 2. Equal Split with Deterministic Remainder Distribution
When splitting total $T$ among $N$ participants:

$$
\text{Base Share} = \lfloor T / N \rfloor, \quad R = T \pmod N
$$

If $R > 0$:
1. $1\text{ extra paise}$ is allocated first to the **payer** (if participating).
2. Any remaining paise are allocated to participants sorted lexicographically by `UserId`.
3. Strict invariant: $\sum_{i=1}^N \text{Share}(i) = T$ (guaranteed by assertion).

### 3. Net Balance Formulation
For each group member $i$:

$$
\text{Net Balance}(i) = \left(\sum \text{Contributions}(i) - \sum \text{Shares}(i)\right) + \left(\sum \text{Settlements Sent}(i) - \sum \text{Settlements Received}(i)\right)
$$

- $\text{Net} > 0$: **Creditor** (should receive money → Green Sage Matcha badge).
- $\text{Net} < 0$: **Debtor** (owes money → Red Apricot Coral badge).
- $\text{Net} = 0$: **Settled** (even).

### 4. Deterministic Min-Flow Settlement Engine ($O(N \log N)$)
Instead of requiring $N(N-1)/2$ pairwise transfers, Papper Cutter solves debt minimization:
1. Partition members into **Creditors** ($C$) and **Debtors** ($D$).
2. Sort $C$ descending by credit amount; sort $D$ descending by debt amount (ties broken deterministically by ID).
3. Greedily match largest debtor with largest creditor:

$$
\text{Transfer} = \min(\text{Creditor Amount}, \text{Debtor Amount})
$$

4. Decrement balances and advance pointers until all debts clear.
5. Produces at most $N - 1$ transactions.

### 5. Automated UPI Deep-Linking
For each generated transaction $T = (\text{From}, \text{To}, \text{Amount})$:

```text
upi://pay?pa={To.upi_id}&pn={To.name}&am={AmountInRupees}&cu=INR&tn=Papper+Cutter+Settlement
```

Tapping **"📲 Pay via UPI"** directly launches Google Pay, PhonePe, or Paytm on mobile devices.

---

## 🚀 Complete Step-by-Step Local Setup & Build Guide

Papper Cutter provides two distinct application builds that you can run and compile locally:
1. **The React 19 + TypeScript App & Website (`android-app/`)**: Run as an interactive responsive website or emulate a full-screen mobile app with live hot reloading (HMR), and compile to a native Android APK via Capacitor.
2. **The Native Rust Mobile App & Financial Domain (`crates/`)**: Run a 100% native Rust desktop simulation with Dioxus or compile directly to an Android APK via the Android NDK.

---

### Step 0: Installing System Prerequisites

Before running either build, ensure you have the required runtimes installed on your system:

#### 1. For the Web & React Mobile App (Node.js & npm)
- **Install Node.js (v18 or v20+ LTS)**:
  - Download the official installer from [nodejs.org](https://nodejs.org).
  - Verify installation in your terminal:
    ```bash
    node -v   # Expected: v18.x, v20.x, or v22.x
    npm -v    # Expected: 9.x or 10.x
    ```

#### 2. For the Rust Domain & Dioxus Native Mobile Client
- **Install Rust & Cargo**:
  - Install the official Rust toolchain via [rustup.rs](https://rustup.rs) (Windows: download and run `rustup-init.exe`).
  - Verify installation:
    ```bash
    rustc --version   # Expected: rustc 1.80+ (or latest stable)
    cargo --version   # Expected: cargo 1.80+
    ```
- **Install Dioxus CLI (`dx`)** (for mobile desktop simulation, hot-reload, and Android NDK builds):
  ```bash
  cargo install dioxus-cli --locked
  ```

---

### 💻 Walkthrough 1: Run the Website & React Mobile App (`npm`)

Follow these steps to run the interactive Web App locally, preview it as a mobile phone, or compile the Android APK:

#### 1. Navigate to the App Directory
```bash
cd android-app
```

#### 2. Install Project Dependencies
Run a clean install of all required packages (React 19, TypeScript, Lucide icons, Canvas Confetti, Vite):
```bash
npm install
```

#### 3. Start the Local Development Server
```bash
npm run dev
```
You will see output indicating the Vite dev server is running:
```text
  VITE v8.3.3  ready in 180 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 4. Open and Test in Your Browser
Open your browser to [http://localhost:5173](http://localhost:5173).
- **To view as a Website**: Interact directly on your screen (responsive layout scales cleanly).
- **To view as a Native Mobile Phone**:
  1. Press `F12` (or Right-Click → **Inspect**).
  2. Click the **Toggle Device Toolbar** icon (or press `Ctrl+Shift+M` on Windows, `Cmd+Shift+M` on Mac).
  3. Select **iPhone 14 Pro** or **Pixel 7** from the top device dropdown.
  4. Test mobile touch gestures, bottom navigation tabs (**Home**, **Groups**, **Activity**, **Profile**), the **Add Expense** sheet, and the **⚡ Settle Up** min-flow calculation!

#### 5. Verify Code Quality & Production Build
```bash
# Run ultra-fast Oxlint check:
npm run lint

# Compile production TypeScript bundle:
npm run build

# Preview the optimized production build locally:
npm run preview
```

#### 6. Package as an Android APK via Capacitor
```bash
# Add native Android wrapper (first time only):
npx cap add android

# Sync web build assets:
npx cap sync android

# Headless command-line build of debug APK:
cd android
./gradlew assembleDebug      # Windows PowerShell: .\gradlew.bat assembleDebug

# Output APK:
# android-app/android/app/build/outputs/apk/debug/app-debug.apk
```

**Running on a connected phone or Android emulator:**
```bash
# Via ADB:
adb install app/build/outputs/apk/debug/app-debug.apk

# Or open in Android Studio:
cd ..
npx cap open android
```

---

### 🦀 Walkthrough 2: Run the Native Rust Domain & Dioxus Mobile App (`cargo`)

Follow these steps to run the high-precision financial algorithms, run the desktop mobile simulator, or compile a native ARM64 Android APK:

#### 1. Navigate to the Project Root
```bash
cd ..    # If currently inside android-app, return to repository root
```

#### 2. Run the Domain Financial Unit Tests
Validate that integer minor units math, equal splits with remainder distribution, and min-flow debt minimization pass with 100% precision:
```bash
cargo test --workspace
```
Output:
```text
running 7 tests
test split::tests::test_percentage_split ... ok
test balance::tests::test_trip_balances ... ok
test split::tests::test_equal_split_with_remainder ... ok
test money::tests::test_format_inr ... ok
test settlement::tests::test_min_flow_settlement ... ok
test split::tests::test_unequal_split_validation ... ok
test money::tests::test_money_math ... ok

test result: ok. 7 passed; 0 failed
```

#### 3. Run the Native Mobile Client on Desktop
Launch the Dioxus client in a simulated native desktop window with the Android shell, status bar, and bottom navigation:
```bash
cargo run -p papper-cutter-mobile
```
*Note for Windows users:* The workspace includes a configured `.cargo/config.toml` that seamlessly links with LLVM-MinGW.

*Or with hot reloading enabled via Dioxus CLI:*
```bash
cd crates/papper-cutter-mobile
dx serve --platform desktop
```

#### 4. Compile Native Android APK via Rust NDK
```bash
# Add Android compilation targets:
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android

# Ensure ANDROID_NDK_HOME is set to your NDK folder:
# Windows PowerShell: $env:ANDROID_NDK_HOME = "C:\Users\<User>\AppData\Local\Android\Sdk\ndk\<version>"

# Build Native Android Release APK via Dioxus CLI:
cd crates/papper-cutter-mobile
dx build --platform android --release

# Or build headlessly via cargo-apk:
cargo install cargo-apk
cargo apk build --package papper-cutter-mobile --release

# Output APK:
# target/release/apk/papper_cutter_mobile.apk
```

**Install APK directly on phone:**
```bash
adb install -r target/release/apk/papper_cutter_mobile.apk
```

---

### 💡 Why Two Mobile Architectures?
- **TypeScript / Capacitor**: Provides ultra-fast UI iteration, rich web ecosystem integration, camera OCR receipt scanning, and instant Android APK packaging.
- **Rust / Dioxus**: Delivers 100% native CPU performance, zero JavaScript bridge latency, 60+ FPS native rendering, and complete binary memory safety directly on top of the deterministic financial ledger.

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
