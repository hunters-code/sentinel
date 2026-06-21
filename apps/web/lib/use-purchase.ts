"use client";

import { useCallback, useState } from "react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import {
  DUSDC_TYPE,
  DUSDC_UNIT,
  MAX_SLIPPAGE_PCT,
  QUOTE_FRESHNESS_MS,
} from "@sentinel/shared";
import {
  buildCreateManagerPtb,
  buildPurchasePtb,
} from "@/lib/web-ptb";
import { fetchTradeCostUsd } from "@/lib/trade-cost";
import { cacheManagerId } from "@/lib/use-manager";
import type { CoverQuote } from "@/lib/use-cover-quote";
import type { OracleOption } from "@/lib/use-cover-quote";

export type PurchaseStatus =
  | "idle"
  | "checking"
  | "signing"
  | "confirming"
  | "success"
  | "error";

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

        // First-time users have no manager yet. The manager is a shared object
        // that can't be created and used in the same PTB, so create it in its
        // own transaction first, then resolve its id for the mint below.
        let resolvedManagerId = managerId;
        if (!resolvedManagerId) {
          setStatus("signing");
          const createResult = await signAndExecute({
            transaction: buildCreateManagerPtb(address),
          });
          const created = await client.waitForTransaction({
            digest: createResult.digest,
            options: { showObjectChanges: true },
          });
          const managerChange = created.objectChanges?.find(
            (c) =>
              c.type === "created" &&
              "objectType" in c &&
              c.objectType.includes("predict_manager::PredictManager"),
          );
          if (!managerChange || !("objectId" in managerChange)) {
            setError("Couldn't create your account — please try again.");
            setStatus("error");
            return;
          }
          resolvedManagerId = managerChange.objectId;
          cacheManagerId(address, resolvedManagerId);
          // Newly created manager has zero balance regardless of prior reads.
          managerBalanceUsd = 0;
        }

        setStatus("checking");

        // Pre-sign re-check of the protocol's real cost. quote.premium is the
        // on-chain price shown to the user (from get_trade_amounts), so this is
        // a true price-moved check, not an SVI-estimate mismatch.
        const onChainCost = await fetchTradeCostUsd(client, address, {
          oracleId: oracle.oracleId,
          expiryRaw: oracle.expiryMs,
          strikeUsd: quote.strike,
          quantityUnits,
        });

        if (onChainCost !== null && quote.premium > 0) {
          const slippage = (onChainCost - quote.premium) / quote.premium;
          if (slippage > MAX_SLIPPAGE_PCT) {
            setError(
              `Price moved — cost is ${((slippage * 100)).toFixed(1)}% above the quote you saw. Try again to get the current price.`,
            );
            setStatus("error");
            return;
          }
        }

        // The mint withdraws the actual execution cost from the manager's
        // balance, which can drift slightly above the preview. Fund a buffer
        // (within the slippage we tolerate) so the withdrawal never comes up
        // short; any leftover stays withdrawable.
        const estCost = onChainCost ?? quote.premium;
        const minNeeded = Math.max(0, estCost - managerBalanceUsd);
        const bufferedTarget = Math.max(0, estCost * (1 + MAX_SLIPPAGE_PCT) - managerBalanceUsd);

        let dusdcCoins: Awaited<ReturnType<typeof client.getCoins>>["data"] = [];
        let depositUsd = 0;
        if (minNeeded > 0) {
          const coinsResp = await client.getCoins({
            owner: address,
            coinType: DUSDC_TYPE,
          });
          dusdcCoins = coinsResp.data.sort(
            (a, b) => Number(BigInt(b.balance) - BigInt(a.balance)),
          );

          const totalDusdc = dusdcCoins.reduce((s, c) => s + Number(c.balance), 0) / DUSDC_UNIT;
          if (totalDusdc < minNeeded) {
            setError(
              `Insufficient dUSDC. Need ${minNeeded.toFixed(2)} dUSDC; wallet has ${totalDusdc.toFixed(2)}.`,
            );
            setStatus("error");
            return;
          }
          // Deposit the buffered target, capped at what the wallet actually has.
          depositUsd = Math.min(totalDusdc, bufferedTarget);
        }

        setStatus("signing");

        const tx = buildPurchasePtb({
          address,
          oracleId: oracle.oracleId,
          expiryRaw: oracle.expiryMs,
          strikeUsd: quote.strike,
          coverageUsd: quote.coverage,
          managerId: resolvedManagerId,
          depositUsd,
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
