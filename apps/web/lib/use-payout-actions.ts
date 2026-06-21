"use client";

import { useCallback, useState } from "react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import { DUSDC_UNIT } from "@sentinel/shared";
import { buildClaimPtb, buildWithdrawPtb } from "@/lib/web-ptb";
import { parsePolicyReceiptId } from "@/lib/policy-id";
import type { KeeperPolicy } from "@/lib/keeper";

function invalidatePayoutQueries(queryClient: ReturnType<typeof useQueryClient>, managerId: string) {
  queryClient.invalidateQueries({ queryKey: ["manager-balance", managerId] });
  queryClient.invalidateQueries({ queryKey: ["policy-open-qty"] });
  queryClient.invalidateQueries({ queryKey: ["keeper-policies", managerId] });
}

export function useWithdraw() {
  const account = useCurrentAccount();
  const client = useSuiClient();
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
        const result = await signAndExecute({ transaction: tx });
        await client.waitForTransaction({ digest: result.digest });
        setDone(true);
        invalidatePayoutQueries(queryClient, managerId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Withdraw failed");
      } finally {
        setWithdrawing(false);
      }
    },
    [account, client, queryClient, signAndExecute],
  );

  const reset = useCallback(() => {
    setDone(false);
    setError(null);
  }, []);

  return { withdraw, withdrawing, done, error, reset };
}

export function useClaimPayout() {
  const client = useSuiClient();
  const queryClient = useQueryClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = useCallback(
    async (policy: KeeperPolicy, managerId: string, openQuantity: number) => {
      const parsed = parsePolicyReceiptId(policy.id);
      if (!parsed || openQuantity <= 0) return;

      setClaiming(true);
      setError(null);
      try {
        const tx = buildClaimPtb({
          oracleId: parsed.oracleId,
          expiryRaw: policy.expiryMs,
          strikeRaw: parsed.strikeRaw,
          quantityUnits: BigInt(openQuantity),
          managerId,
        });
        const result = await signAndExecute({ transaction: tx });
        await client.waitForTransaction({ digest: result.digest });
        invalidatePayoutQueries(queryClient, managerId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Claim failed");
      } finally {
        setClaiming(false);
      }
    },
    [client, queryClient, signAndExecute],
  );

  return { claim, claiming, error };
}

export function withdrawableAmount(balanceUsd: number, payoutUsd?: number): number {
  if (balanceUsd <= 0) return 0;
  if (payoutUsd != null && payoutUsd > 0) return Math.min(balanceUsd, payoutUsd);
  return balanceUsd;
}

export function formatQuantityUsd(quantityUnits: number): number {
  return quantityUnits / DUSDC_UNIT;
}
