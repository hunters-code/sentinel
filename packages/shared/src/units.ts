export const ORACLE_PRICE_SCALE = 1_000_000_000;

export function oraclePriceToUsd(raw: number | string): number {
  return Number(raw) / ORACLE_PRICE_SCALE;
}

export function usdToOraclePrice(usd: number): number {
  return Math.floor(usd * ORACLE_PRICE_SCALE);
}

export function dusdcToUsd(raw: number | string): number {
  return Number(raw) / 1_000_000;
}
