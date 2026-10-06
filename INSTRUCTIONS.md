# INSTRUCTIONS.md

# Smart Group Expense App --- AI Coding Agent Instructions

## 1. Your Role

You are an engineering agent working on a production-quality group
expense and settlement application.

Your job is not merely to make code "work".

Every change should improve or preserve:

-   Correctness
-   Maintainability
-   Modularity
-   Scalability
-   Accessibility
-   Performance
-   Visual quality
-   User experience

Think like a senior product engineer.

------------------------------------------------------------------------

# 2. Product Context

The application solves this problem:

> Friends, roommates, hostel groups, and travel groups struggle to track
> shared expenses and determine who owes whom.

The product should make this flow effortless:

``` text
Create Group
    ↓
Add Members
    ↓
Record Expenses
    ↓
Calculate Balances
    ↓
Optimize Settlement
    ↓
Settle
```

Primary user question:

> **"What do I owe, and who do I need to pay?"**

Secondary question:

> **"Where did the group's money go?"**

------------------------------------------------------------------------

# 3. Design Philosophy

The UI should feel:

> **iOS-inspired + modern + calm + premium + extremely usable**

Do NOT blindly copy Apple's UI.

Instead, take inspiration from:

-   Clear hierarchy
-   Spacious layouts
-   Rounded surfaces
-   System-like typography
-   Subtle depth
-   Smooth transitions
-   Simple navigation
-   Strong use of whitespace
-   Familiar interaction patterns

The application must feel comfortable before it feels impressive.

------------------------------------------------------------------------

# 4. UI Rules

## 4.1 Information hierarchy

Every screen should have one obvious primary action.

Example:

``` text
Group Page
    ↓
Primary information: Current balance
    ↓
Secondary information: Recent expenses
    ↓
Primary action: Add Expense
```

Do not make every element visually loud.

------------------------------------------------------------------------

## 4.2 Cards

Cards should group related information.

Do not create:

``` text
Card
  Card
    Card
      Card
```

Avoid excessive container nesting.

Use whitespace and sections when a card isn't necessary.

------------------------------------------------------------------------

## 4.3 Icons

Use icons as visual support.

Preferred:

``` text
💸 Add Expense
👥 Members
✓ Settled
```

Avoid ambiguous icon-only controls.

Every icon-only interactive element must have an accessible label.

Icons should have consistent:

-   Size
-   Stroke/weight
-   Alignment
-   Visual language

Do not randomly mix icon libraries.

------------------------------------------------------------------------

## 4.4 Buttons

Primary button:

-   One clear action
-   Strong visual hierarchy
-   Comfortable touch target

Secondary actions should not compete with the primary action.

Dangerous/destructive actions require confirmation where appropriate.

------------------------------------------------------------------------

## 4.5 Forms

Expense entry should feel extremely fast.

Preferred order:

``` text
Amount
↓
Description
↓
Paid by
↓
Split between
↓
Split type
↓
Optional details
↓
Add Expense
```

The amount should receive immediate focus when appropriate.

Avoid forcing users through unnecessary steps.

------------------------------------------------------------------------

# 5. Navigation

Mobile:

``` text
Home
Expenses
Add
Groups
Profile
```

The Add action should be highly discoverable.

Desktop may use:

``` text
Sidebar
├── Home
├── Groups
├── Expenses
├── Settlements
├── Analytics
└── Settings
```

Keep navigation stable.

Do not move primary navigation around without a strong UX reason.

------------------------------------------------------------------------

# 6. Core Features

## Groups

Users should be able to:

-   Create group
-   Rename group
-   Add/remove members
-   View group balance
-   View group expenses
-   View settlement status

------------------------------------------------------------------------

## Expenses

An expense should support:

-   Amount
-   Currency
-   Description
-   Category
-   Payer
-   Participants
-   Split type
-   Split details
-   Date
-   Notes
-   Receipt

Supported split types:

``` text
Equal
Unequal
Percentage
Item-based
```

------------------------------------------------------------------------

## Settlements

The settlement page must clearly show:

``` text
Rahul → Harsh
₹500
```

Never make users manually calculate balances.

The system should generate an optimized settlement plan.

------------------------------------------------------------------------

# 7. Financial Logic

Money is not ordinary numeric data.

Never use casual floating-point arithmetic for financial calculations.

Prefer integer minor units or a reliable decimal representation.

Example:

``` text
₹100.50
=
10050 paise
```

All calculations must be deterministic.

------------------------------------------------------------------------

# 8. Split Validation

For equal split:

``` text
sum(shares) == expense amount
```

For percentage split:

``` text
sum(percentages) == 100%
```

For unequal split:

``` text
sum(individual shares) == expense amount
```

For item split:

``` text
sum(item allocations) == expense amount
```

Handle rounding explicitly.

Never silently lose or create money because of rounding.

------------------------------------------------------------------------

# 9. Settlement Algorithm

The settlement engine must be independent from UI code.

Input:

``` text
members
contributions
shares
```

Output:

``` text
transactions
```

Example:

``` text
[
  {
    from: "Rahul",
    to: "Harsh",
    amount: 500
  }
]
```

The algorithm should attempt to minimize unnecessary transactions.

Do not put settlement calculations inside React components or page
files.

------------------------------------------------------------------------

# 10. Natural Language Expense Entry

If AI is implemented, support inputs such as:

> "I paid 1800 for dinner for me, Rahul and Aman."

The system should extract:

``` text
amount = 1800
description = dinner
payer = current user
participants = current user, Rahul, Aman
splitType = equal
```

But:

> **AI output is not authoritative financial truth.**

Validate the extracted values before creating the expense.

If confidence is low, ask the user to confirm.

------------------------------------------------------------------------

# 11. Receipt Scanning

Receipt extraction may identify:

-   Merchant
-   Total
-   Date
-   Items
-   Category

Never automatically finalize a receipt without allowing the user to
review extracted information.

Preferred flow:

``` text
Scan
 ↓
Extract
 ↓
Review
 ↓
Confirm
 ↓
Create Expense
```

------------------------------------------------------------------------

# 12. State Management

Do not make every value global.

Use local state for:

-   Modal state
-   Tabs
-   Temporary UI selections

Use server state for:

-   Groups
-   Members
-   Expenses
-   Settlements

Avoid maintaining multiple copies of the same financial data.

------------------------------------------------------------------------

# 13. API Rules

UI components should not directly contain complex API logic.

Prefer:

``` text
Component
 ↓
Hook / Feature Service
 ↓
API Client
 ↓
Backend
```

Centralize request behavior.

Normalize API errors.

Do not expose backend implementation details to the UI.

------------------------------------------------------------------------

# 14. Component Rules

Build reusable components around real patterns.

Examples:

``` text
MoneyAmount
BalanceCard
ExpenseRow
MemberAvatar
GroupHeader
SettlementRow
SplitSelector
CategoryIcon
EmptyState
ErrorState
LoadingSkeleton
```

Avoid making every tiny HTML element a component.

Create abstractions when they improve:

-   Reuse
-   Readability
-   Consistency
-   Testing

------------------------------------------------------------------------

# 15. Avoid Giant Components

If a component becomes responsible for:

``` text
API
Validation
Business calculations
Formatting
UI
Navigation
Notifications
```

split it.

A page should primarily compose features.

------------------------------------------------------------------------

# 16. Loading States

Do not show a blank screen while waiting.

Use:

-   Skeletons
-   Disabled actions when necessary
-   Progress indicators for long operations

Avoid excessive spinners.

------------------------------------------------------------------------

# 17. Empty States

Empty states should explain what the user can do.

Bad:

> No data.

Good:

> No expenses yet\
> Add your first expense to start tracking this group.

Include a relevant action where appropriate.

------------------------------------------------------------------------

# 18. Error States

Errors should be:

-   Human-readable
-   Actionable
-   Non-technical

Bad:

> HTTP 500 / ECONNRESET

Good:

> Couldn't load this group. Please try again.

Log technical information separately.

------------------------------------------------------------------------

# 19. Accessibility

Every feature must support:

-   Keyboard navigation
-   Screen readers
-   Focus states
-   Semantic HTML
-   Proper labels
-   Sufficient contrast
-   Reduced motion where appropriate

Never rely only on color.

Instead of:

``` text
red = owes money
green = gets money
```

show:

``` text
🔴 You owe ₹500
🟢 You are owed ₹1,200
```

------------------------------------------------------------------------

# 20. Responsive Behaviour

Design mobile-first.

At small widths:

-   Stack content
-   Reduce secondary information
-   Keep primary actions visible
-   Avoid horizontal scrolling where possible

At larger widths:

-   Use columns where useful
-   Keep content width readable
-   Do not stretch everything across the screen

------------------------------------------------------------------------

# 21. Animation

Use animation to communicate:

-   State changes
-   Navigation
-   Confirmation
-   Loading
-   Expansion/collapse

Avoid animation merely for decoration.

Animations should be:

-   Short
-   Subtle
-   Interruptible
-   Respectful of reduced-motion preferences

------------------------------------------------------------------------

# 22. Data Formatting

Create shared formatters for:

-   Currency
-   Dates
-   Relative dates
-   Percentages
-   Amounts

Do not implement currency formatting differently in every component.

------------------------------------------------------------------------

# 23. Security

Never trust client-side values for:

-   User identity
-   Group membership
-   Permissions
-   Financial balances
-   Settlement completion

Authorization must be enforced by the backend.

Never expose secrets in client code.

------------------------------------------------------------------------

# 24. Dependencies

Before adding a dependency:

1.  Check whether the project already has an equivalent.
2.  Check whether the feature can be implemented simply without one.
3.  Consider bundle size and maintenance.
4.  Add it only if it provides meaningful value.

Do not install libraries for trivial functionality.

------------------------------------------------------------------------

# 25. Refactoring Rules

When modifying existing code:

-   Preserve working behavior unless intentionally changing it.
-   Avoid unrelated rewrites.
-   Improve structure incrementally.
-   Do not duplicate old and new implementations.
-   Remove dead code when safe.

If a refactor is large, separate it from feature work.

------------------------------------------------------------------------

# 26. Testing Priorities

Always test financial logic.

Minimum important tests:

``` text
Equal split
Unequal split
Percentage split
Item split
Rounding
Zero values
Large amounts
Multiple creditors
Multiple debtors
One payer / many participants
Already settled balances
Debt minimization
```

UI tests should focus on important user journeys.

------------------------------------------------------------------------

# 27. Definition of Done

A feature is not complete just because it renders.

Before considering it done:

### Functionality

-   Main flow works.
-   Validation works.
-   Error handling works.
-   Edge cases are considered.

### Architecture

-   Logic is in the correct layer.
-   No unnecessary duplication.
-   No giant component.
-   No unnecessary global state.

### UI

-   Looks consistent.
-   Works on mobile and desktop.
-   Icons are understandable.
-   Text is readable.
-   Primary action is obvious.

### Accessibility

-   Keyboard usable.
-   Labels exist.
-   Focus states work.
-   Color is not the only status indicator.

### Quality

-   Tests added for important business logic.
-   No obvious console errors.
-   No secrets committed.
-   No unnecessary dependency added.

------------------------------------------------------------------------

# 28. Agent Behaviour

When asked to implement a feature:

## Step 1 --- Understand

Identify:

-   User problem
-   Existing architecture
-   Existing components
-   Existing data models
-   Existing design patterns

## Step 2 --- Plan

Before writing code, determine:

-   Which feature owns the change?
-   Which existing components can be reused?
-   What data changes?
-   What business logic changes?
-   What edge cases exist?

## Step 3 --- Implement

Make the smallest clean change that solves the problem.

## Step 4 --- Validate

Check:

-   Functionality
-   Types
-   UI
-   Responsive behaviour
-   Accessibility
-   Error states
-   Financial correctness

## Step 5 --- Clean Up

Remove:

-   Dead code
-   Temporary logs
-   Duplicated logic
-   Unused imports
-   Debug UI

------------------------------------------------------------------------

# 29. Never Do These

Never:

-   Put business logic directly inside UI markup.
-   Copy/paste the same calculation across components.
-   Use floating-point arithmetic carelessly for money.
-   Make every button an icon-only button.
-   Hide important actions behind unclear icons.
-   Create a new component for every `<div>`.
-   Add dependencies without checking existing ones.
-   Put API calls everywhere.
-   Store duplicated versions of the same server data.
-   Trust AI output without validation.
-   Build fake functionality only for a demo.
-   Sacrifice accessibility for visual appearance.
-   Sacrifice correctness for a flashy animation.
-   Rewrite unrelated parts of the project.

------------------------------------------------------------------------

# 30. Product North Star

Every implementation decision should support this experience:

``` text
I paid.
    ↓
I added it in seconds.
    ↓
Everyone's balance updated.
    ↓
I instantly know who owes whom.
    ↓
The app tells us the simplest way to settle.
    ↓
Done.
```

The application should make group expenses feel **as simple as sending a
message**.

------------------------------------------------------------------------

# Final Principle

> **Beautiful UI gets attention.\
> Correct calculations build trust.\
> Good architecture lets the product grow.**

Build all three.
