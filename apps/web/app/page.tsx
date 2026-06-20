import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { Marquee } from "@/components/landing/marquee";
import { Reveal } from "@/components/reveal";
import { SentinelLogo } from "@/components/sentinel-logo";

const FLOW_STEPS = [
  {
    step: "Quote",
    detail:
      "Tell us how much you hold. We size your payout to the loss you'd take on a 2% drop and show the price up front — no haggling, no hidden fees.",
  },
  {
    step: "Receipt",
    detail:
      "Watch your coverage live. A price line tracks your trigger, and your status flips from active to paid the instant the market settles.",
  },
  {
    step: "Payout",
    detail:
      "Drop hits? You get paid — no claim to file. One tap moves the money to your wallet. Nothing to do if the market holds.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--sui-root-bg)] font-[var(--font-body)] text-[var(--sui-white)] [--tw-ring-offset-color:#000] antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <LandingHeader />

      <main id="main-content">
        <LandingHero />

        {false && (
          <>
            <Marquee />

            <section className="px-6 py-24 md:px-10 md:py-32">
              <div className="mx-auto grid max-w-container gap-16 lg:grid-cols-[0.45fr_0.55fr] lg:gap-24">
                <h2
                  className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.08]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Crash insurance,
                  <br />
                  <span style={{ color: "var(--sui-blue-bright)" }}>minus the fine print.</span>
                </h2>
                <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                  <p>
                    It works the way you&apos;d expect insurance to: one premium, a fixed payout if your coin
                    hits the trigger, and a live receipt that tracks your coverage. The price comes
                    straight from the market — never a number we make up.
                  </p>
                  <p>
                    It runs on DeepBook Predict on Sui, the only thing fast enough to price this kind of
                    protection by the minute — with a vault always ready to pay you out.
                  </p>
                  <details className="group rounded-xl border p-5" style={{ borderColor: "var(--sui-line)" }}>
                    <summary
                      className="cursor-pointer text-base font-medium list-none [&::-webkit-details-marker]:hidden"
                      style={{ color: "var(--sui-white)" }}
                    >
                      <span className="inline-flex items-center gap-2">
                        For builders
                        <span
                          className="text-sm transition-transform group-open:rotate-90"
                          style={{ color: "var(--sui-steel)" }}
                          aria-hidden
                        >
                          →
                        </span>
                      </span>
                    </summary>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                      <p>
                        Under the hood, a Sentinel policy is one well-priced{" "}
                        <code
                          className="rounded px-1.5 py-0.5 text-sm"
                          style={{ background: "rgba(255,255,255,0.08)", color: "var(--sui-white)" }}
                        >
                          predict::mint
                        </code>{" "}
                        of a deep out-of-the-money DOWN binary. Premium is previewed via{" "}
                        <code
                          className="rounded px-1.5 py-0.5 text-sm"
                          style={{ background: "rgba(255,255,255,0.08)", color: "var(--sui-white)" }}
                        >
                          get_trade_amounts
                        </code>{" "}
                        before you sign.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </section>

            <section id="how" className="border-t px-6 py-24 md:px-10 md:py-32" style={{ borderColor: "var(--sui-line)" }}>
              <div className="mx-auto max-w-container">
                <h2
                  className="mb-16 max-w-2xl text-[clamp(2rem,4.5vw,3rem)] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  One tap to buy. Paid the second it settles.
                </h2>

                <ol className="grid gap-px md:grid-cols-3" style={{ background: "var(--sui-line)" }}>
                  {FLOW_STEPS.map((item, i) => (
                    <li
                      key={item.step}
                      className="flex flex-col p-8 md:p-10"
                      style={{
                        background: i === 1 ? "var(--sui-blue-darker)" : "var(--sui-black)",
                      }}
                    >
                      <Reveal style={{ transitionDelay: `${i * 90}ms` }}>
                        <p className="mb-4 text-sm font-medium" style={{ color: "var(--sui-blue)" }}>
                          {i + 1}. {item.step}
                        </p>
                        <p className="leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                          {item.detail}
                        </p>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section
              id="stack"
              className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32"
              style={{ background: "var(--sui-blue-darker)" }}
            >
              <div
                className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
                style={{ background: "var(--sui-blue)" }}
              />

              <div className="relative mx-auto max-w-container">
                <h2
                  className="mb-10 max-w-2xl text-[clamp(2rem,4.5vw,3rem)] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Powered by Sui. Priced by the market.
                </h2>

                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                    <p>
                      A live price feed sets a fair price for every coverage window in real time. What
                      you pay reflects the real market plus a small spread — shown before you tap.
                    </p>
                    <p>
                      The moment your window closes in your favor, the payout fires on its own. Move your
                      money to your wallet in one tap.
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed lg:pt-2" style={{ color: "var(--sui-steel)" }}>
                    Everything settles on-chain on Sui, so payouts don&apos;t wait on us — the protocol pays
                    you the instant your window settles in the money.
                  </p>
                </div>
              </div>
            </section>

            <section className="px-6 py-24 md:px-10 md:py-32">
              <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div
                  className="rounded-2xl p-8 md:p-12"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--sui-line)",
                  }}
                >
                  <p className="mb-2 text-sm" style={{ color: "var(--sui-steel)" }}>
                    Example at BTC $100,000 · trigger −2%
                  </p>
                  <p
                    className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    If BTC drops below{" "}
                    <span style={{ color: "var(--sui-blue-bright)" }}>$98,000</span> before the timer&apos;s
                    up, you get <span style={{ color: "var(--sui-blue-bright)" }}>$1,000</span>.
                  </p>
                  <p className="mt-6 text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
                    Premium ~$14
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--sui-steel)" }}>
                    0.5 BTC covered · about 1.4% of your payout · live market price
                  </p>
                </div>

                <div>
                  <h2
                    className="mb-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    One input.
                    <br />
                    One tap.
                  </h2>
                  <p className="text-lg leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                    No strike ladders. No options desk. When you feel a crash coming, you don&apos;t want
                    a trading terminal — you want a receipt and a countdown.
                  </p>
                  <Link
                    href="/app"
                    className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium no-underline transition-opacity hover:opacity-90"
                    style={{ background: "var(--sui-blue)", color: "#000" }}
                  >
                    Get a quote
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </section>

            <section
              id="disclosures"
              className="border-t px-6 py-20 md:px-10"
              style={{ borderColor: "var(--sui-line)" }}
            >
              <div className="mx-auto max-w-container">
                <h2 className="mb-8 text-xl" style={{ fontFamily: "var(--font-display)" }}>
                  The honest fine print
                </h2>
                <ul
                  className="grid gap-4 text-sm leading-relaxed md:grid-cols-2 md:gap-x-12 md:gap-y-3"
                  style={{ color: "var(--sui-steel)" }}
                >
                  <li>All-or-nothing payout — you get the full amount or nothing, based on the settlement price. Not claim-based insurance.</li>
                  <li>Your coverage lasts until the price window closes, not a literal 60 minutes from when you buy.</li>
                  <li>A vault on Sui pays you out. In rare cases when it&apos;s at its limit, a purchase can be turned down.</li>
                  <li>The smallest premium is 1% of your payout — a floor set by the protocol.</li>
                  <li>Not regulated insurance — it&apos;s an on-chain options position with insurance framing.</li>
                </ul>
              </div>
            </section>

            <section
              className="px-6 py-24 text-center md:px-10 md:py-32"
              style={{ background: "linear-gradient(180deg, var(--sui-black) 0%, var(--sui-blue-darker) 100%)" }}
            >
              <h2
                className="mx-auto max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1.05]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get covered
                <br />
                before the next crash.
              </h2>
              <Link
                href="/app"
                className="mt-10 inline-flex min-h-11 items-center rounded-full px-8 py-4 text-base font-medium no-underline transition-opacity hover:opacity-90"
                style={{ background: "var(--sui-white)", color: "var(--sui-black)" }}
              >
                Get a quote
              </Link>
            </section>

            <footer
              className="border-t px-6 py-12 md:px-10"
              style={{ borderColor: "var(--sui-line)" }}
            >
              <div className="mx-auto grid max-w-container gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <SentinelLogo size={28} />
                    <p className="text-sm font-medium" style={{ fontFamily: "var(--font-display)" }}>
                      Sentinel
                    </p>
                  </div>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                    Crash insurance for your crypto, paid automatically. Built on DeepBook Predict.
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium" style={{ color: "var(--sui-white)" }}>
                    Product
                  </p>
                  <ul className="space-y-2 text-sm" style={{ color: "var(--sui-steel)" }}>
                    <li>
                      <Link href="/app" className="no-underline hover:text-white">
                        Get a quote
                      </Link>
                    </li>
                    <li>
                      <a href="#how" className="no-underline hover:text-white">
                        How it works
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium" style={{ color: "var(--sui-white)" }}>
                    Ecosystem
                  </p>
                  <ul className="space-y-2 text-sm" style={{ color: "var(--sui-steel)" }}>
                    <li>
                      <a
                        href="https://www.sui.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:text-white"
                      >
                        Sui
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.sui.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:text-white"
                      >
                        Sui docs
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
