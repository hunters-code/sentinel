// Abramowitz & Stegun approximation, max error < 7.5e-8
function normalCdf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const y = 1 - poly * Math.exp((-x * x) / 2);
  return x >= 0 ? y : 1 - y;
}

export interface SviRawParams {
  a: number;
  b: number;
  rho: number;
  m: number;
  sigma: number;
}

/** Compute total variance w(k) from raw SVI params. */
export function sviVariance(k: number, p: SviRawParams): number {
  const inner = Math.sqrt((k - p.m) ** 2 + p.sigma ** 2);
  return Math.max(0, p.a + p.b * (p.rho * (k - p.m) + inner));
}

/**
 * Fair price for a DOWN binary (digital put) via the SVI volatility surface.
 * Returns the risk-neutral probability that S_T < K at expiry.
 *
 * spot and strike are both in USD.
 * expiryMs is epoch-ms.
 */
export function fairFromSvi(
  spot: number,
  strike: number,
  expiryMs: number,
  params: SviRawParams,
): number {
  const T = Math.max(expiryMs - Date.now(), 60_000) / (365.25 * 24 * 3_600_000); // years
  const k = Math.log(strike / spot); // ln(K/F), negative for OTM put (K < S)
  const w = sviVariance(k, params);
  if (w <= 0 || !Number.isFinite(w)) return 0.001;
  // d2 = (ln(F/K) - 0.5*w) / sqrt(w)  [since σ*sqrt(T) = sqrt(w)]
  const d2 = (-k - 0.5 * w) / Math.sqrt(w);
  // Digital put = N(-d2): prob that S_T < K
  return Math.max(0.001, Math.min(0.999, normalCdf(-d2)));
}
