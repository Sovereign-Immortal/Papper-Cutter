<p align="center">
  <img src="../assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Banner" width="420" />
</p>

# Papper Cutter — Mobile Android Application

Mobile-first React application for **Papper Cutter**, implementing the **Warm Pastel Harmony** design system with integer minor units accounting and the min-flow settlement engine.

---

## 📱 Mobile Screens

<p align="center">
  <img src="../assets/web_assets/screenshots/home_dashboard.png" width="23%" alt="Home Dashboard" />
  <img src="../assets/web_assets/screenshots/group_detail.png" width="23%" alt="Group Detail" />
  <img src="../assets/web_assets/screenshots/smart_settlement.png" width="23%" alt="Smart Settlement" />
  <img src="../assets/web_assets/screenshots/add_expense.png" width="23%" alt="Add Expense Modal" />
</p>

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Linter**: Oxlint
- **Design System**: Warm Pastel Harmony (Plus Jakarta Sans, cozy card ergonomics)
- **Financial Math**: Strict integer paise precision (`src/domain/`)

---

## 📁 Source Code Structure

```text
android-app/
├── src/
│   ├── domain/               # Pure financial business logic
│   │   ├── money.ts         # Money class in minor units (paise) with Indian notation
│   │   ├── split.ts         # Deterministic remainder equal & percentage splits
│   │   ├── balance.ts       # Group net balance calculation
│   │   ├── settlement.ts    # Min-flow greedy settlement matching & UPI links
│   │   └── types.ts         # User, Group, Expense, Category models
│   ├── state/
│   │   ├── sampleData.ts    # Seed data (Manali Trip, Room 304, College Fest)
│   │   ├── AppContext.tsx   # Reactive state provider
│   │   └── useApp.ts        # Custom hook for context
│   ├── components/
│   │   ├── layout/          # Android device shell, StatusBar, BottomNavBar
│   │   ├── home/            # Balance cushion, group carousel, recent feed
│   │   ├── group/           # Group pulse header, expenses, balances, settle, analytics, members
│   │   ├── expense/         # AI natural language entry sheet & all expenses list
│   │   └── profile/         # User profile, UPI ID, app preferences
│   ├── index.css            # Design tokens & responsive mobile frame
│   ├── App.tsx              # Main controller
│   └── main.tsx             # React DOM entry point
├── package.json
└── vite.config.ts
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server with hot reload
npm run dev
```

Open `http://localhost:5173` in your browser.  
Press `F12` $\rightarrow$ Toggle Device Toolbar to inspect in phone view.

### Verification Commands

```bash
npm run lint    # Oxlint lint check
npm run build   # TypeScript typecheck + production Vite bundle
npm run preview # Preview the production build locally
```

---

<p align="center">
  <img src="../assets/primary_transparent.png" width="80" alt="Papper Cutter Logo Icon" />
</p>
