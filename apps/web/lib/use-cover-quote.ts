"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MIN_EXPIRY_LEAD_MS,
  PREDICT_OBJECT_ID,
  applyAskFloor,
  coverage as calcCoverage,
  createPredictServerClient,
  oraclePriceToUsd,
  premium as calcPremium,
  spread as calcSpread,
  triggerStrike,
  fairFromSvi,
  type OracleRecord,
  type SviRawParams,
} from "@sentinel/shared";
import { DEMO_SPOT } from "@/lib/demo-policies";

const DEMO_SVI: SviRawParams = { a: 0.0004, b: 0.0008, rho: -0.3, m: -0.02, sigma: 0.05 };

export type OracleOption = {
  oracleId: string;
  expiryMs: number;
  expiryLabel: string;
  minStrikeUsd: number;
  tickUsd: number;
};

export type CoverQuote = {
  spot: number;
  strike: number;
  held: number;
  lossPerBtc: number;
  coverage: number;
  premium: number;
  fair: number;
  spreadAmt: number;
  floorBinds: boolean;
  expiryMs: number;
  expiryLabel: string;
  duration: string;
  valid: boolean;
  createdAtMs: number;
};

export function buildCoverQuote(
  btcHeld: number,
  oracle: OracleOption | null,
  spot = DEMO_SPOT,
  svi: SviRawParams = DEMO_SVI,
): CoverQuote {
  const minStrike = oracle?.minStrikeUsd ?? 90_000;
  const tick = oracle?.tickUsd ?? 100;
  const expiryMs = oracle?.expiryMs ?? Date.now() + 45 * 60 * 1000;

  const strike = triggerStrike(spot, minStrike, tick);
  const held = Math.max(0, btcHeld);
  const lossPerBtc = spot - strike;
  const coverage = calcCoverage(held, spot, strike);

  const fairRate = oracle ? fairFromSvi(spot, strike, expiryMs, svi) : 0.01;
  const spr = calcSpread(fairRate);
  const { ask, floorBinds } = applyAskFloor(fairRate + spr);
  const premium = calcPremium(ask, coverage);
  const fair = fairRate * coverage;
  const spreadAmt = spr * coverage;

  return {
    spot,
    strike,
    held,
    lossPerBtc,
    coverage,
    premium,
    fair,
    spreadAmt,
    floorBinds,
    expiryMs,
    expiryLabel: formatExpiryUtc(expiryMs).full,
    duration: durationLabel(expiryMs),
    valid: held > 0 && coverage > 0 && oracle != null,
    createdAtMs: Date.now(),
  };
}

export function formatExpiryUtc(ms: number) {
  const d = new Date(ms);
  const date = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const time =
    d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC";
  return { date, time, full: `${date} · ${time}` };
}

export function durationLabel(expiryMs: number) {
  const mins = Math.max(1, Math.round((expiryMs - Date.now()) / 60_000));
  if (mins < 60) return `${mins} min`;
  if (mins < 24 * 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const days = Math.floor(mins / (24 * 60));
  const rh = Math.floor((mins % (24 * 60)) / 60);
  return rh > 0 ? `${days}d ${rh}h` : `${days}d`;
}

/** Value for `<input type="datetime-local" />` in local timezone */
export function toDatetimeLocalValue(ms: number) {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function parseDatetimeLocal(value: string): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function toOracleOption(o: OracleRecord): OracleOption {
  return {
    oracleId: o.oracle_id,
    expiryMs: o.expiry,
    expiryLabel: formatExpiryUtc(o.expiry).full,
    minStrikeUsd: oraclePriceToUsd(o.min_strike),
    tickUsd: oraclePriceToUsd(o.tick_size),
  };
}

function eligibleOracles(oracles: OracleRecord[]): OracleOption[] {
  const minExpiry = Date.now() + MIN_EXPIRY_LEAD_MS;
  return oracles
    .filter((o) => o.status === "active" && o.expiry >= minExpiry)
    .sort((a, b) => a.expiry - b.expiry)
    .map(toOracleOption);
}

function fallbackOracles(): OracleOption[] {
  const now = Date.now();
  const offsetsMin = [30, 60, 120, 360, 720, 1440, 2880];
  return offsetsMin.map((mins, i) => {
    const expiryMs = now + mins * 60 * 1000;
    return {
      oracleId: `demo-${i}`,
      expiryMs,
      expiryLabel: formatExpiryUtc(expiryMs).full,
      minStrikeUsd: 90_000,
      tickUsd: 100,
    };
  });
}

/** Nearest oracle at or after the user's target (protocol windows only). */
export function snapToOracle(options: OracleOption[], targetMs: number): OracleOption | null {
  if (options.length === 0) return null;
  const floor = Date.now() + MIN_EXPIRY_LEAD_MS;
  const target = Math.max(targetMs, floor);

  const onOrAfter = options
    .filter((o) => o.expiryMs >= target)
    .sort((a, b) => a.expiryMs - b.expiryMs)[0];
  if (onOrAfter) return onOrAfter;

  return options.sort((a, b) => b.expiryMs - a.expiryMs)[0] ?? null;
}

export function useOracleOptions() {
  const query = useQuery({
    queryKey: ["oracle-options"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const client = createPredictServerClient();
        const oracles = await client.getOracles(PREDICT_OBJECT_ID);
        const options = eligibleOracles(oracles);
        return options.length > 0 ? options : fallbackOracles();
      } catch {
        return fallbackOracles();
      }
    },
  });

  return {
    options: query.data ?? [],
    loading: query.isLoading,
    defaultOracleId: query.data?.[0]?.oracleId ?? null,
  };
}

export function useCoverQuote(
  btcHeld: number,
  oracle: OracleOption | null,
  spot?: number,
  svi?: SviRawParams,
) {
  return buildCoverQuote(btcHeld, oracle, spot, svi);
}

/** Format user's datetime-local pick for display */
export function formatPickedLocal(value: string): string | null {
  const ms = parseDatetimeLocal(value);
  if (ms == null) return null;
  return new Date(ms).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
