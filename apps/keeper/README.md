# @sentinel/keeper

Node service that auto-claims Sentinel crash-insurance payouts after oracle settlement.

## Quick start

```bash
# from repo root
cp .env.example .env
# add KEEPER_PRIVATE_KEY (suiprivkey… from `sui key export`)

pnpm install
pnpm dev:keeper
```

## What it does

1. Subscribes to `oracle::OracleSettled` events on Sui testnet.
2. Finds open **DOWN** binary positions on the settled oracle (minted − redeemed via predict-server).
3. Claims positions where `settlement_price ≤ strike` using `predict::redeem_permissionless<DUSDC>`.
4. Groups redeems into one PTB per `PredictManager`.

## Dry-run mode

If `KEEPER_PRIVATE_KEY` is empty, the process still polls events and logs claimable work without signing transactions. Useful for local development and verifying predict-server connectivity.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev:keeper` | Watch mode (`tsx watch`) |
| `pnpm --filter @sentinel/keeper start` | Run once without watch |
| `pnpm --filter @sentinel/keeper build` | Compile to `dist/` |

## Full documentation

See [`docs/BACKEND.md`](../../docs/BACKEND.md) for architecture, environment variables, and failure modes.
