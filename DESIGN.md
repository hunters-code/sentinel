---
name: Sentinel
description: One-hour crash insurance for BTC — honest quotes on a Sui-native dark surface
colors:
  sui-blue: "#298dff"
  sui-blue-bright: "#5ca9ff"
  sui-blue-dark: "#1759c4"
  sui-blue-darker: "#002e6a"
  sui-black: "#000000"
  sui-white: "#ffffff"
  sui-steel: "#89919f"
  sui-steel-dark: "#6c7584"
  signal-lime: "#7df752"
  signal-orange: "#fa8543"
  surface-panel: "rgba(255, 255, 255, 0.04)"
  border-line: "rgba(255, 255, 255, 0.12)"
typography:
  display:
    fontFamily: "Geologica, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geologica, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geologica, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  pill: "9999px"
  panel: "16px"
  input: "12px"
  chip: "9999px"
spacing:
  touch-min: "44px"
  panel-sm: "24px"
  panel-md: "32px"
  section-y: "96px"
  container: "1140px"
components:
  button-primary:
    backgroundColor: "{colors.sui-blue}"
    textColor: "{colors.sui-black}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    height: "{spacing.touch-min}"
  button-primary-hover:
    backgroundColor: "{colors.sui-blue-bright}"
    textColor: "{colors.sui-black}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.sui-white}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  chip-active:
    backgroundColor: "transparent"
    textColor: "{colors.sui-blue-bright}"
    rounded: "{rounded.chip}"
    padding: "2px 10px"
  chip-paid:
    backgroundColor: "transparent"
    textColor: "{colors.signal-lime}"
    rounded: "{rounded.chip}"
    padding: "2px 10px"
  panel:
    backgroundColor: "{colors.surface-panel}"
    textColor: "{colors.sui-white}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-sm}"
---

# Design System: Sentinel

## Overview

**Creative North Star: "The Honest Quote"**

Sentinel looks like a trading terminal after hours: black field, one Sui-blue accent, numbers you can audit. The anxious BTC holder arrives at 2pm before a CPI print — they need one premium, one button, one receipt. Visual noise is the enemy. Insurance language leads; protocol plumbing hides behind expanders.

The system explicitly rejects generic Web3 landing scaffolds (numbered section eyebrows, identical three-card grids, scrolling buzzword marquees), cream SaaS defaults, and options-desk jargon above the fold. Surfaces are flat and tonal — depth comes from radial blue gradients and panel tints, not drop shadows.

**Key Characteristics:**

- Committed dark mode on `#000000` with Sui ecosystem blue as the sole saturated accent
- Geologica display + Manrope body — geometric headline against humanist prose
- Pill-shaped primary actions (44px min height) on every conversion path
- Quote numbers rendered large in `--sui-blue-bright`; supporting copy in `--sui-steel`
- Flat elevation: bordered panels at 4% white tint, no card shadows
- Status communicated through colored chips (lime = paid/live, steel = expired, orange = warning)

## Colors

A committed Sui-native palette: near-black ground, protocol blue accent, steel neutrals for legibility.

### Primary

- **Sui Protocol Blue** (`#298dff`): Primary CTAs, active term pills, brand mark. Black text on this surface always (`#000000`).
- **Bright Quote Blue** (`#5ca9ff`): Hero accent lines, trigger/payout highlights in quote cards, focus rings, hover state for primary buttons.
- **Deep Oracle Navy** (`#002e6a`): Section backgrounds (stack, active tab), modal secondary panel in wallet UI.

### Secondary

- **Signal Lime** (`#7df752`): Paid status, live keeper badge, success confirmations. Used sparingly — a payout landed.
- **Signal Orange** (`#fa8543`): Quote expiry warnings, purchase errors. Never decorative.

### Neutral

- **Void Black** (`#000000`): Page background for `.landing` and `.sentinel-app` shells.
- **Paper White** (`#ffffff`): Headline text, input values, final CTA inversion (white button on dark gradient).
- **Steel Muted** (`#89919f`): Body copy, helper text, disclosures. Minimum contrast target: 4.5:1 on black.
- **Steel Dim** (`#6c7584`): Tertiary metadata, offline states, footer fine print.
- **Hairline** (`rgba(255, 255, 255, 0.12)`): Panel borders, segmented nav, dividers between list rows.
- **Panel Tint** (`rgba(255, 255, 255, 0.04)`): Card/panel fill on black.

### Named Rules

**The One Accent Rule.** Sui blue carries conversion and emphasis. Lime and orange appear only for status semantics — never as decorative gradients or section backgrounds.

**The Steel-on-Black Rule.** Body text uses `--sui-steel`, not a lighter gray. If contrast is borderline at `text-xs`, bump to `--sui-white` at 80% opacity or `--sui-steel` on `--sui-blue-darker` only.

## Typography

**Display Font:** Geologica (system-ui fallback)
**Body Font:** Manrope (system-ui fallback)

**Character:** Geometric display gives headlines institutional weight without serif editorial affectation. Manrope keeps quote breakdowns and disclosures readable at 65–75ch.

### Hierarchy

- **Display** (500, `clamp(2.75rem, 8vw, 5.5rem)`, 1.02): Landing hero only. `text-wrap: balance`. Accent the final line in `--sui-blue-bright`.
- **Headline** (500, `clamp(1.75rem, 5vw, 2.25rem)`, 1.08): App page title, section h2s, quote payout amounts at `text-3xl`.
- **Title** (500, 18px, 1.3): Panel headings ("How much BTC do you hold?", tab labels).
- **Body** (400, 16px, 1.5): Prose, disclosure bullets, quote detail. Use `text-pretty` on multi-sentence blocks.
- **Label** (500, 14px): Eyebrow kickers, status chips, metadata rows. Sentence case — never uppercase tracked eyebrows on every section.

### Named Rules

**The Insurance-First Rule.** Headlines say "Protect your Bitcoin" and "Get a quote." Protocol terms (`predict::mint`, `get_trade_amounts`) live in `<details>` expanders only.

**The Display Cap Rule.** Hero clamp max stays at 5.5rem (~88px). Letter-spacing floor −0.03em on display headings.

## Elevation

This system is flat by default. Depth is conveyed through tonal layering — radial blue gradients on the page shell, `--sui-blue-darker` section bands, and 4% white panel tints — not box shadows. Primary buttons have no shadow. Wallet modal overlay uses `rgba(0, 0, 0, 0.72)` with optional 8px blur.

### Named Rules

**The Flat-By-Default Rule.** No drop shadows on cards, buttons, or nav. If an element needs emphasis, use color size or border — not elevation.

**The Gradient-Depth Rule.** Hero and app shells may use fixed radial gradients (`rgba(41,141,255,0.18–0.22)` on black). One or two ellipses maximum; never full-bleed mesh gradients.

## Components

### Buttons

- **Shape:** Full pill (`border-radius: 9999px`), minimum height 44px.
- **Primary:** `--sui-blue` background, `#000000` text, `hover:opacity-90`. Label: "Get a quote" on landing, "Protect my Bitcoin — $X" on app purchase.
- **Secondary / Ghost:** Transparent fill, `--sui-line` border, white text, `hover:bg-white/5`.
- **Focus:** 2px `--sui-blue-bright` outline, 3px offset.
- **Disabled:** `opacity: 40%`, `cursor: not-allowed`.

### Chips

- **Style:** Rounded-full, 1px border, `text-xs font-medium`, no fill.
- **Active:** `--sui-blue-bright` text, `rgba(92, 169, 255, 0.35)` border.
- **Paid / Live:** `#7df752` text, matching tinted border.
- **Expired / Offline:** `--sui-steel` or `--sui-steel-dark` text, `--sui-line` border.

### Cards / Containers

- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** `rgba(255, 255, 255, 0.04)`.
- **Border:** 1px `--sui-line`.
- **Shadow Strategy:** None.
- **Internal Padding:** 24px mobile, 32px desktop (`p-6 md:p-8`).
- **Nested cards:** Prohibited.

### Inputs / Fields

- **Style:** 12px radius, 1px `--sui-line` border, `rgba(0, 0, 0, 0.35)` fill.
- **Value typography:** Display font, 20px+, white.
- **Suffix label:** `--sui-steel`, 14px ("BTC").
- **Focus:** Same as buttons — blue-bright outline.

### Navigation

- **Header:** Fixed, `--sui-black` solid fill, bottom hairline. Logo mark: 32px square, `--sui-blue` fill, "S" monogram.
- **Landing nav:** Text links in `--sui-steel`, desktop inline; mobile full-screen `<dialog>`.
- **App tabs:** Segmented control — outer `rounded-xl` with hairline border, active segment `--sui-blue-darker` fill.
- **Wallet connect:** `SentinelConnectButton` (primary pill) when disconnected; dapp-kit `ConnectButton` when connected, themed via `sentinelDappKitTheme`.

### Quote Card (signature component)

The insurance promise rendered as a single readable block: spot context in steel, trigger and payout in `--sui-blue-bright` at headline scale, premium as display-weight secondary line. Mirrors PRODUCT.md demo script ($98,000 trigger, $1,000 payout, ~$14 premium).

## Do's and Don'ts

### Do:

- **Do** lead every screen with insurance language — premium, coverage, trigger, payout, receipt.
- **Do** show plain disclosures in-product (parametric payout, oracle expiry window, PLP counterparty, 1% minimum premium, not regulated insurance).
- **Do** use `--sui-blue` pill buttons for every primary conversion path with 44px minimum touch targets.
- **Do** hide protocol implementation details in "For builders" or "How is this priced?" expanders.
- **Do** respect `prefers-reduced-motion`: static fallbacks for hero stagger, marquee, and chart pulse.

### Don't:

- **Don't** use cream, sand, or warm off-white page backgrounds — the surface is void black or deep navy bands.
- **Don't** stack numbered section markers (`01 / 02 / 03`) or identical three-card grids across multiple sections.
- **Don't** use glassmorphism (backdrop-blur headers), gradient text, or side-stripe colored borders on cards.
- **Don't** show `dUSDC`, strike ladders, or vol-surface jargon above the fold on consumer screens.
- **Don't** promise "live" data on decorative/static visuals — label illustrations as "example."
- **Don't** ship new surfaces in the legacy wireframe style (`.wrap`, `.box`, `#ccc` borders) — migrate to `.sentinel-app` tokens.
