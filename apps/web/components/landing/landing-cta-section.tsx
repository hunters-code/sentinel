import { QuoteCtaButton } from "@/components/header/quote-cta-button";

export function LandingCtaSection() {
  return (
    <section className="border-t border-[var(--color-chrome-border)] bg-sui-black px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-container flex-col items-start justify-between gap-8 rounded-[1.75rem] border border-sui-blue-bright/25 bg-[linear-gradient(135deg,rgba(41,141,255,0.14)_0%,rgba(0,20,40,0.82)_45%,rgba(0,0,0,0.94)_100%)] p-8 md:flex-row md:items-end md:p-10">
        <div>
          <h2 className="max-w-[16ch] text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-balance">
            Insure the next move before it happens.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[1rem] leading-[1.65] text-content-secondary text-pretty">
            Parametric, all-or-nothing payout at oracle settlement. Coverage window follows expiry on
            your quote — not a regulated insurance product.
          </p>
        </div>
        <QuoteCtaButton href="/app" quiet className="w-full shrink-0 md:w-auto" />
      </div>
    </section>
  );
}
