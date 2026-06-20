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
    <details className="group border-t border-separator pt-4">
      <summary className="cursor-pointer list-none text-sm font-medium text-content-primary [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          How is this priced?
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className="opacity-50 transition-transform duration-200 group-open:rotate-180"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-content-secondary">{live ? "Premium" : "Estimated premium"}</span>
          <strong className="text-content-primary">{usd(quote.premium)}</strong>
        </div>

        {loading && !live ? (
          <Muted>Confirming live protocol price…</Muted>
        ) : (
          <>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-content-secondary">Fair value</span>
                <span className="text-content-primary">{fairCents.toFixed(2)}¢ per $1 payout</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-content-secondary">Spread</span>
                <span className="text-content-primary">{spreadCents.toFixed(2)}¢ per $1 payout</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-content-secondary">Effective rate</span>
                <span className="text-content-primary">{effectivePct.toFixed(2)}% of coverage</span>
              </div>
              {quote.floorBinds && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-content-secondary">Protocol minimum</span>
                  <span className="text-content-primary">1.00¢ per $1 payout</span>
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
