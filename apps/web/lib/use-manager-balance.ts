"use client";

import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { fetchManagerBalanceUsd } from "@/lib/fetch-manager-balance";

export function useManagerBalance(managerId: string | null) {
  const client = useSuiClient();

  const query = useQuery({
    queryKey: ["manager-balance", managerId],
    enabled: Boolean(managerId),
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<number> => {
      try {
        return await fetchManagerBalanceUsd(client, managerId!);
      } catch {
        return 0;
      }
    },
  });

  return {
    balance: query.data ?? 0,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}
