# Design System Audit — Sentinel app (`apps/web/app/app`)

Scope: the authenticated app surface — routes under `app/app/*` and components
under `components/app/*` (incl. `components/app/ui/*`). Token sources reviewed:
`DESIGN.md`, `apps/web/app/globals.css`, `apps/web/tailwind.config.js`.

## Summary

**Components reviewed:** 4 primitives (`Panel`, `PrimaryButton`, `StatusChip`,
`Muted`) + ~20 app composites | **Issues found:** 10 | **Score: 62/100**

The visual language is coherent on screen, and most components correctly reach
for semantic classes (`text-content-secondary`, `bg-card-fill`). But the token
layer underneath has drifted into **three disagreeing sources of truth**, and a
**second, parallel color system** (static `sui-*` hexes) is sprinkled through the
same components that use the semantic one. The result is two hexes rendering for
the same conceptual color, and a `DESIGN.md` that no longer matches the code.

## Token Coverage

| Category | Defined where | Hardcoded / arbitrary values found | Notes |
|----------|---------------|-----------------------------------|-------|
| Colors | 3 places (DESIGN.md, globals.css vars, tailwind static) | `#063d23` (×2, chip border), `#fff` (×6, asset logo), `rgba(77,162,255,0.55)`, inline rgbas in shadows | Definitions disagree — see Naming below |
| Spacing | DESIGN.md only (`touch-min`, `panel-sm/md`, `section-y`) | Not wired into Tailwind at all | Tokens are aspirational; code uses `p-6 md:p-8`, `min-h-11` literals |
| Radius | DESIGN.md only (`pill/cta/panel/input/chip`) | No `borderRadius` in tailwind.config | `rounded-xl` (×9), `rounded-2xl` (×4), `rounded-3xl` (×2), `rounded-lg` (×1) all used for containers |
| Typography | DESIGN.md scale; only `font-display`/`font-body` wired | `clamp(...)` font sizes inline (×4), `text-[0.8125rem]` (×5), `text-[0.625rem]` | No `fontSize` scale tokens; display/headline/title/label sizes live as literals |
| Shadows | DESIGN.md "shadow vocabulary" | `shadow-[0_8px_24px_rgba(0,0,0,0.56)]`, `...0.35]`, inset variants written two ways | Not tokenized |
| Motion | tailwind keyframes/animation (good) | `animate-pulse` (Tailwind default) used alongside custom `animate-skeleton-pulse` | Two shimmer systems |

Only **colors, fonts, and `maxWidth.container`** are actually wired into Tailwind.
Spacing, radius, type-scale, and shadow tokens exist in `DESIGN.md` as prose but
have no machine-readable counterpart, so nothing enforces them.

## Naming Consistency — the core problem

Three files define colors, and for several tokens they **disagree**:

| Token | DESIGN.md / tailwind static | globals.css `.blue-dark` var | Effect |
|-------|------------------------------|------------------------------|--------|
| steel / muted body | `sui-steel = #89919f` | `--sui-steel = #c8d4e8` (`content-secondary`) | Body copy renders ~#c8d4e8, but DESIGN.md's "Steel-on-Black Rule" still says #89919f |
| bright blue | `sui-blue-bright = #5ca9ff` | `--sui-blue-bright = #4da2ff` (`bg-accent`) | The signature quote-number blue exists as **two hexes** |
| hairline | `sui-line = rgba(255,255,255,0.12)` | `--sui-line = …0.22` (`border-neutral`) | Divider weight depends on which class you pick |
| separator | static `…0.22` white | `--color-separator = rgba(77,162,255,0.42)` blue | Same name, different color *and* hue |

On top of that, components mix **two color systems**:

- Semantic (preferred, CSS-var backed): `content-*`, `bg-*`, `action-*`, `card-*`, `page-*` — ~90 usages.
- Static `sui-*` hexes — ~16 usages (`text-sui-blue-bright`, `text-sui-steel`, `bg-sui-black`, `border-sui-blue`).

Because `text-sui-blue-bright` (#5ca9ff) and `text-bg-accent` (#4da2ff) are both
used for **the same role** — trigger/payout/receipt highlights — the product's one
signature accent ships in two slightly different blues:

- `#5ca9ff` in `quote-live-line.tsx`, `receipt/[id]/page.tsx`
- `#4da2ff` in `app-hero-icon.tsx`, `app-feature-cards.tsx`, the `active` chip

| Issue | Components | Recommendation |
|-------|-----------|----------------|
| Same role, two blue tokens | quote-live-line, receipt, app-hero-icon, feature-cards, status-chip | Pick one accent token (recommend `bg-accent`/`#4da2ff`, the value in globals) and delete `sui-blue-bright`; update DESIGN.md |
| Success color split | `content-positive #7febb9` in chips vs `signal-lime #7df752` in `cover-panel`, `wallet-panel`, `receipt` | Use `content-positive` for all "paid/sent" success text; lime is hero-mesh-only per DESIGN.md |
| `text-bg-accent` / `outline-bg-accent` | status-chip, app-hero-icon, feature-cards | A *background* token used for text/outline reads wrong. Add a `content-accent` (or `accent`) alias for foreground use |
| `bg-bg-primary`, `bg-bg-accent` stutter | app-content-card, others | Rename the `bg` color group (e.g. `surface-*`) so classes read `bg-surface-primary` |
| `sui-steel` vs `content-secondary` | muted vs ~24 other usages | Standardize on `content-secondary`; remove `sui-steel` or realias it to the same value |

## Component Completeness

| Component | States | Variants | Docs | A11y | Score |
|-----------|--------|----------|------|------|-------|
| PrimaryButton | hover ✅ / disabled ✅ / **loading ❌** | single (no secondary/ghost) ⚠️ | ❌ | min-h-11 ✅, no focus-visible style ⚠️ | 6/10 |
| StatusChip | static only | active/paid/expired/neutral/live/offline ✅ but `paid`==`live` visually, **no `warning`** ⚠️ | ❌ | color+text label ✅, no `role`/aria ⚠️ | 6/10 |
| Panel | n/a | single ✅ | ❌ | n/a | 8/10 |
| Muted | n/a | single ✅ | ❌ | n/a | 8/10 |
| Inputs (amount field) | no shared primitive — inline per screen ❌ | — | ❌ | focus style varies | 4/10 |

Notes:

- **No shared input/field primitive.** DESIGN.md specifies inputs (12px radius,
  display-font value ≥20px, steel suffix, blue focus), but each screen builds its
  own — the highest-drift surface.
- **Secondary/ghost button** is described in DESIGN.md but not componentized; it's
  re-implemented inline (`cover-panel.tsx:153` rolls its own pill button).
- **Focus is inconsistent:** some controls use `outline-2 outline-bg-accent`,
  others rely on default `ring`. The focus color (#4da2ff) doesn't match the
  DESIGN.md spec (#5ca9ff blue-bright) — another symptom of the split-blue issue.
- **StatusChip `paid` and `live`** are byte-identical (`text-content-positive
  border-[#063d23]`); the `#063d23` green border is hardcoded twice and never
  tokenized. There's no `warning` tone, so orange status is handled ad hoc with
  raw `text-signal-orange`.

## Priority Actions

1. **Collapse to one token source.** Generate `tailwind.config.js` colors from the
   same values as `globals.css` (or vice-versa) and make `DESIGN.md` frontmatter
   the documented mirror. Today's steel/blue-bright/hairline disagreements all
   stem from hand-maintaining three lists. This is the highest-leverage fix.

2. **Unify the accent blue and retire the parallel `sui-*` aliases.** Choose one
   bright-blue token for trigger/payout/focus, replace `text-sui-blue-bright`
   usages, and add a foreground-named alias so `text-bg-accent` disappears.
   Re-point focus rings to that single token.

3. **Wire radius, spacing, and type-scale tokens into Tailwind** (`borderRadius`,
   `spacing`, `fontSize` extends) matching DESIGN.md, then replace inline
   `rounded-xl/3xl`, `clamp(...)`, and `text-[0.8125rem]` literals. Add a shared
   `Input`/`Field` and `SecondaryButton` primitive, and a `loading` state +
   `warning` chip tone, so the spec stops being re-implemented per screen.

---
*Generated by `/design-system audit`. Scoring is heuristic: token coverage 40,
naming consistency 35, component completeness 25.*
