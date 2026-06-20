import Link from "next/link";

export function LandingCtaSection() {
  return (
    <section className="border-t border-white/10 bg-sui-black px-6 py-20 md:px-10">
      <div className="mx-auto flex w-full max-w-container flex-col items-start justify-between gap-8 rounded-[1.75rem] border border-sui-blue-bright/25 bg-[linear-gradient(135deg,rgba(41,141,255,0.18)_0%,rgba(0,20,40,0.85)_45%,rgba(0,0,0,0.92)_100%)] p-8 md:flex-row md:items-end md:p-10">
        <div>
          <h2 className="max-w-[16ch] text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-balance">
            Insure the next move before it happens.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[1rem] leading-[1.65] text-white/82 text-pretty">
            Parametric, all-or-nothing payout based on oracle settlement. Not a regulated insurance
            product.
          </p>
        </div>
        <Link
          href="/app"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-sui-blue-bright px-7 py-3 font-display text-[0.98rem] font-medium tracking-[-0.01em] text-sui-black no-underline transition-opacity duration-200 hover:opacity-90"
        >
          Get a quote
        </Link>
      </div>
    </section>
  );
}
