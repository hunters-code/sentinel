import type { CoverQuote } from "@/lib/use-cover-quote";
import { centsPerContract, usd } from "@/lib/format";
import { Muted } from "@/components/app/ui/muted";

export function PricingBreakdown({
  quote,
  live,
  loading,
}: {
  quote: CoverQuote;
  live: boolean;
  loading: boolean;
}) {
  const fairCents = centsPerContract(quote.fair, quote.coverage);
  const spreadCents = centsPerContract(quote.spreadAmt, quote.coverage);
  const effectivePct = quote.coverage > 0 ? (quote.premium / quote.coverage) * 100 : 0;

  return (
    <details
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--sui-line)", background: "rgba(255,255,255,0.02)" }}
    >
      <summary
        className="cursor-pointer text-sm font-medium list-none [&::-webkit-details-marker]:hidden"
        style={{ color: "var(--sui-white)" }}
      >
        How is this priced?
      </summary>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span style={{ color: "var(--sui-steel)" }}>{live ? "Premium" : "Estimated premium"}</span>
          <strong style={{ color: "var(--sui-white)" }}>{usd(quote.premium)}</strong>
        </div>

        {loading && !live ? (
          <Muted>Confirming live protocol price…</Muted>
        ) : (
          <>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: "var(--sui-steel)" }}>Fair value</span>
                <span style={{ color: "var(--sui-white)" }}>{fairCents.toFixed(2)}¢ per $1 payout</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: "var(--sui-steel)" }}>Spread</span>
                <span style={{ color: "var(--sui-white)" }}>{spreadCents.toFixed(2)}¢ per $1 payout</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: "var(--sui-steel)" }}>Effective rate</span>
                <span style={{ color: "var(--sui-white)" }}>{effectivePct.toFixed(2)}% of coverage</span>
              </div>
              {quote.floorBinds && (
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--sui-steel)" }}>Protocol minimum</span>
                  <span style={{ color: "var(--sui-white)" }}>1.00¢ per $1 payout</span>
                </div>
              )}
            </div>
            <Muted>
              {live
                ? "Live ask from DeepBook Predict for this cover. Parametric payout — not regulated insurance."
                : "Estimate from the SVI surface until the protocol confirms the ask."}
              {quote.floorBinds
                ? " The 1% minimum premium applies because fair value is below the protocol floor."
                : null}
            </Muted>
          </>
        )}
      </div>
    </details>
  );
}
