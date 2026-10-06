# AGENTS.md

## Project Identity

This project is a **smart group-expense and settlement application** for
trips, roommates, hostel groups, college groups, and friends.

Core promise:

> **Track who paid, calculate everyone's fair share, and find the
> simplest way to settle the group.**

The product should feel **calm, premium, simple, and trustworthy**, with
an interface inspired by modern iOS applications.

------------------------------------------------------------------------

# 1. Non-Negotiable Engineering Principles

Every implementation must prioritize:

1.  **Modularity** --- features should be isolated and composable.
2.  **Maintainability** --- code should be understandable months later
    by another developer.
3.  **Scalability** --- architecture should support more users, groups,
    expenses, and features without major rewrites.
4.  **Type safety** --- avoid unsafe or ambiguous data structures.
5.  **Reusability** --- repeated UI and business logic must become
    shared components/utilities.
6.  **Separation of concerns** --- UI, business logic, data access, and
    infrastructure should not be mixed unnecessarily.
7.  **Accessibility** --- icons must never replace necessary
    text/context.
8.  **Performance** --- avoid unnecessary renders, requests,
    calculations, and duplicated state.
9.  **Consistency** --- use the existing design system rather than
    inventing one-off styles.
10. **Simplicity** --- prefer the simplest architecture that solves the
    current problem.

Do not introduce complexity just because it is technically possible.

------------------------------------------------------------------------

# 2. Product Architecture

Think in four layers:

``` text
Presentation
    ↓
Application / Feature Logic
    ↓
Domain / Business Rules
    ↓
Data / Infrastructure
```

### Presentation

Responsible for:

-   Pages/screens
-   Components
-   Layout
-   User interaction
-   Loading/error/empty states
-   Accessibility

### Application / Feature Logic

Responsible for:

-   User flows
-   Form handling
-   State coordination
-   Calling domain operations
-   Orchestrating multiple services

### Domain

Responsible for business rules such as:

-   Expense splitting
-   Equal/unequal/percentage/item-based splits
-   Group balances
-   Debt calculation
-   Debt minimization
-   Settlement generation
-   Validation rules

Domain logic must not depend directly on UI components.

### Data / Infrastructure

Responsible for:

-   API calls
-   Database operations
-   Authentication
-   File/receipt uploads
-   OCR/AI services
-   Notifications
-   External integrations

------------------------------------------------------------------------

# 3. Recommended Feature Structure

Organize code around **features**, not giant generic folders.

Preferred structure:

``` text
src/
├── app/
│   ├── routes/
│   └── layouts/
│
├── features/
│   ├── auth/
│   ├── groups/
│   ├── expenses/
│   ├── settlements/
│   ├── analytics/
│   ├── receipts/
│   └── ai-expense-entry/
│
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── feedback/
│   └── data-display/
│
├── domain/
│   ├── expense/
│   ├── group/
│   └── settlement/
│
├── services/
│   ├── api/
│   ├── ai/
│   ├── ocr/
│   └── notifications/
│
├── hooks/
├── utils/
├── types/
├── constants/
└── styles/
```

Adapt this structure to the actual framework if necessary, but preserve
the architectural separation.

------------------------------------------------------------------------

# 4. Feature Boundaries

Each feature should ideally contain its own:

``` text
feature/
├── components/
├── hooks/
├── services/
├── types/
├── validation/
├── utils/
└── index
```

Do not allow unrelated features to import internal implementation
details.

Prefer:

``` text
features/expenses
```

over:

``` text
components/everything-expense-related
```

------------------------------------------------------------------------

# 5. Domain Rules

Business logic must be deterministic and testable.

For expenses, support:

-   Equal split
-   Unequal split
-   Percentage split
-   Item-based split
-   Multiple participants
-   Payer different from participants
-   Expense categories
-   Optional notes
-   Optional receipt
-   Settlement status

Example conceptual model:

``` text
Expense
├── id
├── groupId
├── amount
├── currency
├── description
├── category
├── paidBy
├── participants
├── splitType
├── splitDetails
├── createdAt
└── metadata
```

Never calculate important balances using UI-only state.

------------------------------------------------------------------------

# 6. Settlement Engine

The settlement engine is a core product capability.

It must:

1.  Calculate each member's total contribution.
2.  Calculate each member's actual share.
3.  Determine net balance.
4.  Separate creditors and debtors.
5.  Generate settlement transactions.
6.  Minimize unnecessary transactions where possible.
7.  Return deterministic results.

Example:

``` text
Member contribution - Member share = Net balance
```

Positive balance:

> Member should receive money.

Negative balance:

> Member owes money.

Keep this algorithm independent from React/UI/framework code.

It should be usable from:

-   Web UI
-   Mobile UI
-   API
-   Tests
-   Future integrations

------------------------------------------------------------------------

# 7. Data and State Management

Use three categories of state:

### Server state

Examples:

-   Groups
-   Expenses
-   Members
-   Settlements
-   User profile

This should come from the API/data layer.

### UI state

Examples:

-   Modal open/closed
-   Selected tab
-   Active filter
-   Temporary input

Keep it local whenever possible.

### Form state

Examples:

-   Expense form
-   Group creation
-   Profile editing

Do not create global state for everything.

Avoid duplicated sources of truth.

------------------------------------------------------------------------

# 8. API Principles

API calls should not be scattered throughout UI components.

Bad:

``` text
Button → fetch()
Card → fetch()
Page → fetch()
```

Prefer:

``` text
UI
 ↓
Feature hook/service
 ↓
API layer
 ↓
Backend
```

Centralize:

-   Authentication handling
-   Error normalization
-   Request configuration
-   Response parsing
-   Retry behavior where appropriate

------------------------------------------------------------------------

# 9. Validation

Validate at boundaries.

Examples:

-   Expense amount \> 0
-   Split percentages total 100%
-   Unequal shares equal the expense total
-   Participant must belong to the group
-   Payer must be a group member
-   Currency must be supported
-   Required fields must exist

Never trust client-side validation alone.

------------------------------------------------------------------------

# 10. UI/UX Direction

The UI should be **iOS-inspired**, not a direct copy of Apple's
proprietary interface.

Target qualities:

-   Clean
-   Spacious
-   Calm
-   Premium
-   Familiar
-   Minimal
-   Content-first
-   Comfortable touch targets
-   Strong visual hierarchy

Avoid:

-   Overly dense dashboards
-   Excessive borders
-   Tiny text
-   Too many colors
-   Excessive gradients
-   Decorative animations
-   Unnecessary cards inside cards
-   Icon-only actions without context

------------------------------------------------------------------------

# 11. Typography

Prioritize readability.

Use a modern system-style sans-serif where available.

Recommended hierarchy:

``` text
Large page title
Section title
Card title
Body
Secondary text
Caption
```

Do not use tiny text simply to fit more information.

Body text should remain comfortably readable on laptop and mobile
screens.

------------------------------------------------------------------------

# 12. Icons

Icons should support recognition, not replace communication.

Good:

``` text
💸 Add Expense
👥 Members
✓ Settled
```

Less accessible:

``` text
[icon]
[icon]
[icon]
```

For important actions, use:

> **Icon + Text**

For familiar secondary actions, icon-only buttons are acceptable when
they have:

-   Tooltip
-   Accessible label
-   Adequate touch target

Recommended minimum interactive target:

> approximately 44 × 44 px

------------------------------------------------------------------------

# 13. Navigation

Primary navigation should be obvious.

For mobile:

``` text
Home
Expenses
Add
Groups
Profile
```

For desktop, use a compact sidebar or top navigation depending on the
page.

The **Add Expense** action should always be easy to find.

------------------------------------------------------------------------

# 14. Important Screens

The initial product should include:

### Home

Shows:

-   Current balance
-   Active groups
-   Recent expenses
-   Pending settlements
-   Quick add expense

### Group

Shows:

-   Group name
-   Members
-   Total spending
-   Individual balances
-   Recent expenses
-   Settlement status

### Add Expense

Supports:

-   Amount
-   Description
-   Category
-   Payer
-   Participants
-   Split method
-   Receipt
-   Notes

### Settlement

Shows:

-   Who owes whom
-   Amount
-   Optimized transactions
-   Settlement status

### Analytics

Shows:

-   Total spending
-   Category breakdown
-   Spending trends
-   Per-person contribution
-   Useful insights

------------------------------------------------------------------------

# 15. UX States

Every major screen must account for:

### Loading

Use skeletons where appropriate.

### Empty

Example:

> No expenses yet\
> Add your first expense to start tracking the group.

### Error

Explain:

-   What happened
-   What the user can do

Example:

> Couldn't load your group.\
> Check your connection and try again.

### Success

Give clear confirmation without unnecessary interruption.

### Offline / delayed state

If supported, clearly communicate whether data is:

-   Saved
-   Pending sync
-   Failed

------------------------------------------------------------------------

# 16. Responsive Design

Design mobile-first.

The application must work comfortably on:

-   Small phones
-   Large phones
-   Tablets
-   Laptops
-   Desktop monitors

Do not simply shrink the desktop UI.

Reorganize content based on available space.

------------------------------------------------------------------------

# 17. Accessibility

Every feature must consider:

-   Keyboard navigation
-   Screen readers
-   Color contrast
-   Focus states
-   Semantic HTML
-   Form labels
-   Error messages
-   Reduced motion
-   Accessible icon buttons

Never communicate status using color alone.

Bad:

> Red = unpaid

Better:

> 🔴 Unpaid\
> ₹500 due

------------------------------------------------------------------------

# 18. Performance

Avoid:

-   Unnecessary global state
-   Duplicate API calls
-   Large client-side calculations on every render
-   Unoptimized images
-   Huge component files
-   Unnecessary dependencies

Prefer:

-   Memoization only where useful
-   Pagination for large lists
-   Lazy loading for heavy features
-   Server-side operations for sensitive/heavy calculations
-   Optimized assets

Do not optimize blindly. Measure first when possible.

------------------------------------------------------------------------

# 19. Error Handling

Never silently swallow errors.

Bad:

``` text
try {
  ...
} catch {}
```

Prefer meaningful error handling.

User-facing errors should be friendly.

Developer-facing errors should contain enough context to debug.

Never expose:

-   Secrets
-   Tokens
-   Internal stack traces
-   Database details

------------------------------------------------------------------------

# 20. Security

Never put secrets in frontend code.

Do not trust:

-   Client-provided user IDs
-   Client-provided group membership
-   Client-provided balances
-   Client-provided permissions

Server-side authorization must verify access.

Treat uploaded receipts/images as untrusted input.

------------------------------------------------------------------------

# 21. AI Features

AI should solve a real problem.

Good AI use cases:

-   Natural-language expense entry
-   Receipt extraction
-   Expense categorization
-   Spending summaries
-   Anomaly detection
-   Helpful explanations

Bad AI use cases:

-   AI-generated buttons
-   AI-generated decorative text
-   Chatbot that adds no real value

AI output must be validated before affecting financial calculations.

Never let an AI model directly determine authoritative balances.

------------------------------------------------------------------------

# 22. Testing

Prioritize tests for business-critical logic.

Especially:

-   Equal splitting
-   Unequal splitting
-   Percentage splitting
-   Item splitting
-   Rounding
-   Currency handling
-   Negative/invalid values
-   Multiple participants
-   Settlement calculation
-   Debt minimization

Example edge cases:

``` text
₹100 among 3 people
₹0
₹0.01
Large amounts
Unequal shares
One payer, many participants
Multiple creditors
Multiple debtors
Already-settled expenses
```

------------------------------------------------------------------------

# 23. Code Quality Rules

Before creating a new utility/component:

1.  Search for an existing one.
2.  Reuse it if appropriate.
3.  Extend it if the abstraction is genuinely shared.
4.  Create a new abstraction only when necessary.

Avoid premature abstraction.

Avoid giant components.

If a component is doing:

``` text
UI + API + calculations + validation + formatting
```

split responsibilities.

------------------------------------------------------------------------

# 24. Naming

Use descriptive names.

Good:

``` text
calculateGroupBalance()
generateSettlementPlan()
ExpenseForm()
SettlementSummary()
```

Bad:

``` text
doStuff()
handleData()
Box2()
temp()
```

Boolean names should read naturally:

``` text
isSettled
isLoading
hasReceipt
canEdit
```

------------------------------------------------------------------------

# 25. Comments

Comments should explain **why**, not obvious **what**.

Bad:

``` text
// Add 1 to count
count += 1
```

Good:

``` text
// Use integer minor units here to avoid floating-point
// rounding errors in financial calculations.
```

------------------------------------------------------------------------

# 26. Financial Precision

Never rely blindly on floating-point arithmetic for money.

Prefer:

-   Integer minor units (e.g. paise/cents), or
-   A decimal/money library.

Example:

``` text
₹10.50 → 1050 paise
```

Round only at defined business boundaries.

Financial calculations must be deterministic.

------------------------------------------------------------------------

# 27. Git and Change Discipline

Keep changes focused.

One feature/fix should not randomly modify unrelated files.

Commit/message examples:

``` text
feat: add group expense creation
feat: implement settlement optimization
fix: handle uneven split rounding
refactor: isolate expense domain logic
ui: improve settlement summary
test: cover percentage split calculations
```

------------------------------------------------------------------------

# 28. Before Finishing Any Task

Check:

-   Does it work?
-   Is it responsive?
-   Is it accessible?
-   Is the code modular?
-   Is business logic separated?
-   Are loading/error/empty states handled?
-   Are financial calculations tested?
-   Did I duplicate existing code?
-   Did I introduce unnecessary dependencies?
-   Does the UI follow the design system?
-   Would another developer understand this code?

------------------------------------------------------------------------

# 29. Golden Rule

> **Build the simplest system that can grow.**

Do not sacrifice architecture for speed.

Do not sacrifice usability for visual effects.

Do not sacrifice correctness for a clever demo.

The application should feel like a product that could continue
development after the hackathon.
