import { formatExpiryUtc } from "@/lib/use-cover-quote";
import { usdAuto } from "@/lib/format";

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
  const { time } = formatExpiryUtc(expiryMs);

  return (
    <p
      className="text-balance text-[clamp(1.25rem,3.5vw,1.75rem)] leading-snug"
      style={{ fontFamily: "var(--font-display)" }}
    >
      If {symbol} drops below{" "}
      <strong style={{ color: "var(--sui-blue-bright)" }}>{usdAuto(strike)}</strong> before{" "}
      <strong style={{ color: "var(--sui-blue-bright)" }}>{time}</strong>, you get{" "}
      <strong style={{ color: "var(--sui-blue-bright)" }}>{usdAuto(coverage)}</strong>.
    </p>
  );
}
