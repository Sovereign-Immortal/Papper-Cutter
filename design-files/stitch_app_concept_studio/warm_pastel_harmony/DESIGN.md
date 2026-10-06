---
name: Warm Pastel Harmony
colors:
  surface: '#fff8f4'
  surface-dim: '#e3d8cf'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf2e8'
  surface-container: '#f7ece3'
  surface-container-high: '#f1e6dd'
  surface-container-highest: '#ebe1d7'
  on-surface: '#201b15'
  on-surface-variant: '#484552'
  inverse-surface: '#352f29'
  inverse-on-surface: '#faefe5'
  outline: '#797584'
  outline-variant: '#c9c4d4'
  surface-tint: '#5e4eb8'
  primary: '#5c4bb5'
  on-primary: '#ffffff'
  primary-container: '#7565d0'
  on-primary-container: '#fffbff'
  inverse-primary: '#c9bfff'
  secondary: '#1a6b4b'
  on-secondary: '#ffffff'
  secondary-container: '#a5f3ca'
  on-secondary-container: '#227151'
  tertiary: '#91462e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05e44'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5deff'
  primary-fixed-dim: '#c9bfff'
  on-primary-fixed: '#1a0063'
  on-primary-fixed-variant: '#46349e'
  secondary-fixed: '#a5f3ca'
  secondary-fixed-dim: '#8ad6af'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59e'
  on-tertiary-fixed: '#3a0b00'
  on-tertiary-fixed-variant: '#76321c'
  background: '#fff8f4'
  on-background: '#201b15'
  surface-variant: '#ebe1d7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

This design system transforms group finances from a source of social friction and anxiety into a gentle, collaborative ritual. The brand personality is considerate, soft-spoken, tactile, and warm. Designed for roommates, travel groups, partners, and close friends, the interface replaces spreadsheet intimidation with comfortable, pillowy interactions.

The visual style blends soft minimalism with tactile, cushion-like surfaces. Rather than cold, clinical fintech conventions (monochrome tables, stark contrasts, and alarming red debt indicators), this system relies on soothing pastel hues, generous rounded corners (20px–28px), and gentle, ambient shadows that evoke physical, plush paper cards resting comfortably on a warm linen tablecloth.

## Colors

The palette is anchored by soft, soothing tones that evoke calm and mutual trust:

- **Primary (`#8B7BE8` / Accent `#9C8EF2`):** Gentle Lavender. Represents reconciliation, primary actions, and overall group balance totals without aggressive visual demand.
- **Secondary (`#78C49E` / Light `#8FD6B2`):** Sage Matcha. Represents positive balances ("you are owed"), successful settlements, and confirmations.
- **Tertiary (`#FF9E80`):** Soft Apricot Coral. Used gently for expenses ("you owe"), pending splits, or alerts—warm and reassuring rather than punitive.
- **Accent Highlight (`#FDE68A`):** Butter Yellow. Provides soft warmth for pending badges, shared trip highlights, or active splits.
- **Neutrals & Surfaces:**
  - `Canvas Base`: `#FBF9F5` (Cozy Cream)
  - `Surface Container Low`: `#F5F1EB` (Warm Linen)
  - `Surface Container High`: `#EFE9E0` (Soft Oat)
  - `Text Primary`: `#36312C` (Deep Warm Espresso)
  - `Text Secondary`: `#756C63` (Muted Cocoa)
  - `Borders & Separators`: `#E5DFD5` (Warm Sandstone)

## Typography

Plus Jakarta Sans is utilized uniformly across headlines, body copy, and UI labels. Its geometric yet softly sculpted letterforms (notably rounded bowls and open apertures) reflect friendliness without compromising the legibility essential for numerical financial data. 

Monetary figures adopt `fontWeight: 600` or `700` paired with standard tabular numerals (`tnum`) to keep running totals aligned and serene. Line heights remain generous across all tiers to preserve vertical breathing room and reduce visual density.

## Layout & Spacing

The layout embraces an airy, fluid column structure centered on handheld and tablet experiences, scaling gracefully to desktop dashboards:

- **Mobile (<768px):** 4 fluid columns, `margin-mobile` of 1rem (16px), and `gutter-mobile` of 0.75rem (12px). All balance cards, avatar rows, and settlement summaries take full container width or scroll horizontally within relaxed margins.
- **Tablet (768px–1024px):** 8 fluid columns, 1.5rem margins, and 1rem gutters. Two-column card decks organize active trips and personal debts cleanly.
- **Desktop (>1024px):** 12 fluid columns constrained to a max-width of 1200px, 2rem margins, and 1.25rem gutters. Sidebars, balance breakdowns, and expense feeds rest in distinct pillowed card panels.

Component padding relies heavily on `space-md` (20px) and `space-lg` (28px) to establish deep, cloud-like boundaries around dense transaction details.

## Elevation & Depth

Visual hierarchy is constructed through soft, ambient tonal layering and pillowed, multi-layer drop shadows rather than crisp dark drop-offs or harsh dividing lines.

- **Level 0 (Canvas Base):** Flat `#FBF9F5` cozy cream foundation.
- **Level 1 (Surface Cards & Containers):** `#FFFFFF` or `#F5F1EB` linen tint with an ambient, diffused shadow: `0 8px 24px -4px rgba(94, 87, 80, 0.06), 0 2px 6px -1px rgba(94, 87, 80, 0.04)`.
- **Level 2 (Interactive Cards & Floating Modals):** Soft tactile elevation: `0 14px 34px -6px rgba(139, 123, 232, 0.12), 0 4px 12px -2px rgba(94, 87, 80, 0.05)`. Lavender-tinted ambient glow reinforces warmth.
- **Level 3 (Tactile Pill Buttons & Sticky Action Trays):** Gentle lift: `0 8px 20px -2px rgba(139, 123, 232, 0.28)`. On tap or press, the shadow retracts inwards (`0 2px 6px rgba(139, 123, 232, 0.2)`), offering a squishy, responsive physical feel.

## Shapes

The design system employs a pillowy, organic shape profile defined by ultra-soft radiuses:

- **Cards & Surface Containers:** Sculpted with 20px–28px corner radii (`rounded-3xl`), evoking thick, rounded physical paper cards or foam-backed tiles.
- **Buttons, Badges, & Chips:** Pure pill silhouettes (`border-radius: 9999px`) creating natural tactile affordances that invite pressing.
- **Inputs & Dropdowns:** 20px radiuses matching card softness while maintaining distinct form definitions.
- **Avatars & Participant Tokens:** True circular geometry (pill radius) nested within 2px warm cream borders.

## Components

### Buttons
- **Primary Action (e.g., "Add Expense", "Settle Up"):** Pill shape, Lavender background (`#8B7BE8`), crisp white text, and a soft lavender-tinted drop shadow. Subtle scale down to 0.98 on press with an ease-out spring.
- **Secondary Action:** Cream-linen surface (`#F5F1EB`), espresso text (`#36312C`), zero border, with a gentle hover tint to `#EFE9E0`.
- **Tertiary / Ghost:** Transparent base, soft lavender text, pill highlight on press.

### Chips & Filters
- **Status & Member Filter Chips:** Pill shape with generous horizontal padding (16px). Unselected chips use `#F5F1EB` background with `#756C63` text. Selected chips activate with pastel butter yellow (`#FDE68A`) or sage matcha (`#8FD6B2`), shifting text to high-contrast deep warm espresso.

### Input Fields & Numeric Entry
- **Text & Category Inputs:** 20px border radius, `#FFFFFF` interior, enclosed by a delicate 1.5px `#E5DFD5` border. On focus, transitions smoothly to a 1.5px `#8B7BE8` ring with a 4px soft `#8B7BE8`/15% halo.
- **Split Amount Input:** Giant display typography (`display-lg`), centered, with effortless tapped increment/decrement pill toggles.

### Cards
- **Expense Item Card:** Crisp white surface with 24px radius, ambient Level 1 shadow, and 16px internal padding. Category icons are housed in pastel circular pods (apricot, matcha, butter, or lavender).
- **Settlement Summary Card:** Warm Linen surface (`#F5F1EB`) surrounded by an ultra-soft 1px `#E5DFD5` outline. Balances display in Matcha green pill tags (`+$24.50`) or Apricot coral pill tags (`-$12.00`).

### Checkboxes & Segmented Controls
- **Checkboxes:** 8px softly rounded squircle with a 1.5px warm sandstone border. Checked state fills with Sage Matcha (`#78C49E`) containing a rounded white checkmark icon.
- **Split Segmented Control:** Continuous pill track in `#EFE9E0` with a sliding pill thumb in `#FFFFFF` backed by Level 1 ambient depth.

### Additional Product Components
- **Group Balance Cushion:** A plush top-of-screen summary card featuring a 28px radius, gradient-tinged pastel background (cream into subtle lavender mist), summarizing total unsettled group balance with tranquil clarity.
- **Participant Pill Avatars:** Overlapping circular avatars with colored pastel status rings, tapping directly into personalized settlement sheets.