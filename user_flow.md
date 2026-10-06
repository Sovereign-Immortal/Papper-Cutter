<div align="center">
  <img src="./assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Logo" width="440" />
  <p><strong>Complete User Journey & Screen State Specification</strong></p>

  [![Design System](https://img.shields.io/badge/Design_System-Warm_Pastel_Harmony-E07A5F?style=flat-square)](#23-design-system-touchpoints)
  [![Platform](https://img.shields.io/badge/Platform-iOS_Mobile_First-000000?style=flat-square&logo=apple)](android-app/)
  [![Status](https://img.shields.io/badge/Status-Fully_Interactive-success?style=flat-square)](http://localhost:5173)
</div>

---

# Papper Cutter — Complete User Flow & UI Journey

This document details the exact journey of both **first-time users** and **returning active users** across the Papper Cutter application.

The design philosophy balances **immediate onboarding clarity** with **zero-friction daily expense entry**.

---

## 1. High-Level Application Architecture Flow

``` text
                     OPEN APP
                        │
                        ↓
                 Check Authentication
                        │
               ┌────────┴────────┐
               ↓                 ↓
          New / Logged Out    Existing User
               │                 │
               ↓                 ↓
         Welcome / Login       Load Home
               │                 │
               ↓                 ↓
         Create Account       Active Groups
               │                 │
               ↓                 ↓
       Basic Onboarding       Recent Activity
               │                 │
               └────────┬────────┘
                        ↓
                      HOME
                        │
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
       Groups        Expenses       Profile
         │
         ↓
    Select / Create Group
         │
         ↓
    Group Dashboard
         │
         ├── Add Expense (Equal / Unequal / Splits)
         ├── View Expenses & Receipts
         ├── View Member Balances
         ├── Smart Settle (Min-Flow Bipartite)
         ├── Manage Members
         └── Group Analytics
```

---

## 2. New User Journey: Zero to "Aha!" Moment

```
  [1. Welcome Screen] ──► [2. One-Tap Profile] ──► [3. Create Group] ──► [4. First Expense] ──► [5. Instant Netting Aha!]
```

### Step 1 — App Launch & Welcome Screen
A new user launches Papper Cutter. No existing local session is detected.
- **Headline**: *"Split expenses. Settle smarter."*
- **Supporting**: *"Track shared expenses, see who owes whom in real-time, and settle your entire group in the fewest possible UPI transactions."*
- **Primary Action**: `Get Started`
- **Secondary Action**: `I already have an account`

### Step 2 — Rapid Onboarding
Lightweight, friction-free profile creation:
- Name input (e.g., "Harsh")
- Default currency selection (e.g., `₹ INR`, `$ USD`, `€ EUR`)
- Optional UPI ID for direct 1-click settlements (`harsh@okaxis`)

---

## 3. Home Dashboard & Group Navigation

<div align="center">
  <img src="./assets/web_assets/screenshots/home_dashboard.png" width="280" alt="Home Dashboard UI" style="border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin: 16px 0;" />
  <p><em>Home Screen: Net balance hero card, active trip squads, and fast-action pills.</em></p>
</div>

### Existing User Experience:
When an authenticated user opens Papper Cutter:
1. **Net Balance Hero Card**: Displays total net standing across all groups (e.g., `+₹1,240 You are owed` or `-₹740 You owe`).
2. **Active Squad Cards**: Direct access to pinned groups (e.g., *Manali Roadtrip*, *Flat 402*, *Goa Weekend*).
3. **Recent Group Activity**: Chronological audit feed of recent payments and settlements.
4. **Bottom Dock**: Fixed ergonomic iOS tab bar with quick navigation between **Home**, **Groups**, **Activity**, and **Profile**.

---

## 4. Group Detail & Real-Time Balance Hub

<div align="center">
  <img src="./assets/web_assets/screenshots/group_detail.png" width="280" alt="Group Detail Screen" style="border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin: 16px 0;" />
  <p><em>Group Detail: Group spending total, individual balances (+/-), and expense feed.</em></p>
</div>

### User Actions in Group View:
- **Total Spent Banner**: Group aggregate with minor-unit accuracy.
- **Individual Balances Breakdown**:
  - `Harsh: +₹3,300` (Creditor)
  - `Rahul: -₹1,200` (Debtor)
  - `Aman: -₹1,100` (Debtor)
  - `Piyush: -₹1,000` (Debtor)
- **Primary CTA Buttons**:
  - `+ Add Expense`: Launches the modal sheet.
  - `⚡ Settle Up`: Triggers min-flow transaction optimization.

---

## 5. Adding an Expense (Multi-Mode Split Sheet)

<div align="center">
  <img src="./assets/web_assets/screenshots/add_expense.png" width="280" alt="Add Expense Modal" style="border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin: 16px 0;" />
  <p><em>Add Expense Sheet: Minor-unit amount input, category picker, and split modes.</em></p>
</div>

### Split Modes Supported:
1. **Equal Split**: Even division with remainder paise distributed deterministically to preserve total conservation.
2. **Unequal Split**: Custom numeric amounts per member with real-time validation against the total.
3. **Percentage Split**: Percentage weights per member totaling exactly 100%.
4. **Item-Based Split**: Specific dishes or receipts tagged to specific consumers.

---

## 6. Smart Settlement & 1-Click UPI Payment Flow

<div align="center">
  <img src="./assets/web_assets/screenshots/smart_settlement.png" width="280" alt="Smart Settlement Modal" style="border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin: 16px 0;" />
  <p><em>Smart Settlement: Minimal transaction plan with 1-click UPI deep links.</em></p>
</div>

### Step-by-Step Settlement Lifecycle:
```
  [1. Click Settle Up]
          │
          ▼
  [2. Min-Flow Greedy Match]  (Creditor MaxHeap & Debtor MaxHeap minimize transfer count)
          │
          ▼
  [3. View Optimal Plan]      (e.g., Rahul pays Harsh ₹1,200, Aman pays Harsh ₹1,100)
          │
          ▼
  [4. One-Click Pay Button]   (Dispatches native UPI intent: GPay / PhonePe / Paytm / BHIM)
          │
          ▼
  [5. Mark as Settled]        (Instantly updates net balances to zero)
```

---

## 7. Comparison: First-Time vs. Returning Flow

| Experience Stage | First-Time User | Returning Active User |
| :--- | :--- | :--- |
| **App Launch** | Warm welcome screen with value prop | Instant Home Dashboard load |
| **Authentication** | One-tap fast setup | Auto-restored local session |
| **Group View** | Setup walkthrough & empty state | Active group cards with live balances |
| **Expense Entry** | Guided category & split tutorial | 2-tap fast expense modal |
| **Settlement** | Educational overview of min-flow | 1-click direct UPI deep linking |

---

## 8. Design System Touchpoints

All screens adhere to the **Warm Pastel Harmony** visual tokens:
- **Terracotta Primary** (`#E07A5F`): Primary CTA buttons, positive badges, highlights.
- **Deep Navy Text** (`#3D405B`): High-contrast readable typography.
- **Sage Success** (`#81B29A`): Positive balance indicators and settled states.
- **Cream Canvas** (`#F4F1DE`): Warm, paper-like background reducing eye fatigue.
- **Corner Radii**: 16px to 24px rounded iOS cards.
- **Touch Targets**: Minimum 44×44px interactive areas.

---

## 9. How to Test the Flow Locally

1. Run the interactive web app:
   ```powershell
   cd android-app
   npm run dev
   ```
2. Navigate to [http://localhost:5173](http://localhost:5173).
3. Test the flow:
   - Click on the **"Manali Roadtrip"** group card.
   - Tap **"+ Add Expense"** to log a ₹1,200 dinner split.
   - Tap **"⚡ Settle Up"** to observe the min-flow transaction graph and test UPI links.

---

<div align="center">
  <p><strong>Papper Cutter</strong> • Designed for clarity, crafted for human connection.</p>
</div>
