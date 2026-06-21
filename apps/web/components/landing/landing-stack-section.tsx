const COVERAGE_POINTS = [
  {
    label: "What you buy",
    value: "Crash coverage until expiry",
    detail: "A fixed stablecoin payout if settlement prints at or below your trigger.",
  },
  {
    label: "Your trigger",
    value: "Default 2% below spot",
    detail: "Exact strike and expiry time appear on the quote before you sign.",
  },
  {
    label: "Your premium",
    value: "Honest market ask",
    detail: "Fair value, spread, and any protocol floor — shown before you commit.",
  },
  {
    label: "Your payout",
    value: "Automatic at settlement",
    detail: "If the trigger hits, payout is claimed for you — no paperwork to file.",
  },
] as const;

const BUILDER_DETAILS = [
  {
    term: "Pricing source",
    detail: "Live oracle and vol-surface data from DeepBook Predict on Sui testnet.",
  },
  {
    term: "Settlement asset",
    detail: "Premiums and payouts in dUSDC on testnet.",
  },
  {
    term: "Payout path",
    detail: "Permissionless keeper claims after oracle settlement — verifiable on-chain.",
  },
] as const;

export function LandingStackSection() {
  return (
    <section id="stack" className="border-t border-[var(--color-chrome-border)] bg-sui-navy px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-sui-blue-bright">Built on Sui</p>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(2rem,5vw,3.1rem)] font-medium leading-[1.04] tracking-[-0.03em] text-balance">
              Priced from live markets, settled on-chain.
            </h2>
          </div>
          <p className="max-w-[62ch] text-[1.02rem] leading-[1.7] text-sui-steel text-pretty">
            Quotes refresh before you sign. Settlement follows the oracle expiry on your receipt — not a
            fixed duration from purchase.
          </p>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-sui-blue-bright/25 bg-sui-blue-bright/25 sm:grid-cols-2">
          {COVERAGE_POINTS.map((item, index) => (
            <div
              key={item.label}
              className={`bg-black/40 p-6 md:p-7 ${index === 0 ? "sm:col-span-2 sm:bg-black/55" : ""}`}
            >
              <dt className="text-sm font-medium text-sui-steel">{item.label}</dt>
              <dd className="mt-2 font-display text-[1.05rem] font-medium leading-[1.4] text-content-primary">
                {item.value}
              </dd>
              <dd className="mt-2 max-w-[48ch] text-[0.9rem] leading-[1.55] text-sui-steel">{item.detail}</dd>
            </div>
          ))}
        </dl>

        <details className="group mt-8 rounded-2xl border border-border-neutral bg-[var(--color-background-inverse-bleedthrough-weak)] px-6 py-5 open:pb-6">
          <summary className="cursor-pointer list-none font-display text-base font-medium text-content-primary marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              For builders
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
                className="opacity-60 transition-transform duration-200 group-open:rotate-180"
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
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            {BUILDER_DETAILS.map((item) => (
              <div key={item.term}>
                <dt className="text-sm font-medium text-sui-steel">{item.term}</dt>
                <dd className="mt-2 text-[0.9rem] leading-[1.55] text-content-secondary">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}
