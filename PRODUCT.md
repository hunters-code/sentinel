# Sentinel — One-Hour Crash Insurance for BTC

Product specification, v1.0 (hackathon scope)

Track: DeepBook Predict (Sui Overflow)

## 1. One-liner

> Insure your BTC for the next hour. Premium: $1.40. Settled on-chain in under 60 minutes.

Sentinel is a single-purpose consumer app. The user tells us how much BTC they hold, we quote one premium, they press one button, and they get one receipt. If BTC crashes through the trigger price before the hour is up, they get paid automatically. Under the hood it is exactly one well-priced `predict::mint` of a deep out-of-the-money DOWN binary on DeepBook Predict, plus honest premium math derived from the live SVI volatility surface.

## 2. Why this product

- **Reframing, not invention.** A deep-OTM downside binary *is* parametric crash insurance. Nobody outside of options desks thinks of it that way. We sell the insurance framing: premium, coverage, trigger, payout, receipt.
- **A primitive only Predict makes possible.** This needs (a) any strike priced against a live vol surface, not hand-listed events, (b) sub-hour rolling expiries, and (c) a vault (PLP) that always takes the other side. Polymarket/Kalshi can do none of the three.
- **Demo-friendly.** The full user story — buy a policy, watch the hour, get paid (or not) — completes inside a single demo slot.

## 3. Target user

Someone who holds BTC, is not an options trader, and feels event risk (FOMC minutes, CPI print, a cascading liquidation on a Friday night). They will never open a strike ladder. They will press a button that says "Protect my Bitcoin for the next hour — $1.40".

## 4. Product definition

### 4.1 The policy

A Sentinel policy is a fixed-payout (parametric) insurance contract:

| Term | Definition |
|---|---|
| Underlying | BTC/USD, as settled by the Predict BTC oracle |
| Coverage window | From purchase until the expiry of the selected sub-hour oracle (≈ 30–60 min) |
| Trigger | A strike price `K` below current spot (default: 2% below, snapped to the oracle strike grid) |
| Payout | Fixed amount `P` in dUSDC, paid if BTC settles **at or below** `K` at expiry |
| Premium | The on-chain ask cost of minting `P` contracts of the DOWN binary at strike `K` |

This is parametric insurance, and the UI must say so plainly: the payout is all-or-nothing at settlement. BTC at `K − $1` at expiry pays the full amount; BTC at `K + $1` pays zero; a crash that fully recovers before the settlement print pays zero.

### 4.2 Coverage sizing — the one input

The user enters their BTC holdings `B`. We size the payout to cover the mark-to-market loss down to the trigger:

```
P = B × (S − K)
```

where `S` is current spot and `K` the trigger strike. If BTC crashes exactly to the trigger, the payout equals the user's paper loss. Deeper crashes are under-covered relative to the loss — this is disclosed, not hidden (see §7). Predict contracts are $1-payout units in dUSDC (6 decimals, `1_000_000 = 1 contract = $1`), so the minted quantity is simply `P` expressed in dUSDC units.

Example at spot $100,000, trigger 2% below ($98,000 snapped to grid):

| BTC held | Coverage (payout) | Fair down-price (SVI) | Premium shown |
|---|---|---|---|
| 0.05 BTC | $100 | ~1.0¢ | ~$1.40 |
| 0.5 BTC | $1,000 | ~1.0¢ | ~$14 |
| 2 BTC | $4,000 | ~1.0¢ | ~$56 |

(The ~1.4¢ effective rate = fair price + spread, floored as described in §4.4.)

### 4.3 Strike and expiry selection (automatic)

The user never sees a strike ladder. The app selects:

- **Oracle/expiry:** the active BTC `OracleSVI` with the nearest expiry that is **≥ 15 minutes away** (so the policy has meaningful coverage and the quote isn't settling under us). If the front oracle expires sooner, roll to the next one. Oracles come from `GET /predicts/:predict_id/oracles`.
- **Strike:** `K = floor_to_tick(S × 0.98)` on that oracle's strike grid (`min_strike + n × tick_size`). One default trigger in v1; a "more coverage / cheaper" 3-option selector (−1.5% / −2% / −3%) is a stretch goal, not MVP.

Guard: if the post-spread ask for the DOWN binary at `K` would exceed 10¢ per contract (i.e. the market is panicking and this is no longer "deep OTM"), the app widens the trigger one tick at a time until ask ≤ 10¢, and shows the adjusted trigger. We never silently sell expensive insurance as cheap insurance.

### 4.4 Honest premium math

The premium is **not** invented by us. It is the protocol's own ask, previewed via `predict::get_trade_amounts` (devInspect) before purchase, and the on-chain value at mint time is authoritative. The app decomposes it for the user:

```
ask = fair_price(SVI) + spread
premium = ask × quantity
```

- `fair_price` is the SVI-implied probability that BTC settles below `K`, evaluated from the latest `OracleSVIUpdated` params (also served at `GET /oracles/:oracle_id/svi/latest`).
- `spread = max(min_spread, base_spread × √(p(1−p)) × utilization_term)` — defaults: base 2%, floor 0.5%, widening with vault utilization.
- **Protocol floor:** Predict rejects mints with ask below `min_ask_price = 1¢` per contract (`default_min_ask_price = 10_000_000` at 1e9 scaling). Deep-OTM binaries therefore cost **at least 1% of coverage per policy**, even when the SVI fair value is lower. The premium breakdown screen shows this floor explicitly when it binds: "Fair value: 0.3¢ · Minimum the protocol will sell at: 1¢."

The receipt shows: fair value, spread, effective rate (premium ÷ coverage), and annualized-equivalent cost, so a skeptical user (or judge) can audit the number. This is the "honest premium math from the SVI surface" pillar — we show our work instead of quoting a black-box number.

### 4.5 Slippage protection

`predict::mint` quotes against post-trade vault state, so the executed ask can differ from the preview. The purchase PTB re-checks: if executed cost would exceed the displayed premium by more than 5%, the client aborts before signing (preview re-run immediately pre-sign). The quoted premium on screen carries a 15-second freshness timer and auto-refreshes.

## 5. User experience

### 5.1 Screens (there are three)

**Screen 1 — Quote (the entire homepage)**

- One input: "How much BTC do you hold?" (numeric, with a balance-detect helper if a wallet is connected)
- Live line: "If BTC drops below **$98,000** before **14:30 UTC**, you get **$1,000**."
- One button: **Protect my Bitcoin — $14.20**
- A small "How is this priced?" expander → the premium breakdown of §4.4.

**Screen 2 — Receipt**

Shown immediately after the mint transaction confirms:

- Policy ID (the mint tx digest), coverage, trigger, expiry countdown, premium paid
- A live BTC price line with the trigger drawn on it (data: `GET /oracles/:oracle_id/prices` + event stream)
- Status chip: `ACTIVE` → `EXPIRED — NO CLAIM` or `PAID — $1,000`
- "Share receipt" (image export — the viral artifact)

**Screen 3 — History**

List of past policies for the connected wallet (from `GET /managers/:manager_id/positions/summary` and `GET /positions/minted?` filtered by manager). Each row: date, coverage, premium, outcome.

### 5.2 First-use flow (hidden plumbing)

1. Connect Sui wallet (`@mysten/dapp-kit`).
2. If the wallet has no `PredictManager`, the purchase PTB prepends `predict::create_manager`.
3. If the manager's dUSDC balance < premium, the PTB prepends `predict_manager::deposit` from the wallet's dUSDC coins. On testnet, the app surfaces the DUSDC request form link when the wallet holds none.
4. Mint. One signature total — manager creation, deposit, and mint are composed in a single PTB.

### 5.3 Payout flow (zero user action)

A keeper service watches `OracleSettled` events. For every Sentinel policy whose oracle settled at or below the trigger, the keeper calls `predict::redeem_permissionless<DUSDC>` — payout lands in the user's `PredictManager`, then the app shows a one-tap "Withdraw $1,000 to wallet" on the receipt screen (manager withdrawals are owner-only, so the final hop needs the user's signature). Policies that expire out-of-the-money flip to `EXPIRED — NO CLAIM` with no transaction needed.

Optional (stretch): "Cancel policy" before expiry via `predict::redeem`, returning the current bid value as a partial refund.

## 6. Protocol integration

### 6.1 Targets (Sui testnet, branch `predict-testnet-4-16`)

| Thing | Value |
|---|---|
| Predict package | `0xf5ea2b3749c65d6e56507cc35388719aadb28f9cab873696a2f8687f5c785138` |
| Predict object | `0xc8736204d12f0a7277c86388a68bf8a194b0a14c5538ad13f22cbd8e2a38028a` |
| Quote asset | `e95040085976bfd54a1a07225cd46c8a2b4e8e2b6732f140a0fc49850ba73e1a::dusdc::DUSDC` |
| Indexer | `https://predict-server.testnet.mystenlabs.com` |

### 6.2 On-chain calls used

| Call | When |
|---|---|
| `predict::create_manager` | First purchase only |
| `predict_manager::deposit<DUSDC>` | When manager balance < premium |
| `market_key::down(oracle_id, expiry, strike)` | Build the position key |
| `predict::get_trade_amounts` (devInspect) | Premium preview + pre-sign re-check |
| `predict::mint<DUSDC>` | The purchase |
| `predict::redeem_permissionless<DUSDC>` | Keeper claims settled payouts |
| `predict::redeem<DUSDC>` | Stretch: early cancel |
| `predict_manager::withdraw<DUSDC>` | User sweeps payout to wallet |

### 6.3 Read paths

Per the protocol's recommended split:

- **predict-server** for everything renderable: oracle list and state, SVI latest, price history, manager positions, mint/redeem history.
- **Sui event stream** (`OraclePricesUpdated`, `OracleSVIUpdated`, `OracleSettled`) for the live price line and instant settlement flip on the receipt screen.
- **Direct object reads** for the `PredictManager` balance and `OracleSVI` immediately before building the purchase PTB.

### 6.4 Architecture

```
┌────────────────────────┐
│  Next.js PWA           │  quote · receipt · history
│  @mysten/dapp-kit      │  wallet, PTB signing
│  @mysten/codegen       │  typed Predict bindings
└──────┬─────────┬───────┘
       │         │
       │         └────────────► predict-server (REST)   render data
       │
       ▼
   Sui testnet  ◄──────────────  Keeper (Node service)
   predict::mint                 watches OracleSettled,
   predict::redeem_permissionless fires payout claims
```

The keeper is a single small Node process: subscribe to `OracleSettled` for the Predict package, look up open Sentinel positions on that oracle from `/positions/minted` minus `/positions/redeemed`, submit `redeem_permissionless` in one PTB per manager. Stateless; safe to restart.

## 7. Disclosures (shown in-product, not buried)

1. **Parametric, not indemnity.** Payout is fixed and all-or-nothing at the settlement print. A crash deeper than the trigger pays the same fixed amount; a crash that recovers before expiry settlement pays nothing.
2. **Coverage window is the oracle expiry,** not a literal 60 minutes from purchase. The exact expiry time is on the quote and the receipt.
3. **Counterparty is the PLP vault.** Payouts depend on vault solvency; the protocol caps total exposure at 80% of vault capital, and a mint can be rejected when the vault is at capacity.
4. **Minimum premium is 1% of coverage** due to the protocol ask floor, even when fair value is lower.
5. **Not regulated insurance.** It is an on-chain options position presented with insurance framing.

## 8. Failure modes and handling

| Condition | Behavior |
|---|---|
| Oracle stale (> 30s without price update) | Quote disabled, "Pricing temporarily unavailable" |
| Trading paused (`ETradingPaused`) | Same as above, with reason |
| Ask out of bounds (`EAskPriceOutOfBounds`) | Re-quote; if floor-clamped, show floor disclosure |
| Vault exposure cap hit | "Coverage sold out for this hour — next window at HH:MM" |
| Executed cost > preview + 5% | Abort before signing, re-quote |
| Nearest expiry < 15 min | Quote against the next oracle |
| predict-server lag after tx | Receipt renders from tx effects + direct object read first, server data backfills |
| Keeper down | Receipt screen offers manual "Claim payout" button calling `redeem` from the owner wallet |

## 9. Scope

### MVP (must work end-to-end for judging)

- BTC only, dUSDC only, one default trigger (−2%), nearest valid expiry
- Quote screen with live premium and honest breakdown
- Single-signature purchase PTB (create manager + deposit + mint)
- Receipt screen with live price line and settlement status
- Keeper auto-claim via `redeem_permissionless`
- Withdraw-to-wallet

### Stretch (in priority order)

1. Trigger selector (−1.5% / −2% / −3%) with live premium per option
2. Early cancel with partial refund
3. Shareable receipt image
4. Auto-renew ("keep me covered hour after hour") — recurring mint at each new expiry
5. Range-based deductible variant (`mint_range` bear band) for proportional payouts

### Explicitly out of scope

- Multiple underlyings, fiat on-ramp, real BTC custody (we insure the price exposure, we never touch the user's BTC), LP/vault features, mainnet deployment hardening.

## 10. Success criteria

- **Hackathon minimum bar:** integrates the testnet Predict contract; full flow (quote → mint → settle → payout) testable end-to-end by judges.
- **Demo script (≤ 3 min):** enter 0.5 BTC → see $14 premium with the math expander open → one signature → receipt with live trigger line → fast-forward to a settled oracle from a pre-purchased policy → payout already claimed by the keeper → withdraw to wallet.
- **Quality bar:** quoted premium within 5% of executed cost in ≥ 95% of purchases; keeper claims within 60s of `OracleSettled`; zero stranded settled positions over the demo period.
