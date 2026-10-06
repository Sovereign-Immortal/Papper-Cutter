# Solution.md

# Settle --- Smart Group Expense Management

## 1. Executive Summary

**Settle** is a smart group-expense management application designed for
situations where multiple people share expenses.

It is built for:

-   Trips
-   Roommates
-   Hostel groups
-   College groups
-   Events
-   Friends
-   Group projects
-   Shared purchases

The core idea is simple:

> **Record who paid, define who benefited, calculate everyone's fair
> share, and generate the simplest possible settlement plan.**

The application removes the need for manual calculations, scattered
screenshots, WhatsApp messages, notes, spreadsheets, and repeated "who
owes whom?" conversations.

------------------------------------------------------------------------

# 2. The Problem

When people spend money together, the problem is rarely the payment
itself.

The difficult part starts **after the payment**.

Consider a group of four friends travelling together.

-   Person A pays ₹6,000 for the hotel.
-   Person B pays ₹1,800 for dinner.
-   Person C pays ₹1,200 for a cab.
-   Person D pays ₹2,000 for tickets.

Some expenses are shared by everyone. Some are shared by only two or
three people.

After several days, the group has many questions:

-   Who paid how much?
-   What was each expense for?
-   Which expenses included me?
-   How much is my actual share?
-   Who owes me money?
-   Whom do I need to pay?
-   Have I already settled that payment?
-   Why are there so many transactions?
-   What happens when someone joins or leaves a group?
-   What if an expense is not equally divided?

Most people solve this using:

-   WhatsApp messages
-   Notes
-   Calculator
-   Excel/Sheets
-   Screenshots of bills
-   Memory
-   Manual UPI transfers

This creates unnecessary friction and mistakes.

------------------------------------------------------------------------

# 3. The Core Problem Statement

> **Friends going on trips or sharing a room often struggle to track
> shared expenses, calculate fair individual balances, and settle debts
> because payments are made by different people for different members at
> different times.**

The problem becomes more complicated when:

-   Expenses are unequal.
-   Not everyone participates in every expense.
-   There are many transactions.
-   People forget previous payments.
-   Bills contain multiple items.
-   Some expenses are recurring.
-   People use different payment methods.
-   The group wants to minimize the number of final payments.

------------------------------------------------------------------------

# 4. Our Solution

Settle turns group expenses into a structured and automated process.

Instead of asking:

> "Who owes whom?"

the application continuously maintains the answer.

The experience becomes:

``` text
Create Group
      ↓
Add Members
      ↓
Add Expenses
      ↓
Choose Who Shared It
      ↓
Automatic Calculation
      ↓
Live Balances
      ↓
Optimized Settlement
      ↓
Mark as Settled
```

The user does not need to manually calculate anything.

------------------------------------------------------------------------

# 5. How Settle Works

Suppose four friends create a group called:

> **Manali Trip**

Harsh pays ₹6,000 for the hotel and the expense is shared equally by all
four members.

Settle records:

``` text
Expense:
Hotel

Amount:
₹6,000

Paid by:
Harsh

Participants:
Harsh
Rahul
Aman
Piyush

Split:
Equal
```

The system calculates:

``` text
Each person's share = ₹1,500
```

Harsh has already paid ₹6,000, so he should receive ₹4,500 from the
group.

The application automatically updates the group balances.

The user does not have to calculate this manually.

------------------------------------------------------------------------

# 6. More Than an Expense Tracker

Settle is not simply a place to enter expenses.

It combines:

### Expense Recording

Record exactly what happened.

### Smart Splitting

Determine who should bear the cost.

### Balance Calculation

Calculate what every member owes or should receive.

### Settlement Optimization

Reduce unnecessary transactions.

### Group Analytics

Understand where the group's money is going.

### Smart Input

Allow users to describe expenses naturally.

### Receipt Processing

Extract information from receipts.

Together, these features create a complete group-money workflow.

------------------------------------------------------------------------

# 7. The Settlement Problem

This is one of the most important parts of the product.

Imagine:

``` text
A owes B ₹500
A owes C ₹300
B owes D ₹200
C owes D ₹400
D owes A ₹100
```

A basic application might simply display all these relationships.

Settle goes further.

It calculates the **net balances** and generates a simplified settlement
plan.

The objective is:

> **Settle the group's total balance using as few unnecessary
> transactions as reasonably possible.**

This makes the final settlement easier for everyone.

------------------------------------------------------------------------

# 8. Supported Expense Types

## Equal Split

Example:

₹1,000 shared by 4 people.

``` text
₹250 each
```

------------------------------------------------------------------------

## Unequal Split

Example:

``` text
Harsh  → ₹500
Rahul  → ₹300
Aman   → ₹200
```

Useful when people consumed different amounts.

------------------------------------------------------------------------

## Percentage Split

Example:

``` text
Harsh  → 40%
Rahul  → 30%
Aman   → 20%
Piyush → 10%
```

------------------------------------------------------------------------

## Item-Based Split

Example:

``` text
Pizza       → Harsh + Rahul
Burger      → Aman
Drinks      → Everyone
```

This is useful for restaurant bills and shared shopping.

------------------------------------------------------------------------

# 9. AI-Powered Expense Entry

Settle can make expense entry much faster.

Instead of filling a form, a user can type:

> "I paid ₹1,800 for dinner for me, Rahul and Aman."

The system can interpret:

``` text
Amount: ₹1,800
Category: Food
Paid by: Current user
Participants: Current user, Rahul, Aman
Split: Equal
```

The user reviews the information and confirms it.

AI assists the user, but **financial calculations remain deterministic
and controlled by the application**.

AI never becomes the source of truth for balances.

------------------------------------------------------------------------

# 10. Receipt Scanning

Users can upload or scan a receipt.

The system can extract:

-   Merchant name
-   Total amount
-   Date
-   Items
-   Possible category

The extracted information is shown for review before the expense is
created.

Flow:

``` text
Scan Receipt
     ↓
Extract Information
     ↓
Review
     ↓
Correct if Needed
     ↓
Confirm
     ↓
Create Expense
```

------------------------------------------------------------------------

# 11. Group Balance

Every group has a clear financial overview.

Example:

``` text
Harsh       + ₹1,240
Rahul       - ₹500
Aman        + ₹260
Piyush      - ₹1,000
```

Positive:

> Member should receive money.

Negative:

> Member owes money.

This gives users an immediate understanding of the group.

------------------------------------------------------------------------

# 12. Settlement Screen

The settlement screen converts complicated calculations into simple
actions.

Example:

``` text
Rahul → Harsh
₹500

Piyush → Harsh
₹740
```

The application can allow members to mark settlements as completed.

This creates a clear lifecycle:

``` text
Pending
   ↓
Paid
   ↓
Confirmed / Settled
```

------------------------------------------------------------------------

# 13. Analytics

The application can show:

-   Total group spending
-   Individual contribution
-   Individual share
-   Category breakdown
-   Spending trends
-   Largest expenses
-   Budget comparison
-   Settlement status

Example:

``` text
Total Spent: ₹18,420

Stay          42%
Food          27%
Travel        18%
Activities    13%
```

The purpose is not to overload users with charts.

Analytics should answer useful questions.

------------------------------------------------------------------------

# 14. Who Is This For?

### Students

-   Hostel expenses
-   College trips
-   Group events
-   Shared food
-   Shared rooms

### Travellers

-   Hotels
-   Transport
-   Food
-   Activities
-   Tickets

### Roommates

-   Rent
-   Wi-Fi
-   Electricity
-   Groceries
-   Household expenses

### Friends

-   Dinner
-   Parties
-   Shopping
-   Shared purchases

### Event Organizers

-   Shared event expenses
-   Team purchases
-   Participant contributions

------------------------------------------------------------------------

# 15. The Core Value Proposition

Settle saves users from three things:

### Manual Calculation

No calculators or spreadsheets.

### Financial Confusion

Everyone can see the same numbers.

### Unnecessary Payments

The settlement engine simplifies the final transactions.

Therefore:

> **Settle is not just about splitting a bill. It is about simplifying
> the entire lifecycle of shared money.**
