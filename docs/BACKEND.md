# Sentinel Backend

Sentinel's backend is a single Node.js **keeper** service plus shared libraries in `@sentinel/shared`. There is no custom REST API — render data comes from Mysten's public [predict-server](https://predict-server.testnet.mystenlabs.com), and the keeper only submits on-chain payout claims.

## Architecture

```
┌────────────────────────┐
│  Next.js PWA           │  quote · receipt · history
│  @mysten/dapp-kit      │  wallet signing (purchase PTB)
└──────┬─────────┬───────┘
       │         │
       │         └────────────► predict-server (REST)   render data
       │
       ▼
   Sui testnet  ◄──────────────  Keeper (Node service)
   predict::mint                 watches OracleSettled,
   predict::redeem_permissionless fires payout claims
```

| Component | Role |
|---|---|
| **predict-server** | External indexer — oracles, SVI, prices, position history |
| **Keeper** | Watches `OracleSettled`, claims in-the-money DOWN payouts via `redeem_permissionless` |
| **@sentinel/shared** | Constants, pricing math, predict-server client, position aggregation |

## Keeper

The keeper is a stateless polling process in `apps/keeper`. It:

1. Bootstraps the most recent `OracleSettled` events on startup (catches up after restarts).
2. Polls new `OracleSettled` events on each tick.
3. For each settled oracle, loads mint/redeem history from predict-server and computes open DOWN positions.
4. Filters to in-the-money policies (`settlement_price ≤ strike`).
5. Submits one PTB per manager with one `redeem_permissionless<DUSDC>` call per position.

Payout lands in the user's `PredictManager`. The user still signs `predict_manager::withdraw<DUSDC>` from the web app to move funds to their wallet.

### Run locally

```bash
cp .env.example .env
# set KEEPER_PRIVATE_KEY to a funded testnet key (suiprivkey… format)

pnpm install
pnpm dev:keeper
```

Without `KEEPER_PRIVATE_KEY`, the keeper runs in **dry-run mode** — it logs claimable positions but does not submit transactions.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SUI_NETWORK` | `testnet` | Network label (logging only) |
| `SUI_RPC_URL` | testnet fullnode | Sui JSON-RPC endpoint |
| `PREDICT_PACKAGE_ID` | see `.env.example` | Predict Move package |
| `PREDICT_OBJECT_ID` | see `.env.example` | Shared `Predict` object |
| `DUSDC_TYPE` | see `.env.example` | Quote asset type argument |
| `PREDICT_SERVER_URL` | testnet indexer | predict-server base URL |
| `KEEPER_PRIVATE_KEY` | *(empty)* | Executor key; dry-run if unset |
| `KEEPER_POLL_INTERVAL_MS` | `5000` | Main loop interval |
| `KEEPER_EVENT_POLL_LIMIT` | `50` | Events per poll page |
| `KEEPER_BOOTSTRAP_SETTLEMENTS` | `100` | Recent settlements replayed on startup |

### On-chain calls

Each redeem PTB composes:

```
market_key::down(oracle_id, expiry, strike)
predict::redeem_permissionless<DUSDC>(predict, manager, oracle, key, quantity, clock)
```

The keeper address pays gas. The position owner receives dUSDC in their manager balance.

### Failure handling

| Situation | Behavior |
|---|---|
| predict-server down | Tick fails, logged, retried next interval |
| No claimable positions | Logged, no transaction |
| Redeem PTB fails | Error logged per manager; other managers still processed |
| Keeper down | Receipt screen offers manual owner `redeem` (see `PRODUCT.md` §8) |

## Shared package (`@sentinel/shared`)

| Module | Contents |
|---|---|
| `constants.ts` | Predict IDs, spread defaults, slippage limits |
| `pricing.ts` | Strike selection, coverage, spread, ask floor |
| `units.ts` | Oracle price (1e9) and dUSDC (1e6) conversions |
| `predictServer.ts` | Typed predict-server REST client |
| `positions.ts` | Mint/redeem aggregation, DOWN ITM check |
| `types.ts` | `Quote`, `Policy`, `OracleRef` domain types |

### predict-server client

```typescript
import { createPredictServerClient } from "@sentinel/shared";

const api = createPredictServerClient();
const oracles = await api.getOracles(PREDICT_OBJECT_ID);
const minted = await api.getMintedPositions({ oracleId: "0x…" });
```

Supported endpoints: `/status`, `/predicts/:id/oracles`, `/oracles/:id/state`, `/positions/minted`, `/positions/redeemed`, `/managers/:id/positions/summary`.

## Production notes (hackathon scope)

- Fund the keeper key with testnet SUI for gas.
- Run one keeper instance; duplicate instances are safe but waste gas racing the same redeems.
- Monitor logs for `[keeper] redeemed` success lines and `redeem failed` errors.
- For demos, bootstrap count can be raised if policies were purchased more than 100 oracle expiries ago.

## Related docs

- `PRODUCT.md` — full product spec and payout flow (§5.3)
- `CLAUDE.md` — integration targets and domain rules
- `apps/keeper/README.md` — quick-start for the keeper process
