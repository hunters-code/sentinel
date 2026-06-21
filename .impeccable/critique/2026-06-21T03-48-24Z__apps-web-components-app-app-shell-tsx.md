---
target: appshell design
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-21T03-48-24Z
slug: apps-web-components-app-app-shell-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active tab + wallet dot are clear; no loading/sync state in chrome |
| 2 | Match System / Real World | 3 | Cover / History / Wallet map to insurance mental model |
| 3 | User Control and Freedom | 3 | Free tab switching, disconnect, receipt back link |
| 4 | Consistency and Standards | 2 | DESIGN.md specifies segmented sidebar + mint CTA; shell uses liquid bottom nav + blue connect |
| 5 | Error Prevention | 2 | Shell-level n/a; wallet connect errors live outside shell |
| 6 | Recognition Rather Than Recall | 2 | Inactive bottom-nav tabs are icon-only; labels hidden until active |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts or power-user accelerators |
| 8 | Aesthetic and Minimalist Design | 3 | Focused phone-frame layout; triple dark layers add visual noise |
| 9 | Error Recovery | 3 | Shell doesn't block recovery; content panels own errors |
| 10 | Help and Documentation | 2 | Empty state educates well; no persistent help in chrome |
| **Total** | | **25/40** | **Acceptable — significant polish needed** |

## Anti-Patterns Verdict

**LLM assessment:** Not immediate AI slop — the 600px centered column, Sui-native palette, and insurance-first empty state feel intentional. The modified liquid bottom nav (frosted glass, active-only labels, full-width capsule) is the main reflex tell: it reads as a 2025–2026 mobile-nav pattern grafted onto a product spec that calls for flat, tonal app surfaces. Triple-stacked dark backgrounds (outer radial black → shell black → content `#041e3a`) flatten hierarchy instead of the calm clarity the brand asks for.

**Deterministic scan:** Clean — `detect.mjs` returned 0 findings across `app-shell.tsx`, `app-top-bar.tsx`, `app-bottom-nav.tsx`, `app-empty-state.tsx`, and `app-page-client.tsx`.

**Browser visualization:** Not run — no browser automation available in this session. Assessment based on source review and detector CLI.

## Overall Impression

The shell is a competent mobile PWA frame: sticky top bar, scrollable main, thumb-zone bottom nav. It works structurally. The biggest gap is **brand alignment and recognition** — the chrome fights DESIGN.md (flat panels, mint actions, segmented tabs) and hides nav labels from first-time users. Unifying surface treatment and making navigation legible without interaction would move this from "acceptable prototype" to "calm expert tool."

## What's Working

1. **Phone-frame constraint (`max-w-[600px]`)** — Correct for a wallet-first PWA. Desktop users get a focused column; mobile users get full width. Padding aligns across top bar, content, and bottom nav (`px-4 md:px-6`).

2. **Empty-state onboarding inside the shell** — `AppEmptyState` uses insurance language, three chunked value props, and a single CTA. Low cognitive load for Jordan's first visit; doesn't dump users into an empty quote form.

3. **Active-only label animation in bottom nav** — Keeps the bar quiet while signaling current location. `aria-label` on inactive tabs and `aria-current` on active tab show accessibility awareness. `motion-reduce:transition-none` is present.

## Priority Issues

### [P1] Inactive nav tabs are icon-only — recognition fails for new users
- **Why it matters:** Jordan cannot tell "Cover" from "Wallet" without tapping. Shield/Clock/Wallet icons are generic; insurance framing ("Cover") doesn't read from the icon alone.
- **Fix:** Show persistent short labels under icons (stacked layout), or always show labels at this 3-item scale. Reserve collapse-to-icon-only for 5+ items.
- **Suggested command:** `/impeccable layout appshell bottom nav`

### [P1] Shell chrome drifts from DESIGN.md and product tokens
- **Why it matters:** DESIGN.md specifies segmented sidebar tabs on a hairline track and mint-green (`#47e299`) app CTAs. Shell uses liquid glass bottom nav; `SentinelConnectButton` renders `bg-action-primary` (`#4da2ff` under `.blue-dark`), not mint. Users see landing (black + glow CTA) vs app (blue connect + glass nav) as different products.
- **Fix:** Pick one nav vocabulary and one app CTA color. Either adopt segmented tabs per spec or update DESIGN.md to document bottom nav as canonical. Wire connect button to mint action token.
- **Suggested command:** `/impeccable polish appshell chrome tokens`

### [P2] Three stacked dark surfaces muddy hierarchy
- **Why it matters:** Outer canvas radial gradient on `#000`, inner column `bg-sui-black`, content `bg-sui-root` (`#041e3a`) — three near-black bands with no clear "this is the workspace" signal. Anxious users (Sentinel's core persona) get visual weight instead of calm focus.
- **Fix:** Collapse to two layers max: one canvas + one content surface. Drop redundant outer gradient or differentiate shell frame from content more clearly (e.g. white/light frame + navy content, or single unified navy fill).
- **Suggested command:** `/impeccable colorize appshell`

### [P2] Empty → connected transition jumps surface color
- **Why it matters:** Disconnected users see black shell + black empty state. After connect, content wrapper switches to `bg-sui-root` navy — a visible flash/repaint that breaks continuity and feels like a different app loaded.
- **Fix:** Apply content background at shell `main` level consistently, or keep empty state on the same surface token as connected panels.
- **Suggested command:** `/impeccable polish appshell main surface`

### [P2] Glass bottom nav conflicts with "flat by default" product rule
- **Why it matters:** DESIGN.md bans decorative glassmorphism on content panels. The nav's `backdrop-blur-2xl`, multi-layer shadow stack, and inset highlight read as ornamental on a product that should feel protocol-native and flat.
- **Fix:** Replace with flat segmented track (`bg-page-tab-bar`, hairline border) per DESIGN.md nav spec, or reduce to a single hairline + flat fill without blur.
- **Suggested command:** `/impeccable quieter appshell bottom nav`

## Persona Red Flags

**Jordan (First-Timer):** Bottom nav shows Shield / Clock / Wallet icons with no visible text on inactive tabs — must guess which is "get a quote." Connect button in top-right competes with empty-state "Connect wallet" CTA (two entry points, unclear which is primary on first load).

**Sam (Accessibility):** Inactive tab icons at `text-content-persistent-white/70` on `bg-white/[0.06]` glass may fall below 4.5:1 on some displays. Account dropdown uses `role="menu"` but no `aria-controls` / focus trap — keyboard users can tab behind the open menu.

**Casey (Mobile / Distracted):** Bottom nav placement and `min-h-[3.25rem]` targets are good. Sticky top connect + bottom nav + scrollable middle is workable one-handed. No persisted scroll position on tab switch — returning after interruption resets context.

**Anxious BTC Holder (project-specific):** Shell chrome offers three equal-weight destinations with no contextual headline ("Protect my Bitcoin") in the header. Dark-on-dark stacking feels like a trading terminal, not the calm expert tone in PRODUCT.md. No visible quote-status or connection state beyond a green dot on the address pill.

## Minor Observations

- `z-[1]` / `z-[2]` are magic numbers; no shared z-index scale in tokens.
- Top bar has no page title or tab context — History and Cover look identical in chrome.
- `AppShell` duplicates focus-visible rules that also exist on layout descendants — minor DRY drift.
- Receipt route content lacks `bg-sui-root` wrapper (unlike `app-page-client`), so background may differ per route.
- Logo links to `/app` but doesn't reset tab query — minor wayfinding inconsistency.

## Questions to Consider

- What if the shell had one surface color and let panels carry all depth — would it feel calmer?
- Does bottom nav need the liquid treatment, or would DESIGN.md's flat segmented track be faster to parse under stress?
- Should "Cover" be the only tab with visual priority until the user has their first policy?
