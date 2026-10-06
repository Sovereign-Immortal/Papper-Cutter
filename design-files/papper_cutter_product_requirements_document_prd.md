# Papper Cutter — Product Requirements Document (PRD)

---

## 1. Document Overview
* **Product Name:** Papper Cutter
* **Document Version:** 1.0.0
* **Status:** Ready for Engineering & Review
* **Target Audience:** Product Managers, Mobile/Frontend Engineers, Backend Engineers, UI/UX Designers

---

## 2. Executive Summary & Problem Definition

### 2.1 The Problem
When friends, roommates, colleagues, or travel groups spend money together, payments happen asynchronously across different members, categories, and split ratios. 
Traditional approaches (WhatsApp chats, paper notes, spreadsheets, manual calculator formulas) introduce severe friction:
* Confusion over "who owes whom" after multiple days and mixed participation.
* Overly complex, circular transactions (e.g., A owes B, B owes C, C owes A).
* Anxiety and awkward social dynamics surrounding debt collection and reminders.
* Friction in expense recording, leading to forgotten receipts and lost personal funds.

### 2.2 The Solution
**Papper Cutter** is a calm, mobile-first shared expense tracking and automated settlement platform. It converts fragmented payment events into a continuous, real-time balance ledger, optimizes multi-party debt down to the minimum direct transactions, and enables near-instant expense capture via AI natural language parsing and receipt OCR.

### 2.3 Core Value Proposition
> *"UPI moves money. Papper Cutter organizes the intelligence and logic before the payment."*

---

## 3. Goals & Key Performance Indicators (KPIs)

### 3.1 Product Goals
1. **Effortless Expense Capture:** Enable users to log an expense in under 5 seconds (via manual input, natural language prompt, or receipt snap).
2. **Deterministic Financial Accuracy:** 100% deterministic, zero-drift balance calculations with integer-precision ledger math.
3. **Frictionless Settlements:** Reduce the average number of inter-member settlement payments by ≥ 60% using net-flow minimization algorithms.
4. **Cozy, Low-Stress Experience:** Minimize financial awkwardness through warm, pastel-tinted, comforting aesthetics and non-adversarial UX copy.

### 3.2 Key Metrics (KPIs)
* **Time-to-Log-Expense:** Median < 6 seconds.
* **Settlement Efficiency Ratio:** Total transactions created vs. raw pairwise debts (Target: > 50% reduction).
* **Payment Completion Rate:** % of generated settlement plans settled and confirmed within 7 days.
* **AI Parse Acceptance Rate:** % of natural language suggestions accepted by user without manual field edits (> 85%).

---

## 4. User Personas & Core Journeys

| Persona | Context & Pain Points | Primary Jobs to be Done |
| :--- | :--- | :--- |
| **Harsh (The Trip Planner)** | Organizes vacation trips for 4–8 people; pays large upfront bookings (hotels, cabs) and struggles to track uneven splits. | Create groups, log lump sums, review member balances at a glance, and initiate group settlement. |
| **Rahul (The Casual Eater)** | Dines out with friends; forgets who participated in shared dishes and hates complicated math. | Speak or type a quick sentence ("I paid 1800 for dinner for me, Rahul and Aman") and confirm. |
| **Piyush (The Roommate)** | Shares recurring apartment expenses (utilities, Wi-Fi, groceries) with roommates on different payment cycles. | View personal net balance (+/-) instantly, pay via UPI deep-link, and get receipts verified. |

---

## 5. Information Architecture & Scope

```text
Settle Mobile App
├── Home Dashboard
│   ├── Net Balance Overview (You are owed / You owe)
│   ├── Quick Actions (Settle Up, Analytics)
│   ├── Active Groups Carousel (Manali Trip, Room 304, etc.)
│   └── Recent Activity Feed
├── Group Detail
│   ├── Trip / Group Pulse Card (Total spent, Net balance)
│   ├── Tabbed Navigation (Expenses, Balances, Settle, Analytics)
│   ├── Member Balances Grid (Per-member credit/debt cards)
│   └── Expense Timeline
├── Add Expense Modal / Screen
│   ├── Smart AI Natural Language Input & Parse Confirmation
│   ├── Currency & Amount Input (Big numeric focus)
│   ├── Category Picker (Food, Travel, Stay, Tickets, Groceries)
│   ├── Payer Selection (Single or Multi-payer)
│   ├── Split Mechanisms (Equal, Unequal, Percentage, Itemized)
│   └── Auxiliary Tools (Receipt OCR, Notes)
└── Smart Settlement Engine
    ├── Debt Simplification Summary (Transactions reduced metric)
    ├── Net Balances Status
    ├── Optimized Settlement Transaction Cards (Pay via UPI, Send Reminder)
    └── Lifecycle Tracking (Pending → Marked as Paid → Settled & Confirmed)
```

---

## 6. Functional Requirements & Feature Specifications

### 6.1 Authentication & Profile
* **FR-1.1:** Lightweight onboarding requiring only Name, Mobile Number / Email, and Default Currency (₹ INR default).
* **FR-1.2:** Session persistence; returning users land directly on the Home Dashboard without onboarding screens.

### 6.2 Groups Management
* **FR-2.1:** Create group with name, icon/cover photo, and category (Trip, Roommates, Event, Project).
* **FR-2.2:** Member invitation via shareable deep link, phone contact sync, or direct code.
* **FR-2.3:** Live balance calculation per member reflecting all non-deleted, confirmed expenses.

### 6.3 Expense Management & Split Engine
* **FR-3.1:** Fast numeric entry with integer minor unit handling (e.g. ₹1,800 stored as 180,000 paise) to prevent floating-point rounding errors.
* **FR-3.2 Split Types:**
  * **Equal Split:** $\text{Share} = \lfloor \text{Total} / N \rfloor$ with automated deterministic 1-paise allocation to payer for remainder.
  * **Unequal Split:** Exact currency amounts entered per member; validated against total sum.
  * **Percentage Split:** Validated to strictly equal 100.0%.
  * **Item-Based Split:** Line items assigned to specific participant sub-groups.
* **FR-3.3 Smart Natural Language Entry (AI):**
  * Input string parsing (e.g., *"Rahul paid 1800 for dinner for me, Rahul and Aman"*).
  * System extracts amount, category, payer, and participant list.
  * AI output **must be pre-filled into interactive fields for user review and confirmation** before ledger commit. AI never commits financial data autonomously.
* **FR-3.4 Receipt OCR:** Extract merchant, total, date, and line items from camera/photo upload for confirmation.

### 6.4 Smart Settlement Engine (Min-Flow Optimization)
* **FR-4.1 Net Balance Derivation:**
  $$\text{Net Balance}_i = \sum \text{Contributions}_i - \sum \text{Shares}_i$$
* **FR-4.2 Debt Minimization Algorithm:**
  * Partition group members into Creditors ($\text{Net} > 0$), Debtors ($\text{Net} < 0$), and Settled ($\text{Net} = 0$).
  * Greedily match maximum debtor with maximum creditor to generate minimal payment pairs ($O(N \log N)$).
* **FR-4.3 Payment & Settlement Lifecycle:**
  * State 1: `Pending` (Action: `Pay via UPI`, `Send Reminder`).
  * State 2: `Marked as Paid` (Debtor marks transfer complete).
  * State 3: `Settled & Confirmed` (Creditor confirms receipt, updating ledger to zero).
* **FR-4.4 Payment Integration:** Deep-link to UPI handler apps (GPay, PhonePe, Paytm, Cred) using `upi://pay?pa=...&pn=...&am=...`.

---

## 7. Non-Functional & Technical Requirements

### 7.1 Financial Precision & Integrity
* All monetary values must be represented and stored as **64-bit integers in minor units (paise/cents)**. Floating-point types are strictly disallowed in math routines.
* Ledger state recalculations must be idempotent and deterministic.

### 7.2 Performance & Responsiveness
* Home dashboard & group ledger load time < 800ms on 4G networks.
* Local optimistic UI updates on expense submission with background sync retry.

### 7.3 Accessibility & Usability (WCAG 2.1 AA)
* Dual status signaling: Never rely on color alone (e.g., use `+ ₹1,240 You are owed 🟢` and `- ₹500 You owe 🔴`).
* Touch targets: Minimum 44 × 44 pt for all interactive touch controls.
* High contrast typography with accessible fallback system fonts.

---

## 8. Design System & Aesthetic Specifications

* **Design Language:** Warm Pastel Harmony (Comfy Style).
* **Visual Personality:** Low-stress, approachable, pillowy, premium modern iOS feel.
* **Surfaces:** Warm linen/cream backgrounds (`#FFF8F4`, `#FDF2E8`).
* **Primary Accent:** Soothing lavender violet (`#8B7BE8`).
* **Semantic Tones:**
  * Positive / Credit / Settled: Soft mint sage (`#72C496`, `#E8F8F0`).
  * Debt / Owed: Soft peach apricot (`#FFB4A2`, `#FFF0ED`).
* **Geometry:** Generous organic corner radii (`rounded-3xl` / 24–28px), pill chips (`rounded-full`), soft tactile container borders without harsh dark outlines.

---

## 9. Release Milestones & Roadmap

| Phase | Milestone | Deliverables |
| :--- | :--- | :--- |
| **Phase 1 (MVP)** | Core Ledger & Simplification | Authentication, Group creation, Manual Expense Entry (Equal & Unequal splits), Net Balance calculations, Min-Flow Settlement view with UPI deep-linking. |
| **Phase 2** | Smart AI & OCR | Natural-language AI input parser, Receipt camera capture & OCR line item allocation, Push notification reminders. |
| **Phase 3** | Analytics & Advanced Splits | Itemized dining split builder, Category spending analytics & charts, Group budget alerts, Multi-currency travel support. |
| **Phase 4** | Offline & Sync | Local SQLite caching, conflict-free offline expense entry, and instant QR code peer settlement. |
