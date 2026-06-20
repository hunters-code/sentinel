---
target: landing page
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-19T13-58-56Z
slug: apps-web-app-page-tsx
---
# Critique: Landing page (`apps/web/app/page.tsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static marketing page; marquee animates endlessly with no pause control |
| 2 | Match System / Real World | 3 | Insurance framing lands; protocol jargon (`predict::mint`, `get_trade_amounts`) leaks in value-prop copy |
| 3 | User Control and Freedom | 2 | Primary nav links hidden below `md` with no mobile menu alternative |
| 4 | Consistency and Standards | 2 | Three different primary CTA labels; Tailwind theme still references DM Sans while landing uses Geologica/Manrope |
| 5 | Error Prevention | 3 | n/a for a read-only landing surface |
| 6 | Recognition Rather Than Recall | 2 | Mobile users must scroll to discover "How it works"; chart is `aria-hidden` with no textual equivalent |
| 7 | Flexibility and Efficiency of Use | 2 | No skip link; no keyboard shortcut to app; standard scroll-only path |
| 8 | Aesthetic and Minimalist Design | 2 | Two numbered-section systems + three identical stack cards + marquee = competing scaffolding |
| 9 | Error Recovery | 3 | n/a |
| 10 | Help and Documentation | 3 | Disclosures and flow sections present; good alignment with PRODUCT.md honesty requirements |
| **Total** | | **25/40** | **Acceptable — significant improvements needed before this feels intentional, not generated** |

## Anti-Patterns Verdict

**LLM assessment:** Moderate-to-strong AI tells. The page avoids the cream SaaS default (good — committed Sui dark + blue is on-brand), but stacks multiple 2024–2026 landing scaffolds: large `01/02/03` step markers in "How it works," a second numbered `01/02/03` set in the stack cards, uppercase tracked micro-labels, a three-column identical card grid with tinted backgrounds, a scrolling tech buzzword marquee, and a blurred glass header. Together these read as "competent Web3 landing" rather than a distinctive insurance product with a POV. The custom BTC chart SVG is the strongest original element; everything around it feels template-assembled.

**Deterministic scan:** `detect.mjs` on `apps/web/app/page.tsx` and `apps/web/components/landing/` returned **0 findings** (clean exit). Manual review still flags numbered-section markers, uppercase tracked labels, and glassmorphism in the fixed header — patterns the detector did not catch on this pass.

**Visual overlays:** Browser automation unavailable in this session; no live-server injection or user-visible overlay. Assessment based on source review and contrast calculation.

## Overall Impression

The landing page communicates the Sentinel concept clearly and honors the product spec's honesty requirements (disclosures, example quote, insurance framing). The Sui ecosystem palette is a legitimate brand choice, not generic AI beige. The single biggest opportunity is **subtraction and voice**: strip the duplicate numbered scaffolding, unify CTAs, fix mobile navigation, and let the hero + example quote carry the story instead of a fifth "three things" section.

## What's Working

1. **Hero composition** — Asymmetric grid with animated headline, concrete subcopy, and the BTC chart visual create a focused first fold. Reduced-motion fallbacks in `HeroHeadline` and `BtcChartVisual` are correctly implemented.
2. **Example quote block** — The `$98,000 / $1,000 / ~$14` card mirrors PRODUCT.md's demo script and makes the abstract product tangible before the user hits `/app`.
3. **Plain disclosures section** — Required parametric/regulatory honesty is visible in-product, not buried — exactly what judges and skeptical users need.

## Priority Issues

### [P1] Mobile navigation is broken
- **Why it matters:** Below `md`, `#how`, `#stack`, and `#disclosures` links vanish (`hidden md:flex`). Mobile users only see "Launch app" — no way to learn before converting.
- **Fix:** Add a compact mobile menu (dialog/popover) or expose anchor links in a horizontal scroll strip. Keep touch targets ≥44px.
- **Suggested command:** `/impeccable adapt landing page mobile nav`

### [P1] Duplicate numbered-section scaffolding reads AI-generated
- **Why it matters:** "How it works" uses large `01/02/03` numbers; the stack section repeats `01/02/03` with uppercase tracked labels. This is the banned "numbered eyebrows on every section" pattern twice on one page — undermines trust for a financial product.
- **Fix:** Keep ONE ordered sequence (the three-screen flow is real and earns numbers). Restyle the stack section as a narrative paragraph, timeline, or asymmetric list without numbers/identical cards.
- **Suggested command:** `/impeccable distill landing page sections`

### [P2] Inconsistent primary CTA copy
- **Why it matters:** Hero says "Get a quote," mid-page says "Protect my Bitcoin," footer says "Open Sentinel." Same destination (`/app`), three mental models — Jordan persona hesitates.
- **Fix:** Pick one phrase aligned with PRODUCT.md ("Protect my Bitcoin — $X" on app; on landing use "Get a quote" or "Protect my Bitcoin" everywhere).
- **Suggested command:** `/impeccable clarify landing page CTAs`

### [P2] Marquee ignores reduced motion
- **Why it matters:** `animate-marquee` runs infinitely with no `@media (prefers-reduced-motion: reduce)` override in `marquee.tsx` (unlike hero/chart). Sam and motion-sensitive users get unstoppable scrolling.
- **Fix:** Pause or replace with static wrapped chips when `prefers-reduced-motion: reduce`.
- **Suggested command:** `/impeccable audit landing page marquee`

### [P2] Protocol jargon on a consumer-facing surface
- **Why it matters:** Value-prop section leads with `predict::mint` and `get_trade_amounts` — accurate for judges, alienating for the anxious BTC holder PRODUCT.md describes.
- **Fix:** Lead with insurance language; move protocol terms to a collapsible "For builders" detail or footnote.
- **Suggested command:** `/impeccable clarify value-prop section`

## Persona Red Flags

**Jordan (First-Timer):** On mobile, can't find "How it works" in the header. Reads `predict::mint` in the value-prop paragraph and doesn't know if this is a developer tool. Three different button labels for the same action create doubt about what happens after click.

**Riley (Stress Tester):** Chart badge says "BTC/USD · live" but the SVG is static/decorative — promises live data it doesn't deliver. Marquee claims ("Permissionless redeem," "SVI vol surface") have no links or proof. Footer "testnet only" is easy to miss above the final white CTA.

**Casey (Mobile):** Nav links unreachable without scrolling past hero. Primary actions sit mid-viewport after long headline — not thumb-zone optimized. Marquee text moves continuously, distracting during one-handed reading.

**Anxious BTC holder (PRODUCT.md):** Hero eyebrow leads with "DeepBook Predict on Sui" before the insurance promise — protocol name adds cognitive load at peak anxiety moment. Stack section's three protocol cards feel like homework before the example quote that actually reassures.

## Minor Observations

- Footer uses uppercase tracked labels ("Product", "Ecosystem") — same pattern as stack cards; contributes to template feel.
- `BtcChartVisual` is entirely `aria-hidden`; consider a visually hidden description of trigger/payout concept for screen readers.
- `--sui-steel-dark` (#6c7584) on `--sui-blue-darker` passes AA (~5.9:1) but is borderline for small footer text at `text-xs`.
- Tailwind `fontFamily.base/heading` still point to DM Sans while landing commits to Geologica/Manrope — design-system drift.
- Header glassmorphism (`backdrop-filter: blur`) is a minor absolute-ban adjacent pattern; acceptable if tightened, not default decoration.

## Questions to Consider

- What if the page ended after hero + example quote + disclosures — would anything essential be lost?
- What would "confident insurance" look like if it never said "Predict" above the fold?
- Could the stack section be one sentence in the hero subcopy instead of three cards?
