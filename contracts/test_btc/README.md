# tBTC — Testnet Mock BTC

Permissionless mock BTC coin on Sui testnet for Sentinel UI testing.  
Anyone can mint up to **10 tBTC per call** at no cost (gas only).

## Deployed addresses (Sui testnet)

| Object | ID |
|---|---|
| **Package** | `0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85` |
| **MintCap** (shared) | `0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89` |
| **CoinMetadata** | `0xb6934e549897e0415eb12c5e6df37fd120f396413f3677f2a197914d6710d314` |
| **Coin type** | `0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85::test_btc::TEST_BTC` |
| **Symbol / decimals** | `tBTC` / `8` |
| **Max per call** | `1 000 000 000` raw = 10 BTC |
| **Deploy tx** | [`FNjeFPfvTm75kDqa4YEdoAz5gfZrZXm25JuByxDFn55A`](https://testnet.suivision.xyz/txblock/FNjeFPfvTm75kDqa4YEdoAz5gfZrZXm25JuByxDFn55A) |

---

## How to mint

### Option 1 — Sui CLI (quickest, no extra deps)

Make sure `sui client active-env` shows `testnet`.

```bash
# Mint 1 tBTC to your active address
sui client call \
  --package 0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85 \
  --module test_btc \
  --function mint \
  --args \
    0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89 \
    100000000 \
    $(sui client active-address) \
  --gas-budget 10000000
```

**Amount table** (8 decimals — `1 BTC = 100_000_000`):

| Want | `amount` arg |
|---|---|
| 0.1 BTC | `10000000` |
| 0.25 BTC | `25000000` |
| 0.5 BTC | `50000000` |
| 1 BTC | `100000000` |
| 5 BTC | `500000000` |
| 10 BTC (max) | `1000000000` |

To mint to a different address, replace `$(sui client active-address)` with the target address.

---

### Option 2 — Node script (`mint.ts`)

```bash
# From the repo root — install deps once
pnpm install

# Mint 1 tBTC to your active sui-client address
SUI_PRIVATE_KEY=suiprivkey… pnpm tsx contracts/test_btc/mint.ts 1

# Mint 0.5 tBTC to a specific address
SUI_PRIVATE_KEY=suiprivkey… pnpm tsx contracts/test_btc/mint.ts 0.5 0xRECIPIENT

# Or with a mnemonic
MNEMONIC="word1 word2 … word12" pnpm tsx contracts/test_btc/mint.ts 2
```

`SUI_PRIVATE_KEY` is the `suiprivkey…` bech32 format from `sui keytool export`.  
Amount must be between `0` and `10` (BTC, not raw units).

---

### Option 3 — Sui Explorer (browser, no CLI)

1. Visit the package on the explorer:  
   [testnet.suivision.xyz — test_btc module](https://testnet.suivision.xyz/object/0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85?tab=contract)
2. Select the **`mint`** function under the `test_btc` module.
3. Fill in the arguments:
   - **mint_cap** → `0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89`
   - **amount** → raw units (e.g. `100000000` for 1 BTC)
   - **recipient** → your wallet address
4. Connect your testnet wallet and execute.

---

## Contract overview

```move
// Shared object — no one "owns" the treasury cap; anyone can call mint.
public struct MintCap has key {
    id: UID,
    cap: TreasuryCap<TEST_BTC>,
}

// Mint up to 10 tBTC to `recipient`.
public entry fun mint(
    mint_cap: &mut MintCap,
    amount: u64,          // raw units, max 1_000_000_000
    recipient: address,
    ctx: &mut TxContext,
)

// Mint and merge into an existing coin you already hold.
public entry fun mint_and_merge(
    mint_cap: &mut MintCap,
    amount: u64,
    existing: Coin<TEST_BTC>,
    ctx: &mut TxContext,
)
```

Source: [`sources/test_btc.move`](sources/test_btc.move)

---

## Re-deploying

If you need to re-deploy (e.g. upgrade or new network):

```bash
# Build
sui move build contracts/test_btc

# Publish
sui client publish contracts/test_btc --gas-budget 100000000
```

Update [`deployed.json`](deployed.json) and [`packages/shared/src/constants.ts`](../../packages/shared/src/constants.ts) with the new addresses.
