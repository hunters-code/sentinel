"use client";

import { useQuery } from "@tanstack/react-query";
import type { AssetId } from "@/lib/assets";

/** CoinGecko ids for the real market price of each asset. */
const COINGECKO_ID: Record<AssetId, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sui: "sui",
};

/** Last-resort price if the feed is unreachable — keeps the quote sane. */
const FALLBACK_USD: Record<AssetId, number> = {
  btc: 100_000,
  eth: 3_500,
  sui: 1.2,
};

/**
 * Live USD spot for an asset, sourced from a third-party feed (CoinGecko) —
 * the same idea as the BTC price the oracle tracks, but for assets that don't
 * have their own settlement oracle yet. Falls back to a static estimate if the
 * feed is unreachable.
 */
export function useSpotPrice(assetId: AssetId) {
  const query = useQuery({
    queryKey: ["spot-price", assetId],
    staleTime: 30_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<number> => {
      const id = COINGECKO_ID[assetId];
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      );
      if (!res.ok) throw new Error(`coingecko ${res.status}`);
      const json = (await res.json()) as Record<string, { usd?: number }>;
      const price = json[id]?.usd;
      if (typeof price !== "number" || price <= 0) throw new Error("no price");
      return price;
    },
  });

  return query.data ?? FALLBACK_USD[assetId];
}

/** A sensible strike tick for an asset whose price isn't on the BTC grid. */
export function niceTick(spot: number): number {
  if (spot >= 1000) return 1;
  if (spot >= 100) return 0.1;
  if (spot >= 1) return 0.001;
  return 0.0001;
}
