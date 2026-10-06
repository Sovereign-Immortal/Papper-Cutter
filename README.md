# Papper Cutter

Smart group-expense and settlement app — track who paid, calculate fair shares, and settle with fewer transactions.

> **UPI moves money. Papper Cutter organizes the logic before the payment.**

## Stack

| Layer | Tech |
| --- | --- |
| Mobile App | React + TypeScript (Vite, mobile-first PWA / Android) / Dioxus |
| UI Design | Warm Pastel Harmony (Plus Jakarta Sans, iOS/Android comfy surfaces) |
| Domain | Pure financial logic — integer minor units (paise) math |

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for phases, architecture, and feature roadmap.

## Project Structure

```text
android-app/     # Mobile Android application (React + Vite + Warm Pastel Harmony)
design-files/    # Concept studio, stitch UI designs, and PRD specifications
docs/            # Product specs, architecture, user flows, and origin documentation
```

## Running the Android App

```bash
cd android-app
npm install
npm run dev
```

Open the local server URL in your browser or Android device to test the mobile app.

## Product Documentation

- [AGENTS.md](AGENTS.md) — engineering principles  
- [INSTRUCTIONS.md](INSTRUCTIONS.md) — UI / agent rules  
- [documentation.md](documentation.md) — full product surface  
- [user_flow.md](user_flow.md) — new vs returning flows  
- [solution.md](solution.md) — solution definition  
- [idea_origin.md](idea_origin.md) — product background and rationale  
- [PRD](design-files/papper_cutter_product_requirements_document_prd.md) — product requirements document

