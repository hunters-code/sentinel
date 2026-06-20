---
target: landing page
total_score: 26
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-06-20T16-57-10Z
slug: apps-web-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll-spy nav active states work; static page needs little else |
| 2 | Match System / Real World | 2 | Stack section leaks Predict/dUSDC/SVI builder jargon on a consumer landing |
| 3 | User Control and Freedom | 3 | Mobile dialog dismiss, anchor nav, keyboard Escape on dropdowns |
| 4 | Consistency and Standards | 2 | Glow CTA in hero/header vs plain blue pill in bottom CTA section |
| 5 | Error Prevention | 3 | Footer and bottom CTA disclose parametric + unregulated; hero avoids fixed-hour promise |
| 6 | Recognition Rather Than Recall | 3 | Text-labeled nav and CTAs; step list uses titles not numbers |
| 7 | Flexibility and Efficiency | 2 | Appropriate for landing; mega-menu adds optional paths novices won't use |
| 8 | Aesthetic and Minimalist Design | 3 | Hero is focused; lower sections accumulate protocol detail |
| 9 | Error Recovery | 3 | n/a — marketing surface |
| 10 | Help and Documentation | 2 | Key disclosures in footer; no pricing honesty expander above the fold |
| **Total** | | **26/40** | **Acceptable — significant landing polish needed before it matches PRODUCT.md intent** |

## Anti-Patterns Verdict

**LLM assessment:** Borderline — not an instant AI slop fail. The hero earns personality (insurance headline, glow CTA, glass coins, mesh atmosphere). The page loses that voice below the fold: three identical bordered step cards, a 2×2 builder spec grid, and a second CTA style read as generic Web3 landing scaffold. Does not read as Polymarket/Kalshi clone; reads as Sui-native dark landing with a consumer/builder identity split.

**Deterministic scan:** `detect.mjs` on `apps/web/app/page.tsx` + `apps/web/components/landing` — **0 findings** (clean).

**Visual overlays:** Browser visualization not run — no dev server detected and browser automation unavailable in this session. No reliable user-visible overlay.

## Overall Impression

The hero is the product: calm, insured, one CTA. Everything after `#how` starts explaining the protocol to builders. The single biggest opportunity is to make the full scroll path feel like the hero — insurance language, honest limits, one conversion control — and push stack detail behind an expander or `/docs`-style footer link.

## What's Working

1. **Hero hierarchy and copy.** "When the market drops / you're covered." plus trigger/payout language in plain insurance terms. One glow CTA, strong vignette over mesh, coins as atmosphere not data viz.

2. **Motion-sensitive implementation.** `prefers-reduced-motion` disables mesh drift, glow spin, stagger blur, and coin float loops. Matches PRODUCT.md accessibility intent.

3. **Honest limits where they appear.** Footer and bottom CTA state parametric payout and non-regulated status. How-section step 2 names "honest premium math" — aligned with brand personality.

## Priority Issues

### [P1] Split identity: consumer hero, builder landing below the fold

- **What:** `#stack` exposes Predict package, dUSDC, SVI/oracle mechanics, keeper redeem path in a spec grid. `#how` mentions "manager" without explanation.
- **Why it matters:** PRODUCT.md Register is `product`; landing serves acquisition. Anxious holders hit protocol vocabulary and lose the insurance frame you established in 5 seconds.
- **Fix:** Reframe stack as "What you're buying" (coverage, trigger, expiry, payout) in insurance terms. Move package IDs and keeper mechanics to a collapsed "For builders" block or footer link.
- **Suggested command:** `/impeccable clarify landing page`

### [P1] Inconsistent primary CTA across the page

- **What:** Header and hero use `QuoteCtaButton` (glow, conic border). `LandingCtaSection` uses a flat `bg-sui-blue-bright` pill — violates DESIGN.md's landing conversion rule.
- **Why it matters:** Users learn one button language at the hero, then see a different affordance at the decision point after scrolling. Breaks consistency heuristic and weakens brand recognition.
- **Fix:** Replace bottom CTA with `QuoteCtaButton` or document and commit to a single landing primary pattern.
- **Suggested command:** `/impeccable polish landing page`

### [P1] Product scope drift: crypto-wide marketing vs BTC MVP

- **What:** Hero lead says "Cover your crypto"; coin illustration shows BTC, Sui, USDC. PRODUCT.md MVP is BTC + dUSDC only. Site metadata mentions ETH/SUI.
- **Why it matters:** Jordan expects multi-asset coverage; app may only quote BTC. Creates trust gap at first tap.
- **Fix:** Align hero, metadata, and illustrations with MVP scope, or label multi-asset as "coming soon" explicitly.
- **Suggested command:** `/impeccable clarify landing page`

### [P2] Three identical bordered step cards

- **What:** `#how` right column is three same-shaped panels (border, tint, padding, h3 + body).
- **Why it matters:** Mild identical-card-grid AI tell; DESIGN.md anti-pattern watch. Still readable because copy differs and there's no 01/02/03 eyebrow.
- **Fix:** Differentiate structure — numbered flow with connecting line, or one featured step + two inline bullets, or a single prose block with bold lead-ins.
- **Suggested command:** `/impeccable layout landing-how-section`

### [P2] Decorative motion budget exceeds "motion-sensitive" bar

- **What:** Hero runs mesh blob drift (5 layers), sentinel-rise stagger, glow border spin, plus framer-motion coin float — all on first paint.
- **Why it matters:** PRODUCT.md asks for minimal animation beyond status feedback. Hero atmosphere is optional but heavy for motion-sensitive users who don't enable OS reduced motion.
- **Fix:** Reduce to mesh OR coin motion, not both; shorten stagger; consider `motion-safe:` gating on coin float by default.
- **Suggested command:** `/impeccable quieter landing hero`

## Persona Red Flags

**Jordan (First-Timer):** "Payout is claimed to your manager automatically" — no idea what a manager is. Stack grid labels "Predict package" and "Quote asset: dUSDC only" before ever seeing a quote. Will hesitate at "Get a quote" unsure if they need dUSDC first.

**Casey (Mobile):** Bottom CTA sits after two full sections of reading; thumb must scroll past builder grid. Header CTA on mobile only inside hamburger — acceptable but hero CTA is the only above-fold conversion on small screens if user doesn't open menu.

**Riley (Stress Tester):** Dormant `Marquee` component copy includes "Covers the next hour" — contradicts footer oracle-expiry disclosure if re-enabled. Metadata promises ETH/SUI coverage app may not deliver.

**Morgan (Anxious BTC Holder — PRODUCT.md):** Arrives needing one answer in seconds. Hero delivers. Scrolling to `#stack` reintroduces event-risk anxiety via protocol transparency before conversion — emotional valley before bottom CTA.

## Minor Observations

- Page wrapper uses `bg-sui-root` while hero is pure black — slight banding when scrolling past hero.
- Stack section eyebrow "Built on Sui testnet infrastructure" is acceptable single kicker; watch against multiplying eyebrows in future sections.
- Nav mega-menu uses backdrop blur — DESIGN.md allows functional dropdown float only; acceptable here.
- `Marquee` is unused in `page.tsx` — dead copy risk if wired back without audit.

## Cognitive Load

**3 checklist failures** (moderate): progressive disclosure fails on stack section; working-memory gap between insurance hero and builder grid; nav dropdowns expose 6+ links per menu for optional exploration.

## Questions to Consider

- What if `#stack` were one sentence — "Settled on Sui, priced from live markets" — with details behind a link?
- Does the landing need a second CTA section at all if the hero and header already convert?
- What would a landing page look like if it stopped after `#how` and trusted the hero CTA?
