<p align="center">
  <img src="assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Banner" width="480" />
</p>

# Papper Cutter — Complete Product Documentation

## 1. Product Overview

Papper Cutter is a group expense management application designed to simplify
shared money.

It tracks:

-   Who paid
-   What was paid
-   Who benefited
-   How much each person should contribute
-   Who owes money
-   Who should receive money
-   How the group can settle with fewer transactions

The application is suitable for trips, roommates, hostel groups, college
groups, friends, events, and shared purchases.

------------------------------------------------------------------------

# 2. Core Product Architecture

The product can be understood through six major layers:

``` text
Users
  ↓
Groups
  ↓
Expenses
  ↓
Splits
  ↓
Balances
  ↓
Settlements
```

Additional intelligence sits around this core:

``` text
AI Input
Receipt OCR
Analytics
Notifications
```

------------------------------------------------------------------------

# 3. Authentication

Authentication provides secure access to personal and group data.

Capabilities:

-   Sign up
-   Log in
-   Log out
-   Session persistence
-   Profile management
-   Password/account recovery where supported

The application should avoid unnecessary onboarding questions.

------------------------------------------------------------------------

# 4. User Profile

A user profile may contain:

-   Name
-   Profile image
-   Email or authentication identifier
-   Preferred currency
-   Notification preferences
-   Personal settings

The profile should remain lightweight.

------------------------------------------------------------------------

# 5. Groups

A group represents a shared financial context.

Examples:

``` text
Manali Trip
Room 304
Goa Trip
College Fest
Monthly Groceries
```

Each group contains:

-   Group identity
-   Members
-   Expenses
-   Balances
-   Settlements
-   Activity
-   Optional analytics

<p align="center">
  <img src="assets/web_assets/screenshots/group_detail.png" width="280" alt="Group Detail Screen" />
  <br />
  <em>Group Detail View with pulse spending card, member balances, and sub-tabs.</em>
</p>

------------------------------------------------------------------------

# 6. Group Creation

Users can create a group by entering:

-   Group name
-   Group type/category
-   Optional image
-   Members

The creator becomes a member automatically.

------------------------------------------------------------------------

# 7. Group Members

Members are people participating in the group's expenses.

Member information may include:

-   Name
-   Avatar
-   Current balance
-   Contribution
-   Share
-   Settlement status

A user can be part of multiple groups.

------------------------------------------------------------------------

# 8. Expenses

An expense is the fundamental financial record.

It should contain:

-   Unique ID
-   Group ID
-   Amount
-   Currency
-   Description
-   Category
-   Payer
-   Participants
-   Split type
-   Split details
-   Date/time
-   Notes
-   Receipt reference
-   Creation metadata

<p align="center">
  <img src="assets/web_assets/screenshots/add_expense.png" width="280" alt="Add Expense Modal" />
  <br />
  <em>Add Expense Bottom Sheet Modal with natural-language AI entry and category pills.</em>
</p>

------------------------------------------------------------------------

# 9. Expense Categories

Suggested categories:

-   Food
-   Travel
-   Stay
-   Shopping
-   Entertainment
-   Tickets
-   Groceries
-   Utilities
-   Rent
-   Education
-   Other

Categories should remain extensible.

------------------------------------------------------------------------

# 10. Equal Split

Every participant receives an equal share.

Example:

``` text
₹1,000
4 participants

₹250 each
```

Rounding must be handled deterministically.

------------------------------------------------------------------------

# 11. Unequal Split

Members can have different shares.

Example:

``` text
Harsh   ₹500
Rahul   ₹300
Aman    ₹200
```

The total must equal the expense amount.

------------------------------------------------------------------------

# 12. Percentage Split

Members receive percentage allocations.

Example:

``` text
Harsh   40%
Rahul   30%
Aman    20%
Piyush  10%
```

The total must equal 100%.

------------------------------------------------------------------------

# 13. Item-Based Split

A bill can be divided according to individual items.

Example:

``` text
Pizza     → Harsh + Rahul
Burger    → Aman
Drinks    → Everyone
```

This is particularly useful for restaurants.

------------------------------------------------------------------------

# 14. Expense Editing

Depending on permissions and product policy, users may edit:

-   Description
-   Amount
-   Participants
-   Split
-   Category
-   Notes
-   Receipt

Every edit should trigger a recalculation of affected balances.

Changes to important financial records should be auditable where
required.

------------------------------------------------------------------------

# 15. Expense Deletion

Deleting an expense affects group balances.

Therefore:

-   Ask for confirmation where appropriate.
-   Recalculate balances.
-   Update settlement suggestions.
-   Keep the UI synchronized.

If the product later implements financial audit history, deletion may
become a soft-delete operation instead.

------------------------------------------------------------------------

# 16. Balance Engine

The balance engine determines each member's net position.

Conceptually:

``` text
Net Balance
=
Total Contribution
-
Total Share
```

If positive:

> Member should receive money.

If negative:

> Member owes money.

If zero:

> Member is settled.

------------------------------------------------------------------------

# 17. Settlement Engine

The settlement engine converts net balances into payment suggestions.

<div align="center">
  <img src="./assets/web_assets/screenshots/smart_settlement.png" width="280" alt="Smart Settlement Flow" style="border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin: 16px 0;" />
  <p><em>Figure: Min-flow settlement algorithm with 1-click UPI payments (GPay, PhonePe, Paytm).</em></p>
</div>

Example:

``` text
Rahul → Harsh ₹500
Piyush → Harsh ₹740
```

The goal is to avoid unnecessary transactions.

This is a core piece of business logic and should be isolated from the
UI.

------------------------------------------------------------------------

# 18. Settlement Status

A settlement can move through states such as:

``` text
Suggested
↓
Pending
↓
Marked Paid
↓
Confirmed
↓
Settled
```

The exact state model can evolve with the backend.

------------------------------------------------------------------------

# 19. Settlement Optimization

The application should calculate a simplified set of transactions from
the net balances.

Example:

Before:

``` text
A → B
A → C
B → D
C → D
D → A
```

After netting:

``` text
A → D
C → B
```

The exact result depends on the balance state.

The important principle is:

> **Do not make users perform more payments than necessary.**

------------------------------------------------------------------------

# 20. Dashboard

The home dashboard is the user's financial overview.

<div align="center">
  <img src="./assets/web_assets/screenshots/home_dashboard.png" width="280" alt="Home Dashboard Overview" style="border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); margin: 16px 0;" />
  <p><em>Figure: Home Screen with net balance summary, active group cards, and quick actions.</em></p>
</div>

It can show:

### Personal balance

``` text
+ ₹1,240
You are owed
```

or:

``` text
- ₹740
You owe
```

### Active groups

Shows the groups the user is currently involved in.

### Recent activity

Shows recent expense and settlement events.

### Quick actions

-   Add Expense
-   Create Group
-   Join Group
-   View Settlements

------------------------------------------------------------------------

# 21. Group Dashboard

The group dashboard shows:

-   Group name
-   Total spending
-   Member count
-   Current user's balance
-   Recent expenses
-   Member balances
-   Settlement shortcut
-   Analytics shortcut

The most important information should appear first.

------------------------------------------------------------------------

# 22. Expense History

Expense history should allow users to see:

-   Description
-   Amount
-   Payer
-   Date
-   Category
-   Participants

Useful filtering:

-   Category
-   Member
-   Date
-   Amount
-   Settlement status

------------------------------------------------------------------------

# 23. Search

Search should eventually support:

-   Expense description
-   Member
-   Merchant
-   Category

Example:

> Search "dinner"

could show all dinner-related expenses.

------------------------------------------------------------------------

# 24. Analytics

Analytics should answer useful questions.

Examples:

### Total spent

> ₹18,420

### Category distribution

``` text
Stay        42%
Food        27%
Travel      18%
Activities  13%
```

### Member contribution

``` text
Harsh    ₹6,200
Rahul    ₹4,500
Aman     ₹3,720
Piyush   ₹4,000
```

### Trends

Show spending over time where sufficient data exists.

------------------------------------------------------------------------

# 25. Budget

A future budget feature can allow a group to set:

``` text
Trip Budget: ₹25,000
```

Then show:

``` text
Spent: ₹18,420
Remaining: ₹6,580
```

The system can warn users when spending approaches the budget.

------------------------------------------------------------------------

# 26. AI Natural-Language Expense Entry

Users can describe an expense naturally.

Example:

> "Rahul paid 1200 for dinner for me and Aman."

AI extracts structured data.

The system then shows a confirmation preview.

Important:

> AI helps with input. It does not own financial calculations.

------------------------------------------------------------------------

# 27. AI Expense Categorization

AI can suggest categories.

Example:

> "Uber from airport to hotel"

Suggested category:

> Travel

Users should be able to override the suggestion.

------------------------------------------------------------------------

# 28. Receipt Scanner

Receipt processing may extract:

-   Merchant
-   Total
-   Date
-   Items
-   Taxes
-   Category

Users review extracted information before confirmation.

------------------------------------------------------------------------

# 29. Smart Insights

Once enough data exists, the application can provide useful summaries.

Examples:

> Food was your group's largest expense this week.

> You spent 18% more on travel than planned.

> Three expenses are still unsettled.

Insights should be concise and actionable.

------------------------------------------------------------------------

# 30. Notifications

Useful notifications include:

-   Added expense
-   Expense edited
-   New group invitation
-   Settlement reminder
-   Settlement marked paid
-   Settlement confirmed
-   Budget warning

Avoid notification spam.

------------------------------------------------------------------------

# 31. Activity Feed

A group activity feed can show:

``` text
Harsh added Hotel — ₹6,000
Rahul added Dinner — ₹1,800
Aman marked ₹500 as paid
Piyush joined the group
```

This creates transparency within the group.

------------------------------------------------------------------------

# 32. Recurring Expenses

Useful for:

-   Rent
-   Wi-Fi
-   Electricity
-   Groceries
-   Subscriptions

Example:

``` text
Wi-Fi
₹800
Monthly
Split among 4 members
```

The system can generate the next occurrence according to the configured
schedule.

------------------------------------------------------------------------

# 33. Multiple Currencies

For travel scenarios, groups may use multiple currencies.

A future version can support:

-   Currency selection
-   Exchange-rate conversion
-   Base group currency
-   Clear display of converted values

Currency conversion must never silently alter the original transaction
amount.

------------------------------------------------------------------------

# 34. Offline / Sync Considerations

For a mobile-focused implementation, users may temporarily lose
connectivity.

A future architecture can support:

``` text
Local action
 ↓
Pending sync
 ↓
Server confirmation
```

The UI should clearly indicate whether an expense is:

-   Synced
-   Pending
-   Failed

Conflict resolution must be designed carefully before enabling offline
writes.

------------------------------------------------------------------------

# 35. Accessibility

The application should support:

-   Keyboard navigation
-   Screen readers
-   Proper labels
-   Focus management
-   Adequate contrast
-   Reduced motion
-   Large touch targets

Icons should support text, not replace essential information.

------------------------------------------------------------------------

# 36. Responsive Design

The interface should work on:

-   Mobile
-   Tablet
-   Desktop

Mobile prioritizes:

-   Quick actions
-   Current balance
-   Recent activity
-   Simple navigation

Desktop can expose more analytics and group information simultaneously.

------------------------------------------------------------------------

# 37. Security

Important security requirements:

-   Secure authentication
-   Server-side authorization
-   Group membership validation
-   Protected financial data
-   Secure receipt storage
-   No secrets in frontend code

A client must never be able to change another user's balance merely by
manipulating a request.

------------------------------------------------------------------------

# 38. Data Integrity

Financial data requires strong consistency.

Whenever an expense changes:

``` text
Expense
 ↓
Shares
 ↓
Balances
 ↓
Settlement Suggestions
 ↓
Analytics
```

All affected views must remain consistent.

------------------------------------------------------------------------

# 39. Performance

The application should remain responsive as groups grow.

Important strategies include:

-   Pagination
-   Efficient queries
-   Indexed database fields
-   Caching where appropriate
-   Lazy loading
-   Optimized images
-   Avoiding unnecessary client-side recalculation

------------------------------------------------------------------------

# 40. Future Features

Possible future expansion:

-   Payment provider integration
-   Direct payment links
-   Group invitations
-   Receipt OCR improvements
-   Advanced analytics
-   Budget planning
-   Currency conversion
-   Export to CSV/PDF
-   Recurring expenses
-   Smart reminders
-   Group chat
-   Event planning
-   AI financial summaries

These should be added without changing the core expense/settlement
architecture.

------------------------------------------------------------------------

# 41. Product Principle

The application should always reduce cognitive load.

Users should not have to think:

> "How do I calculate this?"

They should only have to answer:

> **"What happened?"**

Papper Cutter handles the rest.

------------------------------------------------------------------------

# 42. Native Android Mobile Architecture & APK Generation

Papper Cutter is designed as a **native mobile-first Android application**, supporting two production build pathways to produce installable Android packages (`.apk` and `.aab`):

### Pathway A: Capacitor Android APK (React + TypeScript Core)
- **Engine**: React 19 + TypeScript packaged via Capacitor 6 into a native Android Studio project.
- **Hardware Integration**: Native UPI intent dispatching (`android.intent.action.VIEW`), haptic vibrations, status bar styling, and local persistent SQLite/Preferences storage.
- **APK Compilation**:
  ```bash
  cd android-app
  npm install
  npm run build
  npx cap add android
  npx cap sync android
  cd android && ./gradlew assembleDebug      # Windows: .\gradlew.bat assembleDebug
  # Output: android-app/android/app/build/outputs/apk/debug/app-debug.apk
  ```

### Pathway B: Native Rust Dioxus Android APK (Rust + NDK)
- **Engine**: 100% native Rust binary built on **Dioxus 0.6** (`crates/papper-cutter-mobile`).
- **Zero Bridge Overhead**: Links directly with `papper-cutter-domain`, running natively on Linux/Android ARM64 kernels with 60+ FPS native rendering and zero JavaScript runtime latency.
- **APK Compilation**:
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
  cd crates/papper-cutter-mobile
  dx build --platform android --release
  # Or via cargo-apk:
  cargo apk build --package papper-cutter-mobile --release
  # Output: target/release/apk/papper_cutter_mobile.apk
  ```
