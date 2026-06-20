export const usd = (n: number, max = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  }).format(n);

/** Currency with precision chosen by magnitude — for prices that span BTC ($100k)
 *  to SUI ($1.2). Big numbers stay whole; small ones keep cents/sub-cents. */
export const usdAuto = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1000) return usd(n, 0);
  if (abs >= 1) return usd(n, 2);
  return usd(n, 4);
};

export const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export const centsPerContract = (amountUsd: number, coverageUsd: number) =>
  coverageUsd > 0 ? (amountUsd / coverageUsd) * 100 : 0;
