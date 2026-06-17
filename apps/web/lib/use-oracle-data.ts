"use client";

import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import {
  createPredictServerClient,
  DUSDC_UNIT,
  oraclePriceToUsd,
  PREDICT_OBJECT_ID,
  type SviRawParams,
} from "@sentinel/shared";
import { fetchTradeCostUsd } from "@/lib/trade-cost";

const DEMO_SVI: SviRawParams = { a: 0.0004, b: 0.0008, rho: -0.3, m: -0.02, sigma: 0.05 };

const FALLBACK_BTC_PRICE = 100_000;

/**
 * Live BTC/USD spot for display and quote math. Sourced from the predict-server
 * oracle feed (the same host the rest of the app uses, so it works wherever the
 * app does) — the testnet coin isn't real BTC, but the price tracks the real
 * BTC market the oracle prices off.
 */
export function useLiveBtcPrice() {
  return useQuery({
    queryKey: ["live-btc-price"],
    staleTime: 10_000,
    refetchInterval: 15_000,
    queryFn: async (): Promise<number> => {
      const client = createPredictServerClient();
      const oracles = await client.getOracles(PREDICT_OBJECT_ID);
      const now = Date.now();
      // Prefer an active, unsettled oracle; fall back to any oracle.
      const candidate =
        oracles.find((o) => o.status === "active" && o.expiry > now) ?? oracles[0];
      if (!candidate) throw new Error("no oracle available");
      const prices = await client.getOraclePrices(candidate.oracle_id, 1);
      if (prices.length === 0) throw new Error("no price");
      return oraclePriceToUsd(prices[0].spot);
    },
  });
}

export function useSpotPrice(oracleId: string | null) {
  return useQuery({
    queryKey: ["oracle-spot", oracleId],
    enabled: Boolean(oracleId) && !oracleId!.startsWith("demo-"),
    staleTime: 10_000,
    refetchInterval: 15_000,
    queryFn: async (): Promise<number> => {
      const client = createPredictServerClient();
      const prices = await client.getOraclePrices(oracleId!, 1);
      if (prices.length > 0) return oraclePriceToUsd(prices[0].spot);
      throw new Error("no prices");
    },
  });
}

/**
 * The protocol's real premium for a prospective mint, via get_trade_amounts.
 * This is the authoritative price (the SVI math is only a rough display
 * fallback). Returns null while loading or when inputs aren't ready.
 */
export function useOnChainPremium(args: {
  oracleId: string | null;
  expiryRaw: number | null;
  strikeUsd: number;
  coverageUsd: number;
}) {
  const client = useSuiClient();
  const { oracleId, expiryRaw, strikeUsd, coverageUsd } = args;
  const quantityUnits = Math.floor(coverageUsd * DUSDC_UNIT);
  const enabled =
    Boolean(oracleId) &&
    !oracleId!.startsWith("demo-") &&
    expiryRaw != null &&
    quantityUnits > 0 &&
    strikeUsd > 0;

  const query = useQuery({
    queryKey: ["onchain-premium", oracleId, expiryRaw, strikeUsd, quantityUnits],
    enabled,
    staleTime: 10_000,
    refetchInterval: 15_000,
    queryFn: async (): Promise<number | null> => {
      // devInspect needs a sender; any address works for a read-only preview.
      const sender = "0x0000000000000000000000000000000000000000000000000000000000000001";
      return fetchTradeCostUsd(client, sender, {
        oracleId: oracleId!,
        expiryRaw: expiryRaw!,
        strikeUsd,
        quantityUnits: BigInt(quantityUnits),
      });
    },
  });

  return { premium: query.data ?? null, loading: query.isFetching };
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
  const liveBtc = useLiveBtcPrice();

  // Prefer the oracle's own price; otherwise track the real BTC market.
  const spot = spotQuery.data ?? liveBtc.data ?? FALLBACK_BTC_PRICE;

  return {
    spot,
    svi: sviQuery.data ?? DEMO_SVI,
    spotLive: spotQuery.isSuccess || liveBtc.isSuccess,
    sviLive: sviQuery.isSuccess,
    loading: spotQuery.isLoading || sviQuery.isLoading,
  };
}
