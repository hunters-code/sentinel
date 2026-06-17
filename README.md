# Sentinel

One-hour parametric crash insurance for BTC, built on [DeepBook Predict](https://deepbook.tech) (Sui).

Enter how much BTC you hold → get one premium quote → sign one transaction → receive automatic payout if BTC settles at or below your trigger price before the chosen oracle expiry.

> **Hackathon scope:** Sui testnet only · BTC + dUSDC · single default trigger (−2%) · nearest valid oracle expiry.

---

## Testnet tokens

### dUSDC

Provided by Mysten Labs via the predict-server. Request from the Sui testnet faucet or use the Predict protocol's own tooling.

### tBTC (Test BTC)

A free, permissionless mock BTC deployed specifically for Sentinel demos. **Anyone can mint up to 10 tBTC per call.**

| Property | Value |
|---|---|
| **Symbol** | tBTC |
| **Decimals** | 8 (matches real BTC) |
| **Network** | Sui testnet |
| **Package ID** | `0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85` |
| **MintCap (shared)** | `0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89` |
| **Coin type** | `0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85::test_btc::TEST_BTC` |
| **CoinMetadata** | `0xb6934e549897e0415eb12c5e6df37fd120f396413f3677f2a197914d6710d314` |
| **Deploy tx** | [`FNjeFPfv…`](https://testnet.suivision.xyz/txblock/FNjeFPfvTm75kDqa4YEdoAz5gfZrZXm25JuByxDFn55A) |

#### Mint via Sui CLI

No extra setup — just the standard `sui` CLI pointed at testnet.

```bash
# Mint 0.5 tBTC to yourself
sui client call \
  --package 0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85 \
  --module test_btc \
  --function mint \
  --args \
    0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89 \
    50000000 \
    $(sui client active-address) \
  --gas-budget 10000000
```

Amount is in raw units (8 decimals): `1 BTC = 100_000_000`, `0.5 BTC = 50_000_000`.

| BTC | Raw units |
|---|---|
| 0.1 BTC | `10000000` |
| 0.5 BTC | `50000000` |
| 1 BTC | `100000000` |
| 5 BTC | `500000000` |
| 10 BTC (max) | `1000000000` |

#### Mint via Node script

```bash
# Install deps first (from repo root)
pnpm install

# Mint 1 tBTC to your active address (needs SUI_PRIVATE_KEY env var)
SUI_PRIVATE_KEY=suiprivkey… pnpm tsx contracts/test_btc/mint.ts 1

# Mint 0.5 tBTC to a specific address
SUI_PRIVATE_KEY=suiprivkey… pnpm tsx contracts/test_btc/mint.ts 0.5 0xYOUR_ADDRESS
```

#### Mint via Sui Explorer / Polymedia

1. Open [Sui testnet explorer](https://testnet.suivision.xyz/object/0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85)
2. Go to the `test_btc` module → `mint` function
3. Pass:
   - `mint_cap`: `0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89`
   - `amount`: raw units (e.g. `100000000` for 1 BTC)
   - `recipient`: your wallet address

---

## Architecture

```
Next.js PWA  (Quote · Receipt · History)
  @mysten/dapp-kit   wallet + PTB signing
        |
        +--> predict-server (REST)   oracle list, SVI, price history
        |    https://predict-server.testnet.mystenlabs.com
        |
        v
  Sui testnet  <----  Keeper (Node service)
  predict::mint       watches OracleSettled,
  predict::redeem_permissionless  fires payout claims
```

### Key on-chain addresses (testnet)

| Object | Address |
|---|---|
| Predict package | `0xf5ea2b37…785138` |
| Predict shared object | `0xc8736204…8028a` |
| dUSDC type | `e95040…::dusdc::DUSDC` |

Full values in [`packages/shared/src/constants.ts`](packages/shared/src/constants.ts).

---

## Getting started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Sui CLI (for keeper key management and tBTC minting)
- A Sui testnet wallet with some SUI for gas ([faucet](https://faucet.sui.io))
- Some tBTC (mint above) and dUSDC (from predict-server faucet) for purchases

### Install

```bash
pnpm install
```

### Run the web app

```bash
pnpm dev          # starts Next.js on http://localhost:3000
```

Connect your Sui wallet (Slush, Sui Wallet, etc.), make sure it's on **testnet**, then:

1. Open **Cover** tab
2. Enter how much tBTC you hold
3. Pick a coverage window
4. Tap **Protect** — sign the transaction
5. Check **History** for your policy receipt

### Run the keeper

```bash
cp .env.example .env
# Edit .env: set KEEPER_PRIVATE_KEY to a funded testnet key (suiprivkey… format)

pnpm dev:keeper
```

Without `KEEPER_PRIVATE_KEY` the keeper runs in **dry-run mode** — it logs claimable positions but does not sign transactions. Useful for verifying connectivity.

---

## Repository structure

```
apps/
  web/          Next.js PWA (Quote, Receipt, History screens)
  keeper/       Node keeper service (auto-claims settled payouts)
contracts/
  test_btc/     Move package — tBTC testnet coin
    sources/test_btc.move
    deployed.json       on-chain addresses after deployment
    mint.ts             CLI mint helper
docs/
  BACKEND.md    Keeper and shared package deep-dive
packages/
  shared/       Shared TS: constants, pricing math, predict-server client
PRODUCT.md      Full product specification (English)
PRODUCT.id.md   Full product specification (Indonesian)
CLAUDE.md       Agent instructions and domain rules
```

---

## Domain rules (summary)

| Rule | Value |
|---|---|
| Coverage formula | `P = BTC_held × (spot − strike)` in dUSDC |
| Default trigger | −2% below spot |
| Strike rounding | `floor_to_tick(spot × 0.98)` on oracle grid |
| Minimum expiry lead | 15 minutes |
| Quote freshness | 15 seconds |
| Max slippage | 5% vs displayed premium |
| Protocol ask floor | 1¢/contract (≥ 1% of coverage) |

Full rules in [`CLAUDE.md`](CLAUDE.md) and [`PRODUCT.md`](PRODUCT.md).

---

## License

MIT — testnet demo only; not regulated insurance.
