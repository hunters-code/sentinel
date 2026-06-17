"use client";

import { useCallback, useState } from "react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import {
  DUSDC_TYPE,
  DUSDC_UNIT,
  PREDICT_OBJECT_ID,
  PREDICT_PACKAGE_ID,
  MAX_SLIPPAGE_PCT,
  QUOTE_FRESHNESS_MS,
  usdToOraclePrice,
} from "@sentinel/shared";
import { buildPurchasePtb, buildWithdrawPtb, SUI_CLOCK_OBJECT_ID } from "@/lib/web-ptb";
import { Transaction } from "@mysten/sui/transactions";
import type { CoverQuote } from "@/lib/use-cover-quote";
import type { OracleOption } from "@/lib/use-cover-quote";

export type PurchaseStatus =
  | "idle"
  | "checking"
  | "signing"
  | "confirming"
  | "success"
  | "error";

async function devInspectTradeAmounts(
  client: ReturnType<typeof useSuiClient>,
  address: string,
  oracleId: string,
  expiryRaw: number,
  strikeUsd: number,
  quantityUnits: bigint,
): Promise<number | null> {
  try {
    const tx = new Transaction();
    tx.setSender(address);
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
      typeArguments: [DUSDC_TYPE],
      arguments: [
        tx.object(PREDICT_OBJECT_ID),
        tx.object(oracleId),
        marketKey,
        tx.pure.u64(quantityUnits),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });
    const result = await client.devInspectTransactionBlock({
      transactionBlock: await tx.build({ client }),
      sender: address,
    });
    // Extract the last return value (total cost in dUSDC units)
    const returnVals = result.results?.at(-1)?.returnValues;
    if (!returnVals || returnVals.length === 0) return null;
    // Last return value is the total cost; it's BCS-encoded u64
    const raw = returnVals[returnVals.length - 1];
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

export function usePurchase() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const queryClient = useQueryClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const purchase = useCallback(
    async (
      quote: CoverQuote,
      oracle: OracleOption,
      managerId: string | null,
      managerBalanceUsd: number,
    ) => {
      if (!account?.address) {
        setError("Wallet not connected");
        return;
      }

      setStatus("checking");
      setError(null);
      setTxDigest(null);

      try {
        // Stale quote guard
        if (Date.now() - quote.createdAtMs > QUOTE_FRESHNESS_MS) {
          setError("Quote expired — refresh and try again");
          setStatus("error");
          return;
        }

        const address = account.address;
        const quantityUnits = BigInt(Math.floor(quote.coverage * DUSDC_UNIT));

        // Pre-sign slippage re-check via get_trade_amounts devInspect
        const onChainCost = await devInspectTradeAmounts(
          client,
          address,
          oracle.oracleId,
          oracle.expiryMs,
          quote.strike,
          quantityUnits,
        );

        if (onChainCost !== null) {
          const slippage = (onChainCost - quote.premium) / quote.premium;
          if (slippage > MAX_SLIPPAGE_PCT) {
            setError(
              `Market moved — cost is ${((slippage * 100)).toFixed(1)}% above your quote. Refresh to get a new quote.`,
            );
            setStatus("error");
            return;
          }
        }

        // Fetch user's dUSDC coins for deposit
        const depositNeeded = quote.premium - managerBalanceUsd;
        let dusdcCoins: Awaited<ReturnType<typeof client.getCoins>>["data"] = [];
        if (depositNeeded > 0) {
          const coinsResp = await client.getCoins({
            owner: address,
            coinType: DUSDC_TYPE,
          });
          dusdcCoins = coinsResp.data.sort(
            (a, b) => Number(BigInt(b.balance) - BigInt(a.balance)),
          );

          const totalDusdc = dusdcCoins.reduce((s, c) => s + Number(c.balance), 0) / DUSDC_UNIT;
          if (totalDusdc < depositNeeded) {
            setError(
              `Insufficient dUSDC. Need ${depositNeeded.toFixed(2)} dUSDC; wallet has ${totalDusdc.toFixed(2)}.`,
            );
            setStatus("error");
            return;
          }
        }

        setStatus("signing");

        const tx = buildPurchasePtb({
          address,
          oracleId: oracle.oracleId,
          expiryRaw: oracle.expiryMs,
          strikeUsd: quote.strike,
          coverageUsd: quote.coverage,
          premiumUsd: onChainCost ?? quote.premium,
          managerId,
          managerBalanceUsd,
          dusdcCoins,
        });

        setStatus("confirming");
        const result = await signAndExecute({ transaction: tx });
        setTxDigest(result.digest);
        setStatus("success");

        // Invalidate queries so history/balance refresh
        queryClient.invalidateQueries({ queryKey: ["manager-id", address] });
        queryClient.invalidateQueries({ queryKey: ["manager-balance"] });
        queryClient.invalidateQueries({ queryKey: ["keeper-policies"] });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transaction failed");
        setStatus("error");
      }
    },
    [account, client, queryClient, signAndExecute],
  );

  return { purchase, status, error, txDigest };
}

export function useWithdraw() {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [withdrawing, setWithdrawing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdraw = useCallback(
    async (managerId: string, amountUsd: number) => {
      if (!account?.address || amountUsd <= 0) return;
      setWithdrawing(true);
      setError(null);
      try {
        const tx = buildWithdrawPtb(account.address, managerId, amountUsd);
        await signAndExecute({ transaction: tx });
        setDone(true);
        queryClient.invalidateQueries({ queryKey: ["manager-balance", managerId] });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Withdraw failed");
      } finally {
        setWithdrawing(false);
      }
    },
    [account, queryClient, signAndExecute],
  );

  return { withdraw, withdrawing, done, error };
}
