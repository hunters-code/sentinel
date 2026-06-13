<!-- SEED: re-run /impeccable document once there's real UI to capture the actual tokens and components. -->
---
name: Sentinel
description: One-hour parametric crash insurance for BTC — protection that feels like one confident tap.
---

# Design System: Sentinel

## 1. Overview

**Creative North Star: "The Friendly Forcefield"**

Sentinel makes a frightening idea — your BTC crashing — feel like flipping on a shield. The system is warm, confident, and a little playful: a friendly-fintech surface (in the lineage of Cash App, Monzo, and Wise) where money is handled plainly and the scary part is disarmed, never dramatized. Color does real work here; this is a **full-palette** system where each hue carries a specific job (the brand, the protected state, the payout, the trigger), not decoration.

The anchor is a **fresh indigo/periwinkle** — calm but alive, the color of a protective field switched on. We deliberately step past the obvious Bitcoin-orange cultural pull; the BTC reference comes from copy, the live price line, and imagery, not from drenching the UI in orange (which reads "degen"). Motion is **choreographed**: the one-tap purchase and the receipt/payout are moments worth staging, not afterthoughts. The receipt is treated as the hero artifact of the whole product.

This system explicitly rejects four things: legacy-insurance-corporate (stock photos, legalese, navy-and-gray trust-by-default), degen-crypto-casino (neon gradients, confetti, number-go-up), the generic DeFi dashboard (APY cards, glassmorphism, token-soup tables), and AI editorial-slop (display-serif italic + tiny tracked-uppercase eyebrows + ruled columns).

**Key Characteristics:**
- Full palette: every color owns a product role (brand · protected · payout · trigger · neutral).
- Indigo/periwinkle anchor; warmth and play carried by accents and copy.
- Distinctive display headline voice + a clean, highly legible sans for body and data.
- Choreographed motion, concentrated on the tap and the receipt/payout moment.
- Honesty is visible: premium math and disclosures are designed in, not buried.
- The receipt is the hero.

## 2. Colors

A full palette where hue maps to meaning: the brand field, the protected state, the payout, and the trigger each get their own committed color, balanced on calm neutrals. *(Seed: exact values resolved at implementation; keep them rich and confident, never neon.)*

### Primary
- **Guard Indigo** (`[to be resolved during implementation]` — fresh indigo/periwinkle): the brand field. Primary action ("Protect my Bitcoin"), the ACTIVE/covered state, focus, and key emphasis.

### Secondary
- **Payout Green** (`[to be resolved during implementation]`): the positive-outcome color. The `PAID` status, the withdraw moment, "you got paid" celebration. Reserved for genuine wins so it stays meaningful.

### Tertiary
- **Signal Amber** (`[to be resolved during implementation]`): the trigger / attention color. The trigger line on the price chart, the floor-disclosure callout, "pricing unavailable" warnings. Caution without alarm.

### Neutral
- **Ink** (`[to be resolved during implementation]`): primary text. Must clear AA (≥4.5:1) on its surface; lean toward the dark end, never light-gray-for-elegance.
- **Soft Surface** (`[to be resolved during implementation]`): the calm background the palette sits on (a deliberate near-neutral, not a warm cream default).
- **Muted** (`[to be resolved during implementation]`): secondary text, dividers, helper copy — still AA-legible.

### Named Rules
**The Status-Color Rule.** Policy state is never communicated by color alone. ACTIVE, `PAID`, and `EXPIRED — NO CLAIM` each pair a color with a text label and a distinct shape/icon, so colorblind users and screenshots both read correctly.

**The No-Neon Rule.** The palette is rich and confident but never neon, never gradient-on-gradient, never glowing. The moment a screen could be mistaken for a casino or a degen launchpad, the color has failed.

**The Earned-Green Rule.** Payout Green appears only on real positive outcomes (a settled payout, a successful withdraw). Using it for generic "success" toasts dilutes the one moment that matters.

## 3. Typography

**Display Font:** `[distinctive display family — to be chosen at implementation]` (avoid reflex-reject defaults: not Inter, DM, Space, Fraunces, Cormorant)
**Body Font:** `[clean, highly legible sans — to be chosen at implementation]`

**Character:** A playful-but-confident display voice for the few big statements ("If BTC drops below $98,000, you get $1,000"), paired with a neutral, trustworthy sans that disappears into dense numbers and disclosures. Pair on a real contrast axis, not two near-identical sans-serifs.

### Hierarchy
- **Display** (`[weight/clamp to be set]`): the single hero statement per screen — the live coverage line, the payout amount on the receipt. One per fold.
- **Headline** (`[to be set]`): screen titles, section leads.
- **Title** (`[to be set]`): card and group labels.
- **Body** (`[to be set]`): explanations, disclosures, the premium breakdown. Cap prose at 65–75ch.
- **Label** (`[to be set]`): status chips, field labels, metadata. Sentence case by default — avoid all-caps as decoration.

### Named Rules
**The Tabular Money Rule.** Every currency figure, premium, coverage amount, strike, and countdown uses tabular lining numerals so values don't jitter as they update live. Money is the product; it must never shift on the baseline.

**The One-Statement Rule.** Display type carries exactly one idea per fold (the coverage promise, the payout). If two things are fighting for display size, one of them isn't display.

## 4. Elevation

Choreographed motion implies a **layered, buoyant** depth model rather than a flat one. Surfaces feel liftable: the quote card and especially the receipt rise toward the user at key moments. Depth is soft and ambient (diffuse, low-contrast shadows tinted toward Guard Indigo), never the hard 2014 drop-shadow. *(Seed: exact shadow tokens resolved at implementation.)*

### Named Rules
**The Buoyant Receipt Rule.** The receipt is the most elevated object in the system — it lifts in on confirmation and reads as something you could pick up and share. Nothing else competes with it for elevation.

**The Calm-At-Rest Rule.** Surfaces are quiet at rest; elevation and motion are responses to state (tap, confirm, settle, pay), not ambient decoration. All motion has a `prefers-reduced-motion` alternative (crossfade or instant).

## 6. Do's and Don'ts

### Do:
- **Do** give every color a job (brand · protected · payout · trigger · neutral) and use it only for that job.
- **Do** show the premium math in plain sight — fair value · spread · floor — as a designed element, not fine print.
- **Do** treat the receipt as the hero: legible, elevated, shareable.
- **Do** pair status color with a label and a shape (Status-Color Rule); never rely on hue alone.
- **Do** use tabular numerals for all money and countdowns.
- **Do** keep body text at AA contrast (≥4.5:1); bump toward Ink before reaching for light gray.
- **Do** provide a reduced-motion alternative for every choreographed moment.

### Don't:
- **Don't** drench the UI in Bitcoin orange or lean on crypto-symbol palettes; let BTC show up in copy and the price line.
- **Don't** drift into degen-crypto-casino: no neon gradients, no confetti, no number-go-up hype, no glow.
- **Don't** look like legacy-insurance-corporate: no stock photos of smiling families, no legalese walls, no navy-and-gray "trust us".
- **Don't** build the generic DeFi dashboard: no APY cards, no glassmorphism, no token-soup tables, no wallet-first chrome.
- **Don't** default to AI editorial-slop: no display-serif-italic headers, no tiny tracked-uppercase eyebrows above every section, no ruled three-column restraint.
- **Don't** use `border-left`/`border-right` >1px as a colored accent stripe, and never use gradient text.
