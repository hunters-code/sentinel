# CLAUDE.md

Guidance for Claude Code (and other AI agents) working in this repository.

## Project overview

**Sentinel** — one-hour parametric crash insurance for BTC, built on DeepBook
Predict (Sui). The user enters how much BTC they hold, gets one premium quote,
signs one transaction, and receives a receipt. If BTC settles at or below the
trigger price before the selected sub-hour oracle expiry, they are paid
automatically by a keeper.

Under the hood, a policy is exactly one well-priced `predict::mint` of a deep
out-of-the-money DOWN binary, with premium math derived from the live SVI
volatility surface.

- Full product spec: `PRODUCT.md` (English) and `PRODUCT.id.md` (Indonesian).
  These are the source of truth — read them before non-trivial changes.

## Current state

The repository currently contains only the product specification. There is no
application code yet. The intended architecture (from the spec) is below;
implement against it rather than inventing new structure.

## Intended architecture

```
Next.js PWA  (quote · receipt · history)
  @mysten/dapp-kit   wallet + PTB signing
  @mysten/codegen    typed Predict bindings
        |                |
        |                +--> predict-server (REST)   render data
        v
  Sui testnet  <----------  Keeper (Node service)
  predict::mint             watches OracleSettled,
  predict::redeem_permissionless fires payout claims
```

- **Frontend (Next.js PWA):** three screens — Quote (homepage), Receipt,
  History. Wallet and transaction signing via `@mysten/dapp-kit`. Typed Predict
  bindings via `@mysten/codegen`.
- **Keeper (Node service):** stateless process that subscribes to `OracleSettled`,
  finds open Sentinel positions on that oracle, and submits
  `predict::redeem_permissionless<DUSDC>` (one PTB per manager). Safe to restart.

## Read paths (use the protocol-recommended split)

- **predict-server (REST)** for everything renderable: oracle list/state, latest
  SVI, price history, manager positions, mint/redeem history.
- **Sui event stream** (`OraclePricesUpdated`, `OracleSVIUpdated`,
  `OracleSettled`) for the live price line and instant settlement flip.
- **Direct object reads** for `PredictManager` balance and `OracleSVI`
  immediately before building the purchase PTB.

## Key domain rules (do not break)

- **Coverage sizing:** `P = B × (S − K)` where `B` = BTC held, `S` = spot,
  `K` = trigger strike. Payout `P` is in dUSDC.
- **Contract units:** Predict contracts are $1-payout units in dUSDC, 6 decimals
  (`1_000_000 = 1 contract = $1`). Minted quantity is `P` in dUSDC units.
- **Strike selection:** `K = floor_to_tick(S × 0.98)` on the oracle strike grid
  (`min_strike + n × tick_size`). Default trigger is −2%.
- **Expiry selection:** active BTC `OracleSVI` with the nearest expiry ≥ 15 min
  away; roll to the next oracle if the front one is too close.
- **Premium math:** `ask = fair_price(SVI) + spread`; `premium = ask × quantity`.
  Spread `= max(min_spread, base_spread × √(p(1−p)) × utilization_term)`
  (defaults: base 2%, floor 0.5%).
- **Protocol ask floor:** mints below `min_ask_price = 1¢` per contract are
  rejected (`default_min_ask_price = 10_000_000` at 1e9 scaling) — so premium is
  at least 1% of coverage. Always disclose the floor when it binds.
- **Slippage:** re-run `predict::get_trade_amounts` immediately before signing;
  abort if executed cost exceeds the displayed premium by more than 5%. Quotes
  carry a 15-second freshness timer.
- **Single signature:** the purchase PTB composes `create_manager` (first time) +
  `predict_manager::deposit` (if balance < premium) + `predict::mint` into one
  signature.
- **Be honest in the UI:** parametric (all-or-nothing) payout, coverage window =
  oracle expiry, PLP vault counterparty, 1% minimum premium, not regulated
  insurance. These disclosures are shown in-product, never buried.

## On-chain calls

| Call | When |
|---|---|
| `predict::create_manager` | First purchase only |
| `predict_manager::deposit<DUSDC>` | Manager balance < premium |
| `market_key::down(oracle_id, expiry, strike)` | Build the position key |
| `predict::get_trade_amounts` (devInspect) | Premium preview + pre-sign re-check |
| `predict::mint<DUSDC>` | The purchase |
| `predict::redeem_permissionless<DUSDC>` | Keeper claims settled payouts |
| `predict::redeem<DUSDC>` | Stretch: early cancel |
| `predict_manager::withdraw<DUSDC>` | User sweeps payout to wallet |

## Integration targets (Sui testnet, branch `predict-testnet-4-16`)

| Thing | Value |
|---|---|
| Predict package | `0xf5ea2b3749c65d6e56507cc35388719aadb28f9cab873696a2f8687f5c785138` |
| Predict object | `0xc8736204d12f0a7277c86388a68bf8a194b0a14c5538ad13f22cbd8e2a38028a` |
| Quote asset | `e95040085976bfd54a1a07225cd46c8a2b4e8e2b6732f140a0fc49850ba73e1a::dusdc::DUSDC` |
| Indexer | `https://predict-server.testnet.mystenlabs.com` |

## Scope

**MVP (must work end-to-end):** BTC + dUSDC only, one default trigger (−2%),
nearest valid expiry, quote screen with honest breakdown, single-signature
purchase PTB, receipt with live price line + settlement status, keeper
auto-claim, withdraw-to-wallet.

**Out of scope:** multiple underlyings, fiat on-ramp, real BTC custody, LP/vault
features, mainnet hardening. Do not add these unless explicitly asked.

## Conventions for agents

- Treat `PRODUCT.md` as the spec of record; keep `PRODUCT.id.md` in sync if you
  change product behavior.
- Prefer the protocol's own values (on-chain ask, devInspect previews) over
  invented numbers — never quote a black-box premium.
- Keep changes within the stated scope; flag scope changes before implementing.
