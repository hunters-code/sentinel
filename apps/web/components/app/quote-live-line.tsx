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
    <p className="text-balance font-display text-[clamp(1.25rem,3.5vw,1.75rem)] leading-snug">
      If {symbol} drops below <strong className="text-sui-blue-bright">{usd(strike)}</strong> before{" "}
      <strong className="text-sui-blue-bright">{time}</strong>, you get{" "}
      <strong className="text-sui-blue-bright">{usd(coverage)}</strong>.
    </p>
  );
}
