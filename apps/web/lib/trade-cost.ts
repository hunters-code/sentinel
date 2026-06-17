"use client";

import { Transaction } from "@mysten/sui/transactions";
import type { SuiClient } from "@mysten/sui/client";
import {
  DUSDC_UNIT,
  PREDICT_OBJECT_ID,
  PREDICT_PACKAGE_ID,
  usdToOraclePrice,
} from "@sentinel/shared";

export const SUI_CLOCK_OBJECT_ID = "0x6";

export interface TradeCostArgs {
  oracleId: string;
  /** Raw oracle expiry (ms timestamp from OracleRecord). */
  expiryRaw: number;
  strikeUsd: number;
  /** Mint quantity in dUSDC units (coverageUsd * DUSDC_UNIT). */
  quantityUnits: bigint;
}

/**
 * The protocol's real cost for a mint, via `predict::get_trade_amounts`
 * (devInspect). This function takes NO type arguments and returns (cost, _);
 * the total dUSDC cost is the FIRST return value. Returns null on any failure.
 */
export async function fetchTradeCostUsd(
  client: SuiClient,
  sender: string,
  { oracleId, expiryRaw, strikeUsd, quantityUnits }: TradeCostArgs,
): Promise<number | null> {
  try {
    if (quantityUnits <= BigInt(0)) return null;
    const tx = new Transaction();
    tx.setSender(sender);
    const marketKey = tx.moveCall({
      target: `${PREDICT_PACKAGE_ID}::market_key::down`,
      arguments: [
        tx.pure.id(oracleId),
        tx.pure.u64(expiryRaw),
        tx.pure.u64(usdToOraclePrice(strikeUsd)),
      ],
    });
    tx.moveCall({
      target: `${PREDICT_PACKAGE_ID}::predict::get_trade_amounts`,
      arguments: [
        tx.object(PREDICT_OBJECT_ID),
        tx.object(oracleId),
        marketKey,
        tx.pure.u64(quantityUnits),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });
    const result = await client.devInspectTransactionBlock({
      transactionBlock: await tx.build({ client, onlyTransactionKind: true }),
      sender,
    });
    if (result.effects?.status?.status !== "success") return null;
    const raw = result.results?.at(-1)?.returnValues?.[0];
    if (!raw || !raw[0]) return null;
    const bytes = raw[0];
    let cost = BigInt(0);
    for (let i = bytes.length - 1; i >= 0; i--) {
      cost = (cost << BigInt(8)) | BigInt(bytes[i]);
    }
    return Number(cost) / DUSDC_UNIT;
  } catch {
    return null;
  }
}
