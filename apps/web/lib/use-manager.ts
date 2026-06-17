"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { createPredictServerClient } from "@sentinel/shared";

/** localStorage key for caching a freshly-created manager id before the
 *  indexer has picked it up. */
const cacheKey = (address: string) => `sentinel:manager:${address}`;

export function readCachedManagerId(address: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(cacheKey(address));
}

export function cacheManagerId(address: string, managerId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cacheKey(address), managerId);
}

/**
 * Resolves the connected wallet's PredictManager id. Managers are *shared*
 * objects (not owned), so they can't be found via getOwnedObjects — we read
 * the indexer's ManagerCreated events (newest first), falling back to a local
 * cache for a manager created moments ago that the indexer hasn't seen yet.
 */
export function useManagerId() {
  const account = useCurrentAccount();
  const address = account?.address;

  const query = useQuery({
    queryKey: ["manager-id", address],
    enabled: Boolean(address),
    staleTime: 30_000,
    queryFn: async (): Promise<string | null> => {
      const client = createPredictServerClient();
      try {
        const managers = await client.getManagersByOwner(address!);
        if (managers.length > 0) return managers[0].manager_id;
      } catch {
        // fall through to cache
      }
      return readCachedManagerId(address!);
    },
  });

  return {
    managerId: query.data ?? null,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}
