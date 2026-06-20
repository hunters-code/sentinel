const STEPS = [
  {
    title: "Set your coverage",
    body: "We size payout from your holdings and a default 2% trigger below spot.",
  },
  {
    title: "See honest premium math",
    body: "Quote shows fair value, spread, and protocol floor before you commit.",
  },
  {
    title: "Receive your receipt",
    body: "Track live price, trigger level, and settlement state until expiry.",
  },
] as const;

export function LandingHowSection() {
  return (
    <section id="how" className="border-t border-white/10 bg-sui-black px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-container">
        <div className="max-w-[40rem]">
          <h2 className="max-w-[18ch] text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.03em] text-balance">
            Buy coverage in one tap, settle automatically on expiry.
          </h2>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-white/84 text-pretty">
            Enter how much crypto you hold, review your trigger and premium, then sign once. If the
            settlement price lands at or below your trigger, payout is sent to your wallet automatically.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5 text-sm text-sui-steel">
            <li className="rounded-full border border-sui-blue-bright/45 bg-sui-blue-bright/10 px-3 py-1 text-sui-blue-bright">
              Parametric payout
            </li>
            <li className="rounded-full border border-white/15 px-3 py-1">One signature</li>
            <li className="rounded-full border border-white/15 px-3 py-1">No claims paperwork</li>
          </ul>
        </div>

        <ol className="relative m-0 mt-16 list-none p-0 md:mt-20 lg:mt-24">
          <div
            className="pointer-events-none absolute inset-x-0 top-4 hidden h-px bg-white/12 md:block"
            aria-hidden
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {STEPS.map((step, index) => (
              <li key={step.title} className="min-w-0">
                <div className="flex gap-4 md:flex-col md:gap-5">
                  <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sui-blue-bright/35 bg-sui-black font-display text-sm font-medium text-sui-blue-bright md:h-9 md:w-9">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5 md:pt-0">
                    <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-white md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-[0.98rem] leading-[1.6] text-sui-steel md:mt-3">
                      {step.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}
