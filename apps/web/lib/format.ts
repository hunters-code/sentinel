export const usd = (n: number, max = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  }).format(n);

export const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export const centsPerContract = (amountUsd: number, coverageUsd: number) =>
  coverageUsd > 0 ? (amountUsd / coverageUsd) * 100 : 0;
