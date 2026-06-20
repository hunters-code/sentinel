export function LandingHowSection() {
  return (
    <section id="how" className="relative border-t border-white/10 bg-black/45 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid w-full max-w-container gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <h2 className="max-w-[18ch] text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.03em] text-balance">
            Buy coverage in one tap, settle automatically on expiry.
          </h2>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-white/84 text-pretty">
            Enter how much crypto you hold, review your trigger and premium, then sign once. If the
            settlement price lands at or below your trigger, payout is claimed to your manager automatically.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-sui-steel">
            <span className="rounded-full border border-sui-blue-bright/45 bg-sui-blue-bright/10 px-3 py-1 text-sui-blue-bright">
              Parametric payout
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">One signature</span>
            <span className="rounded-full border border-white/15 px-3 py-1">No claims paperwork</span>
          </div>
        </div>
        <ol className="grid gap-4">
          {[
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
          ].map((step) => (
            <li key={step.title} className="rounded-2xl border border-white/12 bg-white/[0.035] p-6">
              <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-white">{step.title}</h3>
              <p className="mt-3 max-w-[52ch] text-[0.98rem] leading-[1.6] text-sui-steel">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
