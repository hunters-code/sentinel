"use client";

import { useQuery } from "@tanstack/react-query";
import {
  createPredictServerClient,
  oraclePriceToUsd,
  type SviRawParams,
} from "@sentinel/shared";
import { DEMO_SPOT } from "@/lib/demo-policies";

const DEMO_SVI: SviRawParams = { a: 0.0004, b: 0.0008, rho: -0.3, m: -0.02, sigma: 0.05 };

export function useSpotPrice(oracleId: string | null) {
  return useQuery({
    queryKey: ["oracle-spot", oracleId],
    enabled: Boolean(oracleId) && !oracleId!.startsWith("demo-"),
    staleTime: 10_000,
    refetchInterval: 15_000,
    queryFn: async (): Promise<number> => {
      const client = createPredictServerClient();
      const prices = await client.getOraclePrices(oracleId!, 1);
      if (prices.length > 0) return oraclePriceToUsd(prices[0].price);
      throw new Error("no prices");
    },
  });
}

export function useOracleSvi(oracleId: string | null) {
  return useQuery({
    queryKey: ["oracle-svi", oracleId],
    enabled: Boolean(oracleId) && !oracleId!.startsWith("demo-"),
    staleTime: 30_000,
    queryFn: async (): Promise<SviRawParams> => {
      const client = createPredictServerClient();
      const s = await client.getOracleSviLatest(oracleId!);
      return { a: s.a, b: s.b, rho: s.rho, m: s.m, sigma: s.sigma };
    },
  });
}

/** Returns live spot price and SVI params for the selected oracle; falls back gracefully. */
export function useOracleData(oracleId: string | null) {
  const spotQuery = useSpotPrice(oracleId);
  const sviQuery = useOracleSvi(oracleId);

  return {
    spot: spotQuery.data ?? DEMO_SPOT,
    svi: sviQuery.data ?? DEMO_SVI,
    spotLive: spotQuery.isSuccess,
    sviLive: sviQuery.isSuccess,
    loading: spotQuery.isLoading || sviQuery.isLoading,
  };
}
