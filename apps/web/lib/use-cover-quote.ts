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
  spot?: number,
  svi?: SviRawParams,
): CoverQuote {
  const minStrike = oracle?.minStrikeUsd ?? 0;
  const tick = oracle?.tickUsd ?? 0;
  const expiryMs = oracle?.expiryMs ?? 0;
  const spotUsd = spot ?? 0;

  const strike = spotUsd > 0 ? triggerStrike(spotUsd, minStrike, tick) : 0;
  const held = Math.max(0, btcHeld);
  const lossPerBtc = spotUsd - strike;
  const coverage = spotUsd > 0 ? calcCoverage(held, spotUsd, strike) : 0;

  const priced = oracle != null && spot != null && svi != null && spotUsd > 0;
  const fairRate = priced ? fairFromSvi(spotUsd, strike, expiryMs, svi) : 0;
  const spr = calcSpread(fairRate);
  const { ask, floorBinds } = applyAskFloor(fairRate + spr);
  const premium = calcPremium(ask, coverage);
  const fair = fairRate * coverage;
  const spreadAmt = spr * coverage;

  return {
    spot: spotUsd,
    strike,
    held,
    lossPerBtc,
    coverage,
    premium,
    fair,
    spreadAmt,
    floorBinds,
    expiryMs,
    expiryLabel: expiryMs > 0 ? formatExpiry(expiryMs).full : "",
    duration: expiryMs > 0 ? durationLabel(expiryMs) : "",
    valid: held > 0 && coverage > 0 && priced,
    createdAtMs: Date.now(),
  };
}

function localTimeZoneShort(date: Date): string {
  return (
    new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? ""
  );
}

/** Expiry timestamp formatted in the user's local timezone. */
export function formatExpiry(ms: number) {
  const d = new Date(ms);
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const clock = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const tz = localTimeZoneShort(d);
  const time = tz ? `${clock} ${tz}` : clock;
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
    expiryLabel: formatExpiry(o.expiry).full,
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

export type CoverTerm = { id: string; label: string; short: string; ms: number };

/** Insurance-style coverage terms. Strike is set from today's price; these
 *  pick how long the cover runs. */
export const COVER_TERMS: CoverTerm[] = [
  { id: "1d", label: "1 day", short: "1D", ms: 86_400_000 },
  { id: "1w", label: "1 week", short: "1W", ms: 7 * 86_400_000 },
  { id: "1m", label: "1 month", short: "1M", ms: 30 * 86_400_000 },
  { id: "3m", label: "3 months", short: "3M", ms: 90 * 86_400_000 },
  { id: "6m", label: "6 months", short: "6M", ms: 182 * 86_400_000 },
];

/**
 * Resolve a coverage term to the on-chain oracle that settles it. Picks the
 * nearest oracle at or after the requested term; `capped` is true when no
 * oracle reaches that far (e.g. multi-month terms on testnet, where the
 * longest live oracle is only ~3 weeks out) — the mint snaps to the longest
 * available window and the UI discloses it.
 */
export function snapTermToOracle(
  options: OracleOption[],
  term: CoverTerm,
): { oracle: OracleOption | null; capped: boolean } {
  if (options.length === 0) return { oracle: null, capped: false };
  const target = Date.now() + term.ms;
  const oracle = snapToOracle(options, target);
  const capped = oracle != null && oracle.expiryMs < target;
  return { oracle, capped };
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
      const client = createPredictServerClient();
      const oracles = await client.getOracles(PREDICT_OBJECT_ID);
      return eligibleOracles(oracles);
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
