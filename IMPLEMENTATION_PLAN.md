# Papper Cutter — Implementation Plan

**Stack defaults (locked for this plan)**

| Concern | Choice |
| --- | --- |
| Mobile App | React + TypeScript (Vite, mobile-first PWA / Android) / Dioxus |
| UI Design | Warm Pastel Harmony ([DESIGN.md](design-files/stitch_app_concept_studio/warm_pastel_harmony/DESIGN.md)) |
| Domain | Pure financial logic — integer minor units (paise) math |
| Money | `i64` minor units (paise) only |
| Settlement | Deterministic min-flow matching algorithm (O(N log N)) |

---

## 1. Product north star

From the root docs ([solution.md](solution.md), [PRD](design-files/papper_cutter_product_requirements_document_prd.md)):

> Record who paid → fair shares → live balances → fewest settlement payments.

Primary user question: **"What do I owe, and who do I need to pay?"**

---

## 2. Workspace layout

```text
Papper-Cutter/
├── Cargo.toml                 # workspace
├── IMPLEMENTATION_PLAN.md
├── AGENTS.md                  # engineering principles (source of truth)
├── crates/
│   ├── settle-domain/         # splits, balances, settlement (pure + tests)
│   ├── settle-db/             # sqlx types, queries, migrations
│   ├── settle-api/            # Axum HTTP API + auth
│   └── settle-web/            # Dioxus WASM app
├── migrations/                # SQL migrations (owned by settle-db)
└── docs/                      # existing product docs stay at root
```

Layering (matches [AGENTS.md](AGENTS.md)):

```text
settle-web (Presentation)
        ↓ HTTP JSON
settle-api (Application / auth / orchestration)
        ↓
settle-domain (Business rules)
        ↑
settle-db (Data / infrastructure)
```

`settle-web` never imports settlement math. `settle-domain` never imports Axum, SQLx, or Dioxus.

---

## 3. Domain model (Phase 1)

### Money

```rust
/// Amount in minor currency units (paise for INR).
pub struct Money(pub i64);
```

No `f64` in financial paths. Format for display only at UI / API boundary.

### Core entities

| Entity | Key fields |
| --- | --- |
| User | id, name, email, preferred_currency |
| Group | id, name, category, created_by |
| Membership | group_id, user_id, role |
| Expense | id, group_id, amount_paise, currency, description, category, paid_by, split_type, date |
| ExpenseShare | expense_id, user_id, share_paise |
| Settlement | id, group_id, from_user, to_user, amount_paise, status |

### Split types (MVP)

1. **Equal** — floor division; remainder paise assigned deterministically (to payer, then by stable member id order).
2. **Unequal** — explicit per-member amounts; sum must equal expense total.

Deferred to Phase 2+: Percentage, Item-based.

### Balance

```text
net_i = sum(contributions_i) - sum(shares_i)
```

Positive → should receive. Negative → owes. Zero → settled.

### Settlement engine

Input: map of `user_id → net_paise`.  
Output: minimal list of `{ from, to, amount }`.

Algorithm (PRD FR-4.2): partition creditors / debtors; greedily match largest debtor with largest creditor (`O(n log n)`). Deterministic ordering for stable tests.

Settlement lifecycle:

```text
Pending → MarkedPaid → Confirmed
```

UPI deep-link generation is API/UI concern; domain only produces amounts and parties.

---

## 4. API surface (Phase 1)

Base: `/api/v1`

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Groups | `GET/POST /groups`, `GET/PATCH /groups/:id`, `POST /groups/:id/members`, `POST /groups/join` |
| Expenses | `GET/POST /groups/:id/expenses`, `GET/PATCH/DELETE /expenses/:id` |
| Balances | `GET /groups/:id/balances` |
| Settlements | `GET /groups/:id/settlements`, `POST /groups/:id/settlements/generate`, `POST /settlements/:id/mark-paid`, `POST /settlements/:id/confirm` |

Rules:

- Server verifies membership on every group-scoped route.
- Balances and settlement suggestions are **recomputed from expenses**, never trusted from the client.
- Amounts in JSON are integers (paise) plus a display helper string if useful.

---

## 5. Dioxus web app structure

```text
settle-web/src/
├── main.rs
├── app.rs                 # router + layout
├── routes/
│   ├── welcome.rs
│   ├── auth.rs
│   ├── home.rs
│   ├── groups/
│   │   ├── list.rs
│   │   ├── detail.rs
│   │   └── create.rs
│   ├── expenses/
│   │   ├── add.rs
│   │   └── list.rs
│   ├── settle.rs
│   └── profile.rs
├── components/
│   ├── ui/                # Button, Input, Avatar, Skeleton, EmptyState
│   ├── MoneyAmount.rs
│   ├── BalanceCard.rs
│   ├── ExpenseRow.rs
│   ├── SettlementRow.rs
│   └── NavBar.rs
├── services/              # HTTP client wrappers
├── hooks/
└── styles/                # CSS variables from DESIGN.md
```

**Navigation (mobile-first)**

```text
Home | Expenses | [Add] | Groups | Profile
```

Desktop: compact sidebar with the same destinations.

**Screens mapped from design stubs**

| Screen | Design reference |
| --- | --- |
| Home | `home_dashboard_pastel_comfy` |
| Group detail | `group_detail_pastel_comfy` |
| Add expense | `add_expense_pastel_comfy` |
| Settlement | `smart_settlement_pastel_comfy` |

CSS tokens: surface `#fff8f4`, primary `#5c4bb5`, credit mint, debt peach — from Warm Pastel Harmony. Typography: Plus Jakarta Sans.

---

## 6. Phased delivery

### Phase 0 — Foundation (Completed)

- [x] Workspace + crates (`papper-cutter-domain`, `papper-cutter-mobile`)
- [x] Domain: `Money` (integer paise), equal/unequal split, balance, min-flow settlement + 100% unit tests passing
- [x] Mobile shell (Rust Dioxus & React/Vite Android app): Warm Pastel Harmony tokens, Home, Groups, Settle, Expenses, Profile
- [x] Windows MinGW/LLVM toolchain configuration (`.cargo/config.toml` & `stable-x86_64-pc-windows-gnullvm`)
- [x] README: how to run (React Android app & Rust crates)

### Phase 1 — MVP Ledger (PRD Phase 1)

1. [x] Group state & members
2. [x] Add expense (equal + unequal + AI natural language smart entry)
3. [x] Group balances view (contributions, shares, net balances with credit/debt pill badges)
4. [x] Generate settlement plan (min-flow algorithm) + mark paid / confirm
5. [x] UPI deep-link generation on settlement cards (`upi://pay?pa=...`)
6. [x] Category analytics & spending breakdowns
7. [ ] Auth (register / login / session - server integration)

**Definition of done:** new user can create a trip group, add one expense, see “you are owed”, and settle with one suggested payment.

### Phase 2 — Smart input

- Natural-language expense parse → review → confirm (AI never commits ledger)
- Receipt upload + OCR → review → confirm
- Push / email settlement reminders

### Phase 3 — Analytics & advanced splits

- Percentage + item-based splits
- Category analytics
- Group budget warnings
- Multi-currency (store original + optional conversion; never silently rewrite original)

### Phase 4 — Offline & polish

- Local cache (SQLite / IndexedDB strategy)
- Conflict policy for offline writes
- Desktop / mobile Dioxus targets sharing `settle-domain`

---

## 7. Testing priorities

Always in `settle-domain`:

- Equal split with remainder (₹100 / 3 people)
- Unequal sum validation
- Zero / one-paise / large amounts
- Multi creditor / multi debtor minimization
- Idempotent balance after expense edit/delete scenarios (API integration tests later)

UI: critical journeys (signup → group → expense → settle) once API is stable.

---

## 8. Security checklist

- No secrets in `settle-web`
- Password hashing (argon2) on API
- HttpOnly session cookies (SameSite)
- Membership checks server-side
- Receipt uploads treated as untrusted binary
- Never accept client-supplied balances

---

## 9. Near-term build order (execution sequence)

```text
1. settle-domain  → money + splits + settlement + tests
2. settle-db      → schema migrations (users, groups, expenses, shares, settlements)
3. settle-api     → auth + groups + expenses + balances + settlements
4. settle-web     → design system shell → Home → Groups → Add Expense → Settle
```

Each step should leave `cargo test -p settle-domain` and `cargo check` green.

---

## 10. Out of scope for MVP

- Payment provider settlement (UPI deep-link only)
- Chat, event planning
- Recurring expenses
- Full offline write sync
- Native iOS/Android packaging

---

## Sources

- [AGENTS.md](AGENTS.md) — architecture & quality rules  
- [INSTRUCTIONS.md](INSTRUCTIONS.md) — agent / UI rules  
- [documentation.md](documentation.md) — full product surface  
- [user_flow.md](user_flow.md) — new vs returning flows  
- [solution.md](solution.md) / [idea_origin.md](idea_origin.md) — positioning  
- [PRD](design-files/papper_cutter_product_requirements_document_prd.md) — milestones & FR  
