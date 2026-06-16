"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

/**
 * Resolves the connected wallet's PredictManager object id by scanning owned
 * objects for the predict_manager type. Returns null when the wallet has none
 * (i.e. before the first purchase).
 */
export function useManagerId() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const address = account?.address;

  const query = useQuery({
    queryKey: ["manager-id", address],
    enabled: Boolean(address),
    staleTime: 60_000,
    queryFn: async (): Promise<string | null> => {
      const owned = await client.getOwnedObjects({
        owner: address!,
        options: { showType: true },
      });
      const match = owned.data.find((o) =>
        o.data?.type?.toLowerCase().includes("predict_manager"),
      );
      return match?.data?.objectId ?? null;
    },
  });

  return {
    managerId: query.data ?? null,
    loading: query.isLoading,
  };
}
