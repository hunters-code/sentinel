/**
 * Purchase PTB builder for the Sentinel web app.
 *
 * Composes (all in one user signature):
 *   1. predict::create_manager  — first purchase only
 *   2. predict_manager::deposit<DUSDC>  — when manager balance < premium
 *   3. market_key::down  — build the position key
 *   4. predict::mint<DUSDC>  — the actual purchase
 *
 * NOTE: Function signatures are derived from the keeper's redeem PTB and the
 * CLAUDE.md on-chain call table. Adjust argument order if the chain rejects.
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
  /** Premium in USD (max cost accepted; caller has already slippage-checked) */
  premiumUsd: number;
  /** Existing PredictManager object id; null = create new */
  managerId: string | null;
  /** Current manager dUSDC balance in USD (0 if no manager yet) */
  managerBalanceUsd: number;
  /** User's dUSDC coins sorted largest-first */
  dusdcCoins: CoinStruct[];
}

export function buildPurchasePtb(params: PurchaseParams): Transaction {
  const {
    address,
    oracleId,
    expiryRaw,
    strikeUsd,
    coverageUsd,
    premiumUsd,
    managerId,
    managerBalanceUsd,
    dusdcCoins,
  } = params;

  const tx = new Transaction();
  tx.setSender(address);

  const strikeRaw = usdToOraclePrice(strikeUsd);
  const quantityUnits = BigInt(Math.floor(coverageUsd * DUSDC_UNIT));

  // Step 1: create manager if needed. create_manager returns a PredictManager
  // value object that we use in deposit+mint below, then transfer to user at end.
  // Transaction arg can be either a Result (from moveCall) or an ObjectArg.
  // We cast via unknown to satisfy both branches.
  let managerArg: ReturnType<typeof tx.object>;
  let newManagerResult: ReturnType<typeof tx.moveCall> | null = null;

  if (!managerId) {
    newManagerResult = tx.moveCall({
      target: `${PREDICT_PACKAGE_ID}::predict::create_manager`,
      arguments: [tx.object(PREDICT_OBJECT_ID)],
    });
    managerArg = newManagerResult as unknown as ReturnType<typeof tx.object>;
  } else {
    managerArg = tx.object(managerId);
  }

  // Step 2: deposit if manager balance is insufficient
  const depositNeeded = premiumUsd - managerBalanceUsd;
  if (depositNeeded > 0 && dusdcCoins.length > 0) {
    const depositUnits = BigInt(Math.ceil(depositNeeded * DUSDC_UNIT));
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

  // Step 3: build market key
  const marketKey = tx.moveCall({
    target: `${PREDICT_PACKAGE_ID}::market_key::down`,
    arguments: [
      tx.pure.id(oracleId),
      tx.pure.u64(expiryRaw),
      tx.pure.u64(strikeRaw),
    ],
  });

  // Step 4: mint
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

  // Transfer newly created manager to user after all uses
  if (newManagerResult !== null) {
    tx.transferObjects([newManagerResult], address);
  }

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
