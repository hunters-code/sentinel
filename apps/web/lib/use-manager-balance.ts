"use client";

import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { DUSDC_UNIT } from "@sentinel/shared";

/**
 * Reads the PredictManager object directly from chain to get the dUSDC balance.
 * Falls back to 0 on any error (object may not have a `balance` field we can parse).
 */
export function useManagerBalance(managerId: string | null) {
  const client = useSuiClient();

  const query = useQuery({
    queryKey: ["manager-balance", managerId],
    enabled: Boolean(managerId),
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<number> => {
      const obj = await client.getObject({
        id: managerId!,
        options: { showContent: true },
      });
      const fields = (obj.data?.content as { fields?: Record<string, unknown> } | undefined)?.fields;
      if (!fields) return 0;
      // The manager's balance is a Balance<DUSDC> struct; try common field names.
      const raw =
        (fields.balance as { value?: string } | undefined)?.value ??
        fields.balance_value ??
        fields.balance;
      if (raw == null) return 0;
      return Number(raw) / DUSDC_UNIT;
    },
  });

  return {
    balance: query.data ?? 0,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}
