# Idea Origin.md

# Why Papper Cutter Exists --- Idea Origin

## 1. The Observation

The idea behind Papper Cutter comes from a very common situation:

A group of friends spends money together.

Nobody has a problem paying.

The problem starts when everyone tries to remember and settle the
expenses later.

A normal conversation might look like:

> "How much did you pay?"

> "Wait, I think you owe me."

> "Didn't I already pay you?"

> "Send me the screenshot."

> "Let's calculate everything at the end."

This happens because payment applications solve **sending money**, but
they do not necessarily solve the **shared-expense relationship around
the money**.

That distinction is the foundation of Settle.

------------------------------------------------------------------------

# 2. Why Not Just Use UPI?

UPI applications are excellent at one fundamental task:

> **Moving money from one person to another.**

If Harsh wants to send Rahul ₹500, a UPI application can do that very
well.

But consider a group trip.

There may be:

-   8 people
-   40 expenses
-   Different payers
-   Different participants
-   Unequal shares
-   Shared bills
-   Cash payments
-   Different categories
-   Multiple days
-   Multiple settlements

The question is no longer simply:

> "How do I pay Rahul ₹500?"

The real question becomes:

> **"After considering everything everyone paid and consumed, who
> actually owes whom, and how can the group settle it with the least
> friction?"**

That is a different problem.

------------------------------------------------------------------------

# 3. UPI vs Settle

  Capability                            Normal UPI App                   Settle
  ------------------------------------- -------------------------------- ----------------------------------
  Send money                            ✅                               Can support settlement workflows
  Receive money                         ✅                               Can support settlement workflows
  Track a single payment                ✅                               ✅
  Create a group                        Usually not the core purpose     ✅
  Track shared expenses                 Limited / not the core purpose   ✅
  Know who participated in an expense   ❌                               ✅
  Equal split                           Usually manual                   ✅
  Unequal split                         Usually manual                   ✅
  Percentage split                      Not the core purpose             ✅
  Item-based bill splitting             Not the core purpose             ✅
  Group balance                         ❌                               ✅
  Who owes whom                         ❌                               ✅
  Settlement optimization               ❌                               ✅
  Trip expense analytics                ❌                               ✅
  Receipt-to-expense workflow           Not the core purpose             ✅
  AI natural-language expense entry     Not the core purpose             ✅
  Shared budget                         Not the core purpose             Can support
  Recurring group expenses              Not the core purpose             Can support

The key difference is:

> **UPI moves money. Settle organizes the logic around shared money.**

------------------------------------------------------------------------

# 4. A Simple Example

Imagine four friends:

``` text
Harsh
Rahul
Aman
Piyush
```

They go on a trip.

### Expense 1

Harsh pays:

> Hotel --- ₹6,000

Shared by everyone.

### Expense 2

Rahul pays:

> Dinner --- ₹1,800

Shared by everyone.

### Expense 3

Aman pays:

> Cab --- ₹1,200

Shared by Harsh, Aman and Piyush.

### Expense 4

Piyush pays:

> Tickets --- ₹2,000

Shared by everyone.

Now ask a normal UPI app:

> "Who owes whom after considering all four expenses?"

That is not the primary problem UPI is designed to solve.

Settle calculates the entire group state.

------------------------------------------------------------------------

# 5. The Difference in Mental Model

### Normal UPI

``` text
Person A
   ↓
₹500
   ↓
Person B
```

It focuses on a **single transfer**.

### Settle

``` text
             GROUP
               │
      ┌────────┼────────┐
      ↓        ↓        ↓
   Expense   Expense   Expense
      │        │        │
      └────────┼────────┘
               ↓
          BALANCE ENGINE
               ↓
       WHO OWES WHOM?
               ↓
       SETTLEMENT PLAN
```

It focuses on the **complete financial relationship of the group**.

------------------------------------------------------------------------

# 6. Settle Is Not Trying to Replace UPI

This distinction is important.

Settle should not position itself as:

> "A better UPI."

Instead:

> **Settle is the intelligence and organization layer that comes before
> the final payment.**

The ideal ecosystem can be:

``` text
Settle
  ↓
Calculate
  ↓
Generate settlement
  ↓
User chooses payment method
  ↓
UPI / Bank / Cash / Other
```

This makes the product complementary rather than unnecessarily
competitive.

------------------------------------------------------------------------

# 7. The Real Insight

The original insight is:

> **Sending money is easy. Knowing exactly who should send money to whom
> is the difficult part.**

This is especially true when:

-   Many people are involved.
-   Expenses happen at different times.
-   People pay different amounts.
-   Not everyone shares every expense.
-   Some payments are already settled.
-   The group needs a final clean settlement.

Settle is designed around that exact friction.

------------------------------------------------------------------------

# 8. Why Students Are a Strong Starting Audience

Students frequently deal with:

-   Hostel expenses
-   College trips
-   Shared food
-   Roommates
-   Group events
-   Club activities
-   Shared transportation
-   Group purchases

They also tend to use informal methods:

``` text
WhatsApp
+
Calculator
+
UPI
+
Notes
```

Settle brings those fragmented steps into one structured workflow.

------------------------------------------------------------------------

# 9. Why the Idea Can Expand

Although the initial problem is described as:

> "Trip & Split Expenses"

the underlying problem is much broader:

> **Managing shared financial responsibility between people.**

That allows the product to expand naturally.

### Trips

``` text
Hotel
Food
Transport
Tickets
Activities
```

### Roommates

``` text
Rent
Electricity
Wi-Fi
Groceries
```

### College

``` text
Events
Projects
Club purchases
Group activities
```

### Friends

``` text
Dinner
Parties
Shopping
Shared subscriptions
```

The same core calculation engine can support all of them.

------------------------------------------------------------------------

# 10. Why the Idea Is Different

The differentiation is not:

> "We also have an expense form."

The differentiation is the complete workflow:

``` text
Capture
  ↓
Understand
  ↓
Split
  ↓
Calculate
  ↓
Optimize
  ↓
Settle
  ↓
Track
```

Every feature exists to reduce friction in this workflow.

------------------------------------------------------------------------

# 11. Product Philosophy

The product should make users feel:

> **"I don't need to calculate anything. I just need to tell the app
> what happened."**

That is why features such as:

-   Natural-language expense entry
-   Receipt scanning
-   Automatic splitting
-   Live balances
-   Settlement optimization
-   Smart reminders

are valuable.

They remove work rather than adding more dashboards.

------------------------------------------------------------------------

# 12. Final Positioning

### One-line version

> **Settle is a smart group-expense platform that calculates fair
> balances and simplifies the final settlement between people.**

### Short pitch

> **UPI makes it easy to send money. Settle makes it easy to understand
> who should send money to whom.**

### Strongest product statement

> **We are not building another payment app. We are solving the problem
> that happens before the payment --- figuring out exactly what everyone
> owes.**
