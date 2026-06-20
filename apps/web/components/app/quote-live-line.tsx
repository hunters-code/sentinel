import { formatExpiry } from "@/lib/use-cover-quote";
import { usd } from "@/lib/format";

export function QuoteLiveLine({
  strike,
  expiryMs,
  coverage,
  symbol = "BTC",
}: {
  strike: number;
  expiryMs: number;
  coverage: number;
  symbol?: string;
}) {
  const { time } = formatExpiry(expiryMs);

  return (
    <p className="text-balance font-display text-[clamp(1.375rem,4vw,2rem)] font-medium leading-[1.2] tracking-[-0.02em]">
      If {symbol} settles below <strong className="text-sui-blue-bright">{usd(strike)}</strong> before{" "}
      <strong className="text-sui-blue-bright">{time}</strong>, you get{" "}
      <strong className="text-sui-blue-bright">{usd(coverage)}</strong>.
    </p>
  );
}
