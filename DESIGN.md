---
name: Sentinel
description: Short-term parametric crash insurance — calm, honest quotes on a Sui-native dark surface; coverage window follows oracle expiry
colors:
  sui-blue: "#298dff"
  sui-blue-bright: "#5ca9ff"
  sui-blue-dark: "#1759c4"
  sui-blue-darker: "#002e6a"
  sui-root: "#041e3a"
  page-fill: "#0a3d72"
  sui-black: "#000000"
  sui-white: "#ffffff"
  sui-steel: "#89919f"
  sui-steel-dark: "#6c7584"
  action-primary: "#47e299"
  content-positive: "#7febb9"
  content-warning: "#ffc507"
  content-negative: "#ff6678"
  signal-orange: "#fa8543"
  card-fill: "#000000"
  card-border: "rgba(77, 162, 255, 0.3)"
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
  cta: "26px"
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
  button-glow-cta:
    backgroundColor: "{colors.sui-black}"
    textColor: "{colors.sui-white}"
    rounded: "{rounded.cta}"
    padding: "12px 28px"
    height: "{spacing.touch-min}"
  button-glow-cta-hover:
    textColor: "{colors.sui-blue-bright}"
  button-primary:
    backgroundColor: "{colors.action-primary}"
    textColor: "{colors.sui-black}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    height: "{spacing.touch-min}"
  button-primary-hover:
    backgroundColor: "{colors.action-primary}"
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
    textColor: "{colors.content-positive}"
    rounded: "{rounded.chip}"
    padding: "2px 10px"
  panel:
    backgroundColor: "{colors.card-fill}"
    textColor: "{colors.sui-white}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-sm}"
---

# Design System: Sentinel

## Overview

**Creative North Star: "The Honest Quote"**

Sentinel is a calm expert in a volatile room: void-black Sui-native surfaces, one blue accent for emphasis, numbers you can audit. The anxious holder arrives before a CPI print — they need one premium, one button, one receipt. Visual noise is the enemy. Insurance language leads; protocol plumbing hides behind expanders.

The system belongs on the same stack as [sui.io](https://www.sui.io/) — protocol-native dark mode, confident Geologica headlines, restrained motion. It explicitly rejects **prediction-market clone** aesthetics (Polymarket/Kalshi event tiles, YES/NO chips, crowd odds), cream SaaS defaults, numbered section eyebrows, and options-desk jargon above the fold.

**Key Characteristics:**

- Committed dark mode: `#000000` landing shell, `#041e3a` / `#0a3d72` app bands, Sui blue as the sole decorative accent
- Geologica display + Manrope body — geometric headline against humanist prose
- Two conversion controls: glow CTA on landing, mint-green pill in app (`#47e299`)
- Quote numbers in `--sui-blue-bright`; supporting copy in `--sui-steel`
- Flat app panels with blue-tinted borders; hero depth from animated mesh blobs + vignette only
- Status via labeled chips — positive mint for paid/live, steel for expired, orange for warnings

## Colors

A committed Sui-native palette: near-black ground, protocol blue for emphasis and atmosphere, mint green for app actions, steel neutrals for legibility.

### Primary

- **Sui Protocol Blue** (`#298dff`): Logo mark, active asset borders, brand accent. Not the default app CTA fill.
- **Bright Quote Blue** (`#5ca9ff`): Hero accent lines, trigger/payout highlights, focus rings, glow CTA hover text.
- **Mint Action Green** (`#47e299`): App primary buttons — "Protect my Bitcoin", connect wallet, in-flow purchases. Black text always (`#000000`).
- **Deep Oracle Navy** (`#002e6a`): Active tab segments, stack section bands, nav dropdown card gradients.

### Secondary

- **Settlement Mint** (`#7febb9`): Paid and live status chips — a payout landed or keeper is active. Text + border + label, never color alone.
- **Signal Orange** (`#fa8543` / `#ffc507` warning): Quote expiry, purchase errors. Never decorative.

### Neutral

- **Void Black** (`#000000`): Landing page shell, card fill, glow CTA inner fill.
- **Root Navy** (`#041e3a`): App body background token (`bg-sui-root`).
- **Page Fill** (`#0a3d72`): App content shell inside sidebar layout (`bg-page-fill`).
- **Paper White** (`#ffffff`): Headline text, input values, hero lead emphasis.
- **Steel Muted** (`#89919f`): Body copy, helper text, disclosures. Target ≥4.5:1 on black.
- **Steel Dim** (`#6c7584`): Tertiary metadata, offline states, footer fine print.
- **Hairline** (`rgba(255, 255, 255, 0.12)`): Segmented nav, mobile menu borders, neutral dividers.
- **Card Border** (`rgba(77, 162, 255, 0.3)`): Panel outlines on app surfaces — blue-tinted, not generic gray.

### Named Rules

**The One Accent Rule.** Sui blue carries brand emphasis, hero atmosphere, and quote highlights. Mint green carries in-app conversion. Settlement mint and orange appear only for status semantics — never as decorative section backgrounds.

**The Steel-on-Black Rule.** Body text uses `--sui-steel`, not washed-out gray. Hero lead uses white at ~84% opacity; strong emphasis bumps to full white.

**The Mesh-Hero-Only Rule.** Animated multi-blob mesh gradients live on the landing hero only. App shell and lower landing sections stay flat and tonal.

## Typography

**Display Font:** Geologica (system-ui fallback)
**Body Font:** Manrope (system-ui fallback)

**Character:** Geometric display gives headlines institutional weight without serif editorial affectation. Manrope keeps quote breakdowns and disclosures readable at 65–75ch. Calm under volatility — no shouty all-caps.

### Hierarchy

- **Display** (500, `clamp(2.75rem, 7vw, 5.5rem)`, 1.02): Landing hero only. `text-wrap: balance`. Accent the payoff line in `--sui-blue-bright`.
- **Headline** (500, `clamp(1.75rem, 5vw, 2.25rem)`, 1.08): App page titles, section h2s, quote payout amounts.
- **Title** (500, 18px, 1.3): Panel headings ("How much BTC do you hold?", nav dropdown link titles).
- **Body** (400, 16px, 1.5): Prose, disclosure bullets, quote detail. Use `text-pretty` on multi-sentence blocks.
- **Label** (500, 14px): Status chips, metadata rows, nav descriptions. Sentence case — never uppercase tracked eyebrows on every section.

### Named Rules

**The Insurance-First Rule.** Headlines say "you're covered" and "Get a quote." Protocol terms (`predict::mint`, `get_trade_amounts`) live in `<details>` expanders only.

**The Display Cap Rule.** Hero clamp max stays at 5.5rem (~88px). Letter-spacing floor −0.03em on display headings.

**The No-Fixed-Duration Rule.** Never promise a literal one hour or fixed minutes of coverage on consumer copy. The coverage window is the oracle expiry — name the expiry time on the quote and receipt, or say "until expiry."

Flat by default in the app. Depth is conveyed through tonal layering — `#0a3d72` content shell on `#041e3a` root, black card fill with blue-tinted borders, inset 1px accent highlight on panels — not drop shadows on cards or buttons.

The landing hero is the one exception: five animated radial mesh blobs (blue + faint lime) sit under a radial vignette so white headline copy stays readable. Nav dropdowns may use a functional float shadow (`0 24px 60px rgba(0,0,0,0.5)`) and light backdrop blur — navigation wayfinding only, not decorative glass cards.

### Shadow Vocabulary

- **Nav dropdown float** (`0 24px 60px rgba(0,0,0,0.5)`): Desktop mega-menu panel only.
- **Panel inset accent** (`inset 0 1px 0 rgba(77,162,255,0.14)`): Top edge highlight on active panels and selected asset tiles.

### Named Rules

**The Flat-By-Default Rule.** No drop shadows on cards, app buttons, or the landing header bar. Emphasis via color, size, or border.

**The Motion-Enhancement Rule.** Hero text is fully visible before animation runs. `prefers-reduced-motion` disables mesh drift, glow border spin, and reveal blur — crossfade or static fallbacks only.

## Components

Character: refined and restrained — tactile pills, bordered panels, no nested cards.

### Buttons

- **Shape:** Landing glow CTA uses 26px radius; app primary uses full pill (`9999px`). Minimum height 44px everywhere.
- **Glow CTA (landing):** Black inner fill, white text, conic blue border animation on hover ring. Hover lifts text to `--sui-blue-bright`. Label: "Get a quote".
- **Primary (app):** `--action-primary` (`#47e299`) background, black text, `hover:opacity-90`. Label: "Protect my Bitcoin — $X" on purchase.
- **Secondary / Ghost:** Transparent fill, hairline border, white text, `hover:bg-white/5`.
- **Focus:** 2px `--sui-blue-bright` outline, 2–3px offset on black surfaces.
- **Disabled:** `opacity: 40%`, `cursor: not-allowed`.

### Chips

- **Style:** Rounded-full, 1px border, `text-xs font-medium`, transparent fill.
- **Active:** `--sui-blue-bright` text, neutral hairline border.
- **Paid / Live:** `--content-positive` text, dark green tinted border (`#063d23`).
- **Expired / Offline:** `--content-secondary` or `--content-tertiary` text, hairline border.

### Cards / Containers

- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** `#000000` card fill with blue-tinted border.
- **Shadow Strategy:** Inset top accent only — no outer drop shadow.
- **Internal Padding:** 24px mobile, 32px desktop.
- **Nested cards:** Prohibited.

### Inputs / Fields

- **Style:** 12px radius, hairline or blue-tinted border, black fill.
- **Value typography:** Display font, 20px+, white on amount inputs.
- **Suffix label:** Steel muted, 14px ("BTC").
- **Focus:** Blue-bright outline matching buttons.

### Navigation

- **Header:** Fixed, solid `#000000`. Sentinel logo mark + Geologica wordmark. Desktop mega-menu dropdowns with blur-backed panel; mobile full-screen `<dialog>`.
- **App sidebar:** Segmented Cover / History / Wallet tabs — active segment `#002e6a` fill on hairline-bordered track.
- **Wallet connect:** Primary mint pill when disconnected; dapp-kit themed when connected.

### Quote Card (signature component)

The insurance promise as one readable block: spot context in steel, trigger and payout in `--sui-blue-bright` at headline scale, premium on a secondary line. Mirrors the PRODUCT.md demo ($98,000 trigger, $1,000 payout, ~$14 premium).

## Do's and Don'ts

### Do:

- **Do** lead every screen with insurance language — premium, coverage, trigger, payout, receipt.
- **Do** show plain disclosures in-product (parametric payout, oracle expiry window, PLP counterparty, 1% minimum premium, not regulated insurance).
- **Do** use the glow CTA on landing and mint-green pill in app — both 44px minimum touch targets.
- **Do** hide protocol implementation details in "How is this priced?" or "For builders" expanders.
- **Do** respect `prefers-reduced-motion`: disable mesh drift, glow spin, and staggered reveal blur.
- **Do** pair status color with text labels on chips — paid, live, expired, active.

### Don't:

- **Don't** use prediction-market clone visuals — no Polymarket/Kalshi event tiles, YES/NO chips, crowd odds, or meme-market energy.
- **Don't** use cream, sand, or warm off-white page backgrounds — the surface is void black or deep navy bands.
- **Don't** stack numbered section markers (`01 / 02 / 03`) or identical three-card grids across multiple sections.
- **Don't** use gradient text, side-stripe colored borders on cards, or decorative glassmorphism on content panels.
- **Don't** show `dUSDC`, strike ladders, or vol-surface jargon above the fold on consumer screens.
- **Don't** promise a fixed one hour or guaranteed duration of coverage — the window follows oracle expiry.
- **Don't** extend animated mesh gradients beyond the landing hero background.
- **Don't** ship new surfaces in legacy wireframe style (`.wrap`, `.box`, `#ccc` borders).
