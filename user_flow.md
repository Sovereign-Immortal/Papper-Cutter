# User Flow.md

# Settle --- User Flow

This document describes what happens when a **new user** and an
**existing user** open the application.

The goal is to make the first experience extremely simple while allowing
returning users to reach their active groups immediately.

------------------------------------------------------------------------

# 1. High-Level Application Flow

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
        ├── Add Expense
        ├── View Expenses
        ├── View Balances
        ├── Settle
        ├── Members
        └── Analytics
```

------------------------------------------------------------------------

# 2. New User Flow

## Step 1 --- App Launch

A new user opens Settle.

The app checks whether a valid session exists.

No session is found.

The user sees the welcome screen.

------------------------------------------------------------------------

# 3. Welcome Screen

The screen should communicate the product in one sentence.

Example:

> **Split expenses. Settle smarter.**

Supporting text:

> Track shared expenses, see who owes whom, and settle your group with
> fewer payments.

Primary action:

> **Get Started**

Secondary action:

> **I already have an account**

------------------------------------------------------------------------

# 4. Account Creation

The user can create an account using the supported authentication
method.

The flow should be short.

Do not ask for unnecessary information during signup.

Required information should be limited to what is necessary to start
using the application.

------------------------------------------------------------------------

# 5. Basic Onboarding

After registration, show a short onboarding flow.

Potential questions:

### Name

> What should we call you?

### Use Case

> What will you use Settle for?

Options:

-   Trips
-   Roommates
-   College
-   Friends
-   Other

This information can personalize the initial experience but should not
block the user from using the product.

------------------------------------------------------------------------

# 6. First-Time Home

After onboarding, the user sees an empty-state dashboard.

Example:

``` text
Good morning, Harsh 👋

No groups yet.

Create your first group to start
tracking shared expenses.

[ Create Group ]
```

Secondary option:

> Join a Group

------------------------------------------------------------------------

# 7. Create First Group

The user selects:

> **Create Group**

They enter:

``` text
Group Name
Trip / Room / Event
Optional image
```

Example:

> Manali Trip

Then:

> **Continue**

------------------------------------------------------------------------

# 8. Add Members

The user can add members.

Example:

``` text
Manali Trip

Harsh ✓
Rahul
Aman
Piyush

[ Add Member ]
```

Members may be invited using the application's supported invitation
mechanism.

The creator is automatically included.

------------------------------------------------------------------------

# 9. First Expense

After creating the group, the most important next action should be
obvious:

> **Add your first expense**

Example:

``` text
₹6,000
Hotel
Paid by Harsh
Shared with Everyone
```

After confirmation, the group becomes active.

------------------------------------------------------------------------

# 10. New User's First "Aha" Moment

Immediately after the first expense, show the calculated result.

Example:

> **You are owed ₹4,500**

And:

``` text
Rahul owes you ₹1,500
Aman owes you ₹1,500
Piyush owes you ₹1,500
```

This demonstrates the value of Settle immediately.

------------------------------------------------------------------------

# 11. Returning / Existing User Flow

When an authenticated user opens the app:

``` text
Open App
   ↓
Check Session
   ↓
Valid Session?
   ↓
Yes
   ↓
Load Home
```

The user should **not** see onboarding again.

------------------------------------------------------------------------

# 12. Existing User Home

Example:

``` text
Good morning, Harsh 👋

YOUR BALANCE
+ ₹1,240

You are owed this amount.

ACTIVE GROUPS

🏔️ Manali Trip
₹12,840 spent

🏠 Room 304
₹8,240 this month

🎉 College Event
₹4,500 spent

RECENT ACTIVITY
Dinner +₹600
Cab -₹400
Hotel +₹1,500
```

The user can immediately continue their existing work.

------------------------------------------------------------------------

# 13. Existing User --- Add Expense Flow

``` text
Home
 ↓
Add Expense
 ↓
Select Group
 ↓
Enter Amount
 ↓
Enter Description
 ↓
Select Payer
 ↓
Select Participants
 ↓
Select Split Type
 ↓
Review
 ↓
Confirm
 ↓
Balances Update
```

For returning users, the app may remember the most recently used group
to reduce friction.

------------------------------------------------------------------------

# 14. Existing User --- Group Flow

``` text
Home
 ↓
Select Group
 ↓
Group Dashboard
 ├── Overview
 ├── Expenses
 ├── Balances
 ├── Settle
 ├── Members
 └── Analytics
```

------------------------------------------------------------------------

# 15. Group Dashboard Flow

The first thing users should see is:

1.  Group name
2.  Total spent
3.  Their own balance
4.  Who owes whom
5.  Recent expenses
6.  Add Expense action

Example:

``` text
Manali Trip

Total Spent
₹18,420

Your Balance
+ ₹1,240

[ Add Expense ]

Recent Expenses
...
```

------------------------------------------------------------------------

# 16. Settlement Flow

``` text
Group
 ↓
Settle
 ↓
Calculate Current Balances
 ↓
Generate Optimized Transactions
 ↓
Show Who Pays Whom
 ↓
Member Makes Payment
 ↓
Mark as Paid
 ↓
Other Member Confirms
 ↓
Settlement Completed
```

The application should keep settlement status visible.

------------------------------------------------------------------------

# 17. AI Expense Flow

``` text
Add Expense
 ↓
Choose Smart Entry
 ↓
User writes:
"I paid 1800 for dinner for me,
Rahul and Aman."
 ↓
AI extracts information
 ↓
Show Preview
 ↓
User Reviews
 ↓
Confirm
 ↓
Create Expense
 ↓
Recalculate Balance
```

AI should never silently create a financial transaction without user
confirmation.

------------------------------------------------------------------------

# 18. Receipt Flow

``` text
Add Expense
 ↓
Scan Receipt
 ↓
OCR / Extraction
 ↓
Extract Amount / Merchant / Date / Items
 ↓
User Review
 ↓
Select Participants
 ↓
Confirm
 ↓
Create Expense
```

------------------------------------------------------------------------

# 19. New User vs Existing User

  Stage            New User               Existing User
  ---------------- ---------------------- ------------------------
  App Open         Welcome                Home
  Authentication   Signup/Login           Session check
  Onboarding       Yes                    No
  Groups           Empty state            Active groups
  First Action     Create/Join Group      Continue existing work
  Expense          Guided first expense   Quick add
  Education        Product explanation    Minimal
  Home             Setup-focused          Activity-focused

------------------------------------------------------------------------

# 20. Returning User Shortcut

The app should optimize for the common returning-user case.

If the user has one active group, the interface can make that group
immediately accessible.

If the user has several groups, show the most recently active groups
first.

The goal:

> **Open → Understand → Continue**

with minimal friction.

------------------------------------------------------------------------

# 21. Global Navigation Flow

``` text
                 HOME
                  │
      ┌───────────┼────────────┐
      ↓           ↓            ↓
    GROUPS     EXPENSES      PROFILE
      │
      ↓
  GROUP DETAIL
      │
 ┌────┼─────┬─────────┐
 ↓    ↓     ↓         ↓
Exp  Bal.  Settle   Analytics
      │
      ↓
   Members
```

The Add Expense action should remain easily accessible from relevant
screens.

------------------------------------------------------------------------

# 22. Important UX Principle

A new user should understand the product within the first minute.

A returning user should be able to add an expense within seconds.

Therefore:

> **First-time flow = explain and guide.**

> **Returning flow = remove friction.**
