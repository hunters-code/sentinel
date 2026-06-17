/**
 * Purchase PTB builders for the Sentinel web app.
 *
 * PredictManager is a *shared* object created by `predict::create_manager`,
 * which returns only its ID — a freshly-shared object can't be referenced
 * later in the same PTB, so first-time setup is its own transaction:
 *
 *   tx A (first purchase only): predict::create_manager
 *   tx B (every purchase):      predict_manager::deposit<DUSDC> (if needed)
 *                               + market_key::down + predict::mint<DUSDC>
 *
 * Signatures verified against the on-chain normalized Move ABI.
 */

import { Transaction } from "@mysten/sui/transactions";
import type { CoinStruct } from "@mysten/sui/client";
import {
  DUSDC_TYPE,
  DUSDC_UNIT,
  PREDICT_OBJECT_ID,
  PREDICT_PACKAGE_ID,
  usdToOraclePrice,
} from "@sentinel/shared";

export const SUI_CLOCK_OBJECT_ID = "0x6";

export interface PurchaseParams {
  /** Caller wallet address */
  address: string;
  /** oracle_id on chain */
  oracleId: string;
  /** Oracle expiry — raw value from OracleRecord */
  expiryRaw: number;
  /** Strike in USD (converted to oracle price units 1e9) */
  strikeUsd: number;
  /** Coverage in USD → quantity = coverage * DUSDC_UNIT contracts */
  coverageUsd: number;
  /** Existing PredictManager (shared) object id — must already exist */
  managerId: string;
  /** dUSDC to deposit into the manager before minting (0 = skip deposit) */
  depositUsd: number;
  /** User's dUSDC coins sorted largest-first */
  dusdcCoins: CoinStruct[];
}

/**
 * First-time setup transaction. `create_manager` takes only TxContext (auto-
 * injected) and shares a new PredictManager, returning its ID. Must be its own
 * transaction — the shared object can't be used in the same PTB.
 */
export function buildCreateManagerPtb(address: string): Transaction {
  const tx = new Transaction();
  tx.setSender(address);
  tx.moveCall({
    target: `${PREDICT_PACKAGE_ID}::predict::create_manager`,
    arguments: [],
  });
  return tx;
}

export function buildPurchasePtb(params: PurchaseParams): Transaction {
  const {
    address,
    oracleId,
    expiryRaw,
    strikeUsd,
    coverageUsd,
    managerId,
    depositUsd,
    dusdcCoins,
  } = params;

  const tx = new Transaction();
  tx.setSender(address);

  const strikeRaw = usdToOraclePrice(strikeUsd);
  const quantityUnits = BigInt(Math.floor(coverageUsd * DUSDC_UNIT));
  const managerArg = tx.object(managerId);

  // Step 1: fund the manager's balance before minting
  if (depositUsd > 0 && dusdcCoins.length > 0) {
    const depositUnits = BigInt(Math.ceil(depositUsd * DUSDC_UNIT));
    const [primaryCoin, ...rest] = dusdcCoins;
    const paySource = tx.object(primaryCoin.coinObjectId);
    if (rest.length > 0) {
      tx.mergeCoins(
        paySource,
        rest.map((c) => tx.object(c.coinObjectId)),
      );
    }
    const payment = tx.splitCoins(paySource, [tx.pure.u64(depositUnits)]);
    tx.moveCall({
      target: `${PREDICT_PACKAGE_ID}::predict_manager::deposit`,
      typeArguments: [DUSDC_TYPE],
      arguments: [managerArg, payment],
    });
  }

  // Step 2: build market key (down binary)
  const marketKey = tx.moveCall({
    target: `${PREDICT_PACKAGE_ID}::market_key::down`,
    arguments: [
      tx.pure.id(oracleId),
      tx.pure.u64(expiryRaw),
      tx.pure.u64(strikeRaw),
    ],
  });

  // Step 3: mint
  tx.moveCall({
    target: `${PREDICT_PACKAGE_ID}::predict::mint`,
    typeArguments: [DUSDC_TYPE],
    arguments: [
      tx.object(PREDICT_OBJECT_ID),
      managerArg,
      tx.object(oracleId),
      marketKey,
      tx.pure.u64(quantityUnits),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
  });

  return tx;
}

/** Build a withdraw PTB to move dUSDC from manager to wallet. */
export function buildWithdrawPtb(
  address: string,
  managerId: string,
  amountUsd: number,
): Transaction {
  const tx = new Transaction();
  tx.setSender(address);
  const amountUnits = BigInt(Math.floor(amountUsd * DUSDC_UNIT));

  const coin = tx.moveCall({
    target: `${PREDICT_PACKAGE_ID}::predict_manager::withdraw`,
    typeArguments: [DUSDC_TYPE],
    arguments: [tx.object(managerId), tx.pure.u64(amountUnits)],
  });

  tx.transferObjects([coin], address);
  return tx;
}
