---
target: hero section
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-20T11-09-10Z
slug: apps-web-components-landing-landing-hero-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static hero is fine; no live price or quote freshness signal above the fold |
| 2 | Match System / Real World | 2 | "you cash in" and "trigger" read like trading jargon, not crash insurance for anxious holders |
| 3 | User Control and Freedom | 3 | Skip link and scroll work; removing "How it works" leaves no in-hero learn path |
| 4 | Consistency and Standards | 2 | Header CTA is "Launch App", hero CTA is "Get a quote" — same destination, different verbs |
| 5 | Error Prevention | 3 | n/a for a static marketing block |
| 6 | Recognition Rather Than Recall | 3 | One clear primary action; jargon still forces translation |
| 7 | Flexibility and Efficiency | 2 | Single path only; no secondary scan for skeptics |
| 8 | Aesthetic and Minimalist Design | 2 | Four gradient layers + stars + chart glow + vignette — visually rich but noisy for the "honest quote" brand |
| 9 | Error Recovery | 3 | n/a |
| 10 | Help and Documentation | 2 | No parametric disclosure or "one hour" window visible in hero |
| **Total** | | **25/40** | **Acceptable — significant copy and hierarchy improvements needed** |

## Anti-Patterns Verdict

**LLM assessment:** Moderate AI/Web3 landing tells. The Walrus-inspired centered stack (black→blue gradient, star field, bottom illustration, glow pill CTA) is executed competently but reads as a **category template** rather than a distinctive insurance POV. The custom BTC chart is the strongest original element; the headline voice undercuts the PRODUCT.md promise of reassurance for anxious holders.

**Deterministic scan:** Clean — `detect.mjs` returned zero findings across `landing-hero.tsx`, `hero-headline.tsx`, and `page.tsx`.

**Browser visualization:** Not run — no local dev server was active. Assessment based on source review and design system alignment.

## Overall Impression

The hero looks polished and on-palette, but it sells the wrong emotional story. Visually it says "dramatic Web3 landing"; verbally it says "profit when BTC crashes." Sentinel's north star is **honest crash insurance in one tap** — the layout is close, the copy and tonal restraint are not.

## What's Working

1. **Product-native illustration** — The BTC chart with trigger line is concrete and on-brand; it beats a generic 3D mascot or stock shield icon.
2. **SSR-safe motion** — `.hero-line` animates from a visible CSS baseline; headline never risks blank on slow JS.
3. **Focused conversion** — One glow CTA, no competing secondary button; low decision friction for the primary path.

## Priority Issues

### [P1] Headline frames a crash as a win, not protection
- **Why it matters:** PRODUCT.md targets anxious BTC holders before CPI/FOMC — "you cash in" sounds opportunistic/gambling, not "I'm covered."
- **Fix:** Reframe to insurance language — e.g. "When the market drops, **you're covered.**" or "Protect your BTC for the next hour."
- **Suggested command:** `/impeccable clarify`

### [P1] CTA labels disagree across the header and hero
- **Why it matters:** "Launch App" vs "Get a quote" breaks consistency (Heuristic 4) and confuses whether the user is entering a tool or buying coverage.
- **Fix:** Pick one verb pair site-wide — e.g. hero + header both "Get a quote" or both "Launch app."
- **Suggested command:** `/impeccable polish`

### [P2] Lead copy is too wide and still uses insider terms
- **Why it matters:** At 52–58rem max-width, lines exceed ~75ch; "trigger" and "premium" need no translation for options traders, not normal holders.
- **Fix:** Narrow lead to ~42rem; swap "trigger" → "your −2% floor" or "crash price"; add "for the next hour" per PRODUCT one-liner.
- **Suggested command:** `/impeccable clarify`

### [P2] Gradient stack competes with the message
- **Why it matters:** Base + glow + shapes + stars + vignette + chart glow creates a **visual noise floor** — the anxious user should see headline → reassurance → CTA, not atmosphere.
- **Fix:** Collapse to 2 layers (vertical base + one bottom arc); drop star field or corner blobs; reduce bottom glow opacity ~30%.
- **Suggested command:** `/impeccable quieter`

### [P2] Chart placement fights short viewports
- **Why it matters:** `translateY(10–14%)` + `100svh` pushes the chart below the fold on mobile; Casey may never see the product metaphor without scrolling.
- **Fix:** Reduce translate on mobile; shrink chart max-height; or move a simplified trigger/payout chip above the CTA.
- **Suggested command:** `/impeccable adapt`

## Persona Red Flags

**Jordan (First-Timer):** "What is a trigger?" and "What does premium cost?" are unanswered in the hero. No visible parametric honesty ("all-or-nothing payout") — will bounce to scroll for reassurance.

**Casey (Mobile):** Hero fills full viewport; primary CTA sits mid-screen (acceptable) but chart illustration is largely off-screen. Glow button is tappable; no mobile header CTA for quick jump to `/app`.

**Morgan (Anxious BTC holder — project-specific):** Headline celebrates dropping markets; no mention of one-hour window, example premium ($1.40), or "not regulated insurance" disclosure that PRODUCT.md requires in-product. Feels like a trade, not a parachute.

## Minor Observations

- Headline clamp maxes at 6rem — at the design-system ceiling; fine on desktop, watch tablet overflow on long words.
- Chart SVG uses `aria-hidden` on the graphic while figcaption is sr-only — acceptable pattern, but visible "trigger" label in chart is still jargon for sighted users.
- Faint lime blob in `.landing-hero-bg-shapes` is decorative noise with no product meaning.

## Questions to Consider

- What if the hero led with **protection** language and moved "cash in" to the receipt/payout story lower on the page?
- Does the chart need to be **below** the CTA, or would a single trigger/payout line above the button communicate faster?
- What would a **quieter** gradient look like if the headline did all the emotional work?
