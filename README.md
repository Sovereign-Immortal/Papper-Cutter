# Papper Cutter

Smart group-expense and settlement app for trips, roommates, hostel groups, and friends.

> UPI moves money. Papper Cutter organizes the logic before the payment.

## What this project does

Papper Cutter helps groups:

- track who paid for what
- split expenses fairly across members
- calculate balances and outstanding dues
- generate optimized settlement suggestions
- keep the math deterministic and transparent

The product is designed around a calm, premium mobile-first experience with strong financial accuracy.

## Current workspace

```text
android-app/                     # React + TypeScript mobile-first app shell
crates/
  papper-cutter-domain/          # Rust domain logic for splits, balances, settlements
  papper-cutter-mobile/          # Dioxus-based mobile app project

design-files/                   # PRD and UI concept files
IMPLEMENTATION_PLAN.md          # roadmap and phased plan
documentation.md                # product documentation
solution.md                     # solution overview
user_flow.md                    # user journeys
idea_origin.md                  # motivation and product rationale
AGENTS.md                       # engineering principles and product rules
INSTRUCTIONS.md                 # implementation guidance
```

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend app | React + TypeScript + Vite |
| Mobile app | Dioxus + Rust |
| Domain logic | Rust with explicit money/balance calculations |
| Design direction | Warm pastel, iOS-inspired mobile UX |
| Finances | Integer minor units for reliable money math |

## Quick start

### 1) Run the web/mobile app

```bash
cd android-app
npm install
npm run dev
```

Then open the local Vite URL in your browser or on a mobile device.

### 2) Run the Rust workspace

```bash
cargo build
cargo test
```

This builds the Rust domain and mobile crates in the workspace.

## Product docs

- [AGENTS.md](AGENTS.md) — engineering principles
- [INSTRUCTIONS.md](INSTRUCTIONS.md) — coding and UI rules
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — architecture and roadmap
- [documentation.md](documentation.md) — full product surface
- [user_flow.md](user_flow.md) — onboarding and usage flows
- [solution.md](solution.md) — proposed system design
- [idea_origin.md](idea_origin.md) — background and motivation
- [design-files/papper_cutter_product_requirements_document_prd.md](design-files/papper_cutter_product_requirements_document_prd.md) — product requirements

## Status

This repo is currently structured as a hybrid product prototype:

- a mobile-first React app for interface exploration and interaction flow
- a Rust workspace for deterministic expense and settlement logic
- design artifacts proving the intended product direction

The domain logic and product architecture are intentionally separated so the settlement engine can be reused outside the UI layer.

