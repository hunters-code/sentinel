import Link from "next/link";
import { BtcChartVisual } from "@/components/landing/btc-chart";
import { LandingHeader } from "@/components/landing/landing-header";
import { Marquee } from "@/components/landing/marquee";
import { HeroHeadline } from "@/components/landing/hero-headline";

const FLOW_STEPS = [
  {
    step: "Quote",
    detail:
      "Tell us your BTC holdings. We size coverage to your mark-to-market loss down to a −2% trigger and show the protocol ask.",
  },
  {
    step: "Receipt",
    detail:
      "Live BTC price line with your trigger drawn on it. Status flips from ACTIVE to PAID or EXPIRED the moment the oracle settles.",
  },
  {
    step: "Payout",
    detail:
      "Keeper claims on settlement. One tap withdraws dUSDC to your wallet. Zero action needed if you're out of the money.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="landing min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <LandingHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-16 pt-28 md:px-10 md:pb-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(41,141,255,0.22) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 90% 80%, rgba(0,46,106,0.6) 0%, transparent 50%)",
            }}
          />

          <div className="relative mx-auto grid w-full max-w-container gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-6 text-sm" style={{ color: "var(--sui-blue-bright)" }}>
                Crash insurance · one premium · paid automatically
              </p>

              <HeroHeadline />

              <p
                className="mt-8 max-w-lg text-lg leading-relaxed text-pretty md:text-xl"
                style={{ color: "var(--sui-steel)" }}
              >
                How much BTC do you hold? We quote one premium and size your payout if Bitcoin
                drops to your trigger before expiry. One signature — no strike ladder, no claim to
                file.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/app"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium no-underline transition-opacity hover:opacity-90"
                  style={{ background: "var(--sui-blue)", color: "#000" }}
                >
                  Get a quote
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href="#how"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border px-7 py-3.5 text-base no-underline transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--sui-line)", color: "var(--sui-white)" }}
                >
                  How it works
                </a>
              </div>
            </div>

            <div className="lg:pb-4">
              <BtcChartVisual />
            </div>
          </div>
        </section>

        <Marquee />

        {/* Value prop — asymmetric */}
        <section className="px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto grid max-w-container gap-16 lg:grid-cols-[0.45fr_0.55fr] lg:gap-24">
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Insurance you can
              <br />
              <span style={{ color: "var(--sui-blue-bright)" }}>understand in seconds.</span>
            </h2>
            <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--sui-steel)" }}>
              <p>
                You buy crash insurance the way you expect: one premium, a fixed payout if BTC hits
                your trigger, and a receipt that tracks settlement. Premium math comes from the live
                volatility surface — never a black box.
              </p>
              <p>
                Only DeepBook Predict on Sui can price arbitrary strikes against a vol surface and
                roll sub-hour expiries — with a vault always on the other side.
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

        {/* How it works */}
        <section id="how" className="border-t px-6 py-24 md:px-10 md:py-32" style={{ borderColor: "var(--sui-line)" }}>
          <div className="mx-auto max-w-container">
            <h2
              className="mb-16 max-w-2xl text-[clamp(2rem,4.5vw,3rem)] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three screens. One signature. Settled in under an hour.
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
                  <p className="mb-4 text-sm font-medium" style={{ color: "var(--sui-blue)" }}>
                    {i + 1}. {item.step}
                  </p>
                  <p className="leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                    {item.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Stack */}
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
              Built on DeepBook Predict · Sui testnet
            </h2>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                <p>
                  A rolling BTC oracle prices sub-hour expiries in real time. Your premium reflects
                  fair value from the SVI volatility surface plus the protocol spread — shown before
                  you sign.
                </p>
                <p>
                  When the oracle settles, a keeper claims your payout automatically. Withdraw dUSDC
                  to your wallet in one tap.
                </p>
              </div>
              <p className="text-sm leading-relaxed lg:pt-2" style={{ color: "var(--sui-steel)" }}>
                Read paths split between predict-server for render data and the Sui event stream for
                live settlement flips — the architecture recommended by the protocol.
              </p>
            </div>
          </div>
        </section>

        {/* Example quote */}
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
                <span style={{ color: "var(--sui-blue-bright)" }}>$98,000</span> before expiry,
                you get <span style={{ color: "var(--sui-blue-bright)" }}>$1,000</span>.
              </p>
              <p className="mt-6 text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
                Premium ~$14
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--sui-steel)" }}>
                0.5 BTC held · ~1.4% of coverage · live ask from protocol
              </p>
            </div>

            <div>
              <h2
                className="mb-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                One input.
                <br />
                One button.
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--sui-steel)" }}>
                No strike ladder. No jargon. The user who feels FOMC risk at 2pm doesn&apos;t want
                an options desk — they want a receipt and a countdown.
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

        {/* Disclosures */}
        <section
          id="disclosures"
          className="border-t px-6 py-20 md:px-10"
          style={{ borderColor: "var(--sui-line)" }}
        >
          <div className="mx-auto max-w-container">
            <h2 className="mb-8 text-xl" style={{ fontFamily: "var(--font-display)" }}>
              Plain disclosures
            </h2>
            <ul
              className="grid gap-4 text-sm leading-relaxed md:grid-cols-2 md:gap-x-12 md:gap-y-3"
              style={{ color: "var(--sui-steel)" }}
            >
              <li>Parametric payout — all-or-nothing at the settlement print, not indemnity insurance.</li>
              <li>Coverage window is the oracle expiry, not a literal 60 minutes from purchase.</li>
              <li>Counterparty is the PLP vault; mints can be rejected at the exposure cap.</li>
              <li>Minimum premium is 1% of coverage due to the protocol ask floor.</li>
              <li>Not regulated insurance — an on-chain options position with insurance framing.</li>
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="px-6 py-24 text-center md:px-10 md:py-32"
          style={{ background: "linear-gradient(180deg, var(--sui-black) 0%, var(--sui-blue-darker) 100%)" }}
        >
          <p className="mb-4 text-sm" style={{ color: "var(--sui-steel)" }}>
            Sui Overflow hackathon · testnet only · not financial advice
          </p>
          <h2
            className="mx-auto max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1.05]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Insure your BTC
            <br />
            for the next hour.
          </h2>
          <Link
            href="/app"
            className="mt-10 inline-flex min-h-11 items-center rounded-full px-8 py-4 text-base font-medium no-underline transition-opacity hover:opacity-90"
            style={{ background: "var(--sui-white)", color: "var(--sui-black)" }}
          >
            Get a quote
          </Link>
        </section>
      </main>

      <footer
        className="border-t px-6 py-12 md:px-10"
        style={{ borderColor: "var(--sui-line)" }}
      >
        <div className="mx-auto grid max-w-container gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-sm font-medium" style={{ fontFamily: "var(--font-display)" }}>
              Sentinel
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "var(--sui-steel)" }}>
              One-hour parametric crash insurance for BTC, built on DeepBook Predict.
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
    </div>
  );
}
