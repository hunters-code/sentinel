---
name: Sentinel
description: Parametric crash insurance for crypto — honest quotes on a Sui-native dark surface
colors:
  sui-blue: "#298dff"
  sui-blue-bright: "#5ca9ff"
  sui-blue-light: "#ddf2ff"
  sui-blue-dark: "#1759c4"
  sui-blue-darker: "#002e6a"
  sui-root-bg: "#041e3a"
  mesh-navy: "#001428"
  mesh-deep: "#042848"
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
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
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
  glow-cta: "26px"
  panel: "16px"
  input: "12px"
  chip: "9999px"
  nav-dropdown: "28px"
spacing:
  touch-min: "44px"
  panel-sm: "24px"
  panel-md: "32px"
  section-y: "96px"
  container: "1140px"
  hero-copy-max: "64rem"
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
  button-glow-cta:
    backgroundColor: "transparent"
    textColor: "{colors.sui-white}"
    rounded: "{rounded.glow-cta}"
    padding: "14px 30px"
    height: "{spacing.touch-min}"
  button-glow-cta-hover:
    textColor: "{colors.sui-blue-bright}"
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

Sentinel's landing page is a single full-viewport moment: centered copy over a living blue mesh, one glow CTA, no secondary actions competing for attention. The holder arrives anxious before a volatility event — they need coverage language, not a protocol tour. Insurance framing leads; builder details stay in expanders on lower sections (when enabled).

The current shipped landing is **hero-only** — headline, lead, and "Get a quote." Deeper sections (marquee, how-it-works, stack, disclosures, footer) exist in code but are toggled off until the hero composition is locked. The app shell (`/app`) keeps the flat terminal aesthetic: bordered panels, steel body copy, pill blue buttons.

The system rejects generic Web3 landing scaffolds (numbered section eyebrows on every block, identical three-card grids, buzzword marquees as the main event), cream SaaS defaults, and options-desk jargon above the fold.

Landing implementation uses shared design tokens from `globals.css` with component-level utility composition, so landing and app surfaces keep one visual language.

**Key Characteristics:**

- Full-viewport hero (`100svh`) with vertically centered copy block (max-width 56–64rem)
- Animated multi-blob mesh atmosphere on the landing hero only — Sui blue ramp on black/navy ground
- Geologica display headlines; final hero line accented in `--sui-blue-bright`
- Staggered CSS reveal (`sentinel-rise`: rise + blur-to-sharp) on headline lines, lead, and CTA — SSR-safe via `animation-fill-mode: backwards`
- Glow CTA (`QuoteCtaButton`) as the landing conversion control — rotating conic border, white label
- Flat app surfaces: 4% white panel tints, hairline borders, no card shadows
- Crypto-wide copy on landing ("your crypto") — not BTC-only, not a fixed "one hour" promise

## Colors

A committed Sui-native palette: void black and deep navy ground, protocol blue as the saturated accent, steel for legibility.

### Primary

- **Sui Protocol Blue** (`#298dff`): App primary CTAs, active term pills, brand mark. Black text on this surface always (`#000000`).
- **Bright Quote Blue** (`#5ca9ff`): Hero accent line ("you're covered."), trigger/payout highlights, focus rings, glow CTA hover text.
- **Deep Oracle Navy** (`#002e6a`): Section bands (stack, active tab), modal secondary panel in wallet UI.
- **Mesh Navy** (`#001428` / `#042848`): Landing hero mesh base layers and blob falloff — keeps color coverage above ~40% black on the hero.

### Secondary

- **Signal Lime** (`#7df752`): Paid status, live keeper badge, chart floor line in illustrations. Used sparingly — a payout landed.
- **Signal Orange** (`#fa8543`): Quote expiry warnings, purchase errors. Never decorative.

### Neutral

- **Void Black** (`#000000`): Header fill, hero mesh ground, `.landing` and `.sentinel-app` shells.
- **Paper White** (`#ffffff`): Headline text, glow CTA label, input values, inverted final CTA on gradient sections.
- **Steel Muted** (`#89919f`): Body copy, nav descriptions, disclosures. Minimum contrast target: 4.5:1 on black.
- **Steel Dim** (`#6c7584`): Tertiary metadata, placeholders, offline states.
- **Hairline** (`rgba(255, 255, 255, 0.12)`): Panel borders, segmented nav, mobile menu button stroke.
- **Panel Tint** (`rgba(255, 255, 255, 0.04)`): Card/panel fill on black.

### Named Rules

**The One Accent Rule.** Sui blue carries conversion and hero atmosphere. Lime and orange appear only for status semantics — never as decorative section backgrounds.

**The Mesh-Hero-Only Rule.** Animated multi-blob mesh gradients live on `.landing-hero-bg` only. The app shell and lower landing sections stay flat and tonal. Never export mesh treatment to quote cards or data panels.

**The Steel-on-Black Rule.** Body text uses `--sui-steel`, not a lighter gray. Hero lead uses white at 84% opacity; `<strong>` bumps to full white.

## Typography

**Display Font:** Geologica (system-ui fallback)
**Body Font:** Manrope (system-ui fallback)

**Character:** Geometric display gives headlines institutional weight without serif editorial affectation. Manrope keeps quote breakdowns and disclosures readable at 65–75ch.

### Hierarchy

- **Display** (500, `clamp(2.75rem, 7vw, 5.5rem)`, 1.02): Landing hero headline only. `text-wrap: balance`. Two-line stack; accent the payoff line in `--sui-blue-bright`. Current copy: "When the market drops" / "you're covered."
- **Hero lead** (400, `clamp(1.0625rem, 1.8vw, 1.375rem)`, 1.6): Single centered paragraph under headline. `text-wrap: pretty`. Key terms in `<strong>` at full white weight 600.
- **Headline** (500, `clamp(1.75rem, 5vw, 2.25rem)`, 1.08): App page title, section h2s when lower landing sections are enabled.
- **Title** (500, 18px, 1.3): Panel headings, nav trigger labels (Geologica at 16–18px on desktop).
- **Body** (400, 16px, 1.5): Prose, disclosure bullets, quote detail.
- **Label** (500, 14px): Dropdown descriptions, status chips, metadata. Sentence case — no uppercase tracked eyebrows on every section.

### Named Rules

**The Insurance-First Rule.** Landing hero says "you're covered" and "Get a quote." Protocol terms (`predict::mint`, `get_trade_amounts`) live in `<details>` expanders only on lower sections.

**The Display Cap Rule.** Hero clamp max stays at 5.5rem (~88px). Letter-spacing floor −0.03em on display headings; glow CTA label uses +0.045em for optical balance.

**The No-Fixed-Duration Rule.** Never promise a literal "one hour" on consumer-facing copy. Coverage window is oracle expiry — state that in disclosures, not the hero.

## Elevation

Flat by default on app surfaces and cards. The landing hero is the exception: depth comes from **tonal mesh layering** — five blurred radial blobs (`filter: blur(72px)`) drifting on independent 20–32s loops, plus a vignette that preserves text contrast. Primary app buttons have no shadow.

Nav dropdown panels use a **functional glass treatment** (28px blur, deep navy fill at 97% opacity) — permitted only for desktop hover menus, not as a default card style.

### Named Rules

**The Flat-By-Default Rule.** No drop shadows on cards, app buttons, or the landing header. Emphasis via color, size, or border.

**The Vignette-Over-Mesh Rule.** Every mesh hero ships with a radial + linear vignette so white headline copy stays readable. If contrast fails at a breakpoint, darken the vignette — never lighten the type to gray.

**The Motion-Enhancement Rule.** Hero text is fully visible before animation runs (`backwards` fill + no JS gate). `prefers-reduced-motion` disables mesh drift, glow spin, and reveal blur — static layout only.

## Components

### Buttons

- **Shape:** App primary — full pill (`border-radius: 9999px`), minimum height 44px.
- **Primary (app):** `--sui-blue` background, `#000000` text, `hover:opacity-90`. Label: "Protect my Bitcoin — $X" on purchase.
- **Glow CTA (landing):** Transparent fill, white Geologica label, 26px radius, rotating conic-gradient border (`sentinel-glow-border-spin`, 4s). Hover/focus: text shifts to `--sui-blue-bright`, outline border brightens. Label: **"Get a quote"** everywhere on landing (header, hero, mobile drawer). Arrow icon inline.
- **Secondary / Ghost:** Transparent fill, `--sui-line` border, white text, `hover:bg-white/5`.
- **Focus:** 2px `--sui-blue-bright` outline, 3px offset (app pills); glow CTA inherits hover color shift.
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
- **Shadow Strategy:** None on panels. Nav dropdowns only: layered drop shadow for float affordance.
- **Internal Padding:** 24px mobile, 32px desktop.
- **Nested cards:** Prohibited.

### Inputs / Fields

- **Style:** 12px radius, 1px `--sui-line` border, `rgba(0, 0, 0, 0.35)` fill.
- **Value typography:** Display font, 20px+, white.
- **Suffix label:** `--sui-steel`, 14px ("BTC").
- **Focus:** Same as buttons — blue-bright outline.

### Navigation

- **Header:** Fixed, `--sui-black` solid fill, **no bottom hairline**. Logo: 38px desktop / 34px mobile + Geologica brand name at 18–20px.
- **Desktop nav:** Walrus-style hover dropdowns — pill triggers (Geologica 16px), two-column panel (links + feature card), glass blur backdrop. CTA right-aligned: glow button.
- **Mobile nav:** Hamburger → full-screen `<dialog>` on black; glow CTA full-width at drawer bottom.
- **App tabs:** Segmented control — outer `rounded-xl` with hairline border, active segment `--sui-blue-darker` fill.
- **Implementation note:** Landing header/dropdowns/CTA are now authored with Tailwind utility classes in React components; app navigation remains on shared app styles.

### Landing Hero (signature component)

Full-viewport centered composition:

1. **Background stack** (all `aria-hidden`): base linear + radial navy layers → five animated mesh blobs (Sui blue ramp + faint lime accent blob) → vignette overlay.
2. **Copy block:** `HeroHeadline` (staggered `sentinel-rise` animation classes) → hero lead (`sentinel-rise`, delay 0.38s) → hero CTA row (`sentinel-rise`, delay 0.58s) with single `QuoteCtaButton`.
3. **Illustration slot** (optional): `.landing-hero-visual` below copy — aspect-ratio container with bottom fade mask. Asset convention: `apps/web/components/landing/*-3d-glass.svg` or `apps/web/public/illustrations/` for static SVG; animated compositions as React components alongside `btc-chart.tsx`.

Inner padding: `4.75rem` top/bottom to clear fixed header. Copy max-width: 56rem (64rem at lg).

### Quote Card (app signature component)

The insurance promise as a readable block: spot context in steel, trigger and payout in `--sui-blue-bright` at headline scale, premium as display-weight secondary line.

## Do's and Don'ts

### Do:

- **Do** lead the landing hero with insurance language — covered, trigger, paid automatically, one tap.
- **Do** use a single primary CTA on the hero — glow "Get a quote" only; no competing secondary button.
- **Do** keep mesh animation and text reveal as CSS enhancements with reduced-motion fallbacks.
- **Do** show plain disclosures when lower landing sections are enabled (parametric payout, oracle expiry window, not regulated insurance).
- **Do** use `--sui-blue` pill buttons on app conversion paths with 44px minimum touch targets.
- **Do** hide protocol implementation details in "For builders" expanders.

### Don't:

- **Don't** use cream, sand, or warm off-white page backgrounds — the surface is void black or deep navy bands.
- **Don't** promise a fixed "one hour" of coverage on marketing copy — expiry follows the oracle window.
- **Don't** frame the product as BTC-only on the landing hero — copy targets crypto assets broadly.
- **Don't** stack numbered section markers (`01 / 02 / 03`) or identical three-card grids across multiple sections.
- **Don't** use gradient text, side-stripe colored borders on cards, or decorative glassmorphism on panels.
- **Don't** extend mesh gradients beyond the landing hero background.
- **Don't** show `dUSDC`, strike ladders, or vol-surface jargon above the fold on consumer screens.
- **Don't** ship new surfaces in the legacy wireframe style (`.wrap`, `.box`, `#ccc` borders).
