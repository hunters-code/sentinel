const STACK_ITEMS = [
  {
    label: "Predict package",
    value: "Live testnet deployment",
    detail: "DeepBook Predict on Sui testnet — mints and redeems settle on-chain.",
  },
  {
    label: "Quote asset",
    value: "dUSDC only for MVP",
    detail: "Premiums and payouts denominated in dUSDC; no fiat on-ramp in v1.",
  },
  {
    label: "Settlement source",
    value: "BTC oracle expiry print",
    detail: "Parametric payout triggers on the oracle settlement price at expiry.",
  },
  {
    label: "Keeper action",
    value: "Permissionless redeem path",
    detail: "Payout claims run without Sentinel — verifiable by anyone.",
  },
] as const;

export function LandingStackSection() {
  return (
    <section id="stack" className="border-t border-white/10 bg-sui-navy px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-sui-blue-bright">Built on Sui testnet infrastructure</p>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(2rem,5vw,3.1rem)] font-medium leading-[1.04] tracking-[-0.03em] text-balance">
              On-chain pricing, on-chain settlement, transparent by default.
            </h2>
          </div>
          <p className="max-w-[62ch] text-[1.02rem] leading-[1.7] text-sui-steel text-pretty">
            Sentinel uses live oracle and SVI data from Predict. Quotes are refreshed before signing,
            settlement is event-driven, and payout claims are permissionless so the flow remains verifiable
            end to end.
          </p>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-sui-blue-bright/25 bg-sui-blue-bright/25 sm:grid-cols-2">
          {STACK_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={`bg-black/40 p-6 md:p-7 ${index === 0 ? "sm:col-span-2 sm:bg-black/55" : ""}`}
            >
              <dt className="text-sm font-medium text-sui-steel">{item.label}</dt>
              <dd className="mt-2 font-display text-[1.05rem] font-medium leading-[1.4] text-white">
                {item.value}
              </dd>
              <dd className="mt-2 max-w-[48ch] text-[0.9rem] leading-[1.55] text-sui-steel">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
