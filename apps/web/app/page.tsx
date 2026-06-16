"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { ArrowRight, ChevronDown } from "lucide-react";
import { DEFAULT_TRIGGER_PCT } from "@sentinel/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBadge,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarFill,
  HeroReveal,
  MotionChip,
  MotionNav,
  PopCard,
  PulseWrap,
  Reveal,
  Stagger,
  StaggerItem,
  StampWiggle,
  ValuePop,
} from "@/components/reveal";
import { cn } from "@/lib/cn";

const DEMO_SPOT = 100_000;
const FAIR_RATE = 0.01;
const SPREAD_RATE = 0.004;
const EFFECTIVE_RATE = FAIR_RATE + SPREAD_RATE;
const PRESETS = [0.05, 0.5, 2];

const usd = (n: number, max = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  }).format(n);

const STEPS = [
  {
    num: "01",
    title: "How much?",
    body: "One field. Your BTC stack sizes coverage, trigger, and premium. No ladder. No expiry picker.",
  },
  {
    num: "02",
    title: "Pay the ask",
    body: "Premium comes from the protocol — SVI fair value plus spread. We show every line. Floor is 1% of coverage.",
  },
  {
    num: "03",
    title: "Collect",
    body: "BTC at or below your trigger at settlement? Keeper sends dUSDC. No form. No phone tree.",
  },
];

const FEATURES = [
  { mark: "$", title: "Line by line", body: "Fair value, spread, floor — on screen, not buried." },
  { mark: "#", title: "The receipt", body: "Trigger, coverage, premium, status. One card. Screenshot it." },
  { mark: "!", title: "5% slippage cap", body: "We re-check right before you sign. Drifts too far? Transaction stops." },
];

const REFRAMES: [string, string][] = [
  ["DOWN binary, deep OTM", "Crash cover"],
  ["Contract qty", "Your payout"],
  ["Strike", "Your floor"],
  ["Ask × size", "Your premium"],
];

const DISCLOSURES: [string, string][] = [
  ["All or nothing", "Fixed payout at settlement. Deeper crash = same check. Bounce before expiry = $0."],
  ["Oracle hour, not wall clock", "Window runs to oracle expiry (~30–60 min). Exact time is on your quote and receipt."],
  ["Vault takes the other side", "Payout comes from a liquidity vault. Full vault = no new policies."],
  ["1% minimum premium", "Protocol won't mint below 1% of coverage. We flag it when the floor binds."],
  ["Not regulated insurance", "On-chain options position with insurance words. Framing, not a policy from Hartford."],
  ["Your BTC stays put", "We cover price exposure. Coins never leave your wallet."],
];

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-container px-5 md:px-10", className)}>
      {children}
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <CardBadge variant="yellow" className="mb-3 shadow-brutal">
      {children}
    </CardBadge>
  );
}

function MarqueeStrip() {
  const line = "ONE HOUR CRASH COVER · DEEPBOOK PREDICT · SUI TESTNET · ";
  return (
    <div className="overflow-hidden border-y-4 border-black bg-yellow-200 py-3" aria-hidden>
      <div className="flex animate-marquee whitespace-nowrap font-base text-sm md:text-base">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="px-6">
            {line.repeat(2)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [btc, setBtc] = useState("0.5");
  const [ready, setReady] = useState(false);

  const quote = useMemo(() => {
    const held = Math.max(0, Number(btc) || 0);
    const strike = DEMO_SPOT * (1 - DEFAULT_TRIGGER_PCT);
    const coverage = held * (DEMO_SPOT - strike);
    const premium = coverage * EFFECTIVE_RATE;
    return {
      held,
      strike,
      coverage,
      premium,
      fair: coverage * FAIR_RATE,
      spread: coverage * SPREAD_RATE,
    };
  }, [btc]);

  const valid = quote.coverage > 0;

  return (
    <div className="min-h-screen font-base text-foreground">
      <MotionNav className="sticky top-0 z-50 border-b-4 border-black bg-white shadow-nav">
        <Shell className="flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-heading text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-base border-2 border-black bg-cyan-200 shadow-brutal">
              S
            </span>
            SENTINEL
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
            {[
              ["#how", "How"],
              ["#pricing", "Math"],
              ["#why", "Why"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-base border-2 border-transparent px-2.5 py-1.5 text-xs font-base hover:border-black hover:bg-lime-200"
              >
                {label}
              </a>
            ))}
          </nav>
          <Link href="/app" className="shrink-0">
            <Button variant="yellow" size="sm">
              Open app
            </Button>
          </Link>
        </Shell>
      </MotionNav>

      {/* Hero */}
      <section className="border-b-4 border-black bg-pink-200 py-10 md:py-16" id="top">
        <Shell className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <HeroReveal delay={0.05}>
              <SectionTag>SUB-HOUR ORACLE · −2% FLOOR</SectionTag>
            </HeroReveal>

            <HeroReveal delay={0.12}>
              <h1 className="max-w-[15ch] text-4xl leading-tight md:text-5xl">
                BTC dumps.{" "}
                <span className="rounded-base border-2 border-black bg-cyan-200 px-1.5 box-decoration-clone">
                  You still get paid.
                </span>
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.2}>
              <p className="mt-5 max-w-md text-base text-foreground/80">
                Type your stack. Get one price. Sign once. Hit your floor before the oracle closes —
                dUSDC lands in your wallet.
              </p>
            </HeroReveal>

            <HeroReveal delay={0.36} x={20}>
              <Card className="mt-8 ml-auto hidden max-w-[280px] rotate-[1.5deg] lg:block" aria-hidden>
                <CardHeader className="py-3">
                  <CardBadge variant="neutral">RECEIPT #0041</CardBadge>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm text-foreground/70">0.5 BTC · floor $98,000</p>
                  <p className="mt-1 font-heading text-3xl tnum">$1,000</p>
                  <StampWiggle className="mt-3 inline-block rotate-[-3deg]">
                    <CardBadge variant="lime">PAID</CardBadge>
                  </StampWiggle>
                </CardContent>
              </Card>
            </HeroReveal>
          </div>

          <HeroReveal x={40} delay={0.18}>
            <Card id="quote" className="w-full">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardBadge variant="neutral">COVERAGE FORM</CardBadge>
                <StampWiggle deg={2}>
                  <CardBadge variant="yellow" className="rotate-[2deg]">~45 MIN</CardBadge>
                </StampWiggle>
              </CardHeader>

              <CardContent>
                <label htmlFor="btc" className="text-xs font-base tracking-wider">
                  Your stack (BTC)
                </label>

                <div className="mt-2">
                  <Input
                    id="btc"
                    inputMode="decimal"
                    value={btc}
                    suffix="BTC"
                    placeholder="0.00"
                    aria-describedby="promise"
                    onChange={(e) => {
                      setBtc(e.target.value.replace(/[^0-9.]/g, ""));
                      setReady(false);
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <MotionChip
                      key={p}
                      active={quote.held === p}
                      className={cn(
                        "rounded-base border-2 border-black px-3 py-1.5 text-sm font-base shadow-brutal",
                        quote.held === p
                          ? "bg-violet-200"
                          : "bg-white hover:bg-cyan-200 hover:shadow-brutal-btn",
                      )}
                      onClick={() => {
                        setBtc(String(p));
                        setReady(false);
                      }}
                    >
                      {p}
                    </MotionChip>
                  ))}
                </div>

                <p
                  id="promise"
                  className="mt-4 rounded-base border-2 border-black bg-lime-200 p-3.5 text-sm leading-relaxed"
                >
                  {valid ? (
                    <>
                      BTC ≤{" "}
                      <ValuePop value={quote.strike} className="tnum font-heading">
                        {usd(quote.strike)}
                      </ValuePop>{" "}
                      at settlement →{" "}
                      <ValuePop value={quote.coverage} className="tnum rounded-base bg-lime-300 px-1 font-heading">
                        {usd(quote.coverage)}
                      </ValuePop>{" "}
                      to you.
                    </>
                  ) : (
                    <>Stack size goes here.</>
                  )}
                </p>

                <div className="mt-4">
                  {ready ? (
                    <>
                      <ConnectButton />
                      <p className="mt-2 text-center text-xs text-foreground/60">
                        Connect wallet → mint policy. One signature.
                      </p>
                    </>
                  ) : (
                    <>
                      <Button variant="default" fullWidth disabled={!valid} onClick={() => setReady(true)}>
                        Cover it —{" "}
                        {valid ? (
                          <ValuePop value={quote.premium}>{usd(quote.premium, 2)}</ValuePop>
                        ) : (
                          "—"
                        )}
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </Button>
                      <p className="mt-2 text-center text-xs text-foreground/60">
                        BTC stays in your wallet. Cancel before expiry.
                      </p>
                    </>
                  )}
                </div>

                <details className="mt-4 border-t-2 border-dashed border-black pt-4">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-base [&::-webkit-details-marker]:hidden">
                    Show the math <ChevronDown size={15} strokeWidth={2.5} />
                  </summary>
                  <div className="mt-3 grid gap-2 text-sm">
                    {[
                      ["SVI fair value", usd(quote.fair, 2)],
                      ["Spread", usd(quote.spread, 2)],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-foreground/70">
                        <span>{label}</span>
                        <span className="tnum font-heading text-foreground">{val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-foreground/70">
                      <span>Protocol floor</span>
                      <span className="font-heading text-red-300">min 1%</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-black pt-2 font-heading">
                      <span>Total</span>
                      <span className="tnum text-lg">{usd(quote.premium, 2)}</span>
                    </div>
                  </div>
                </details>
              </CardContent>
            </Card>
          </HeroReveal>
        </Shell>
      </section>

      <MarqueeStrip />

      {/* How */}
      <section className="border-b-4 border-black bg-lime-100 py-14 md:py-20" id="how">
        <Shell>
          <Reveal>
            <SectionTag>3 MOVES</SectionTag>
            <h2 className="text-3xl md:text-4xl">No strike ladder. Three steps.</h2>
            <p className="mt-4 max-w-lg text-foreground/80">
              You don&rsquo;t touch an options chain. One input, one price, one payout if the floor
              breaks.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.12}>
            {STEPS.map((s) => (
              <StaggerItem key={s.num}>
                <PopCard>
                  <Card className="relative bg-white pt-4">
                    <span className="absolute -top-3.5 left-4 rounded-base border-2 border-black bg-yellow-300 px-2.5 py-0.5 font-heading text-xl shadow-brutal">
                      {s.num}
                    </span>
                    <CardContent>
                      <CardTitle>{s.title}</CardTitle>
                      <CardDescription className="mt-2">{s.body}</CardDescription>
                    </CardContent>
                  </Card>
                </PopCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Shell>
      </section>

      {/* Pricing */}
      <section className="border-b-4 border-black bg-yellow-200 py-14 md:py-20" id="pricing">
        <Shell className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <SectionTag>THE MATH</SectionTag>
              <h2 className="text-3xl md:text-4xl">We didn&rsquo;t invent the price.</h2>
              <p className="mt-4 max-w-lg text-foreground/80">
                DeepBook&rsquo;s ask, broken into parts you can actually read.
              </p>
            </Reveal>

            <Stagger className="mt-8 grid gap-3" stagger={0.1}>
              {FEATURES.map((f) => (
                <StaggerItem key={f.title}>
                  <Card className="gap-0 py-0 shadow-brutal">
                    <CardContent className="flex gap-3 py-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-base border-2 border-black bg-cyan-200 text-sm font-heading">
                        {f.mark}
                      </span>
                      <div>
                        <p className="font-heading">{f.title}</p>
                        <p className="mt-1 text-sm text-foreground/80">{f.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal x={32} delay={0.1}>
            <Card>
              <CardHeader className="flex flex-wrap items-start justify-between gap-2">
                <CardBadge variant="neutral">RECEIPT #0041</CardBadge>
                <StampWiggle>
                  <CardBadge variant="lime">PAID · {usd(1000)}</CardBadge>
                </StampWiggle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 text-sm">
                  {[
                    ["Fair", 71, usd(10, 2), "bg-violet-200"],
                    ["Spread", 29, usd(4, 2), "bg-yellow-300"],
                  ].map(([label, pct, val, color]) => (
                    <div key={label as string} className="grid grid-cols-[72px_1fr_auto] items-center gap-2">
                      <span className="text-foreground/70">{label as string}</span>
                      <div className="h-3.5 overflow-hidden rounded-base border-2 border-black bg-white">
                        <BarFill
                          className={cn("h-full", color as string)}
                          widthPct={pct as number}
                          delay={label === "Spread" ? 0.15 : 0}
                        />
                      </div>
                      <span className="tnum font-heading">{val as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <small className="text-xs leading-snug text-foreground/70">
                  {usd(1000)} coverage
                  <br />
                  1.4% effective
                </small>
                <span className="tnum font-heading text-2xl">{usd(14, 2)}</span>
              </CardFooter>
            </Card>
          </Reveal>
        </Shell>
      </section>

      {/* Why */}
      <section className="border-b-4 border-black bg-white py-14 md:py-20" id="why">
        <Shell>
          <Reveal>
            <SectionTag>UNDER THE HOOD</SectionTag>
            <h2 className="text-3xl md:text-4xl">Binary option. Insurance words.</h2>
            <p className="mt-4 max-w-lg text-foreground/80">
              Deep OTM downside binary = crash cover. We just stopped calling it a trade.
            </p>
          </Reveal>

          <Reveal delay={0.08} y={36}>
            <Card className="mt-10 border-2 border-black bg-black text-white shadow-brutal" hover={false}>
              <CardContent className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="font-heading text-xl">Trader speak → plain English</h3>
                  <p className="mt-3 text-sm text-white/70">
                    Same position a desk would build. Different labels on the receipt.
                  </p>
                </div>
                <Stagger className="grid gap-2" stagger={0.07}>
                  {REFRAMES.map(([from, to]) => (
                    <StaggerItem key={to}>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-base border-2 border-white/30 bg-black/90 px-3 py-2.5 text-sm">
                        <span className="text-white/50">{from}</span>
                        <span className="font-heading text-yellow-300">→</span>
                        <span className="text-right font-heading">{to}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </CardContent>
            </Card>
          </Reveal>

          <Stagger className="mt-5 grid gap-5 md:grid-cols-2" stagger={0.1}>
            {[
              ["A", "30–60 min window", "Coverage to the next oracle settlement. Nervous hour, not nervous quarter."],
              ["B", "Any floor, any hour", "Priced off a vol surface. Vault on the other side of every mint."],
              ["C", "One signature", "Create manager, deposit, mint — bundled. You tap once."],
              ["D", "DeepBook Predict", "Sub-hour oracles + any-strike pricing. Only works here."],
            ].map(([stamp, title, body]) => (
              <StaggerItem key={stamp as string}>
                <PopCard>
                  <Card className="relative bg-white pt-4">
                    <span className="absolute -top-3 left-4 grid h-7 w-7 place-items-center rounded-base border-2 border-black bg-pink-200 font-heading text-sm shadow-brutal">
                      {stamp}
                    </span>
                    <CardContent>
                      <CardTitle>{title as string}</CardTitle>
                      <CardDescription className="mt-2">{body as string}</CardDescription>
                    </CardContent>
                  </Card>
                </PopCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Shell>
      </section>

      {/* Disclosures */}
      <section className="border-b-4 border-black bg-cyan-200 py-14 md:py-20">
        <Shell>
          <Reveal>
            <SectionTag>READ THIS</SectionTag>
            <h2 className="text-3xl md:text-4xl">Before you tap.</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-3 md:grid-cols-2" stagger={0.08}>
            {DISCLOSURES.map(([title, body], i) => (
              <StaggerItem key={title}>
                <Card className="gap-0 bg-white py-0 shadow-brutal">
                  <CardContent className="flex gap-3 py-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-base border-2 border-black bg-violet-200 font-heading text-sm">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground/80">
                      <b className="mb-1 block text-foreground">{title}</b>
                      {body}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Shell>
      </section>

      {/* CTA */}
      <section className="bg-lime-100 py-14 md:py-20">
        <Shell>
          <Reveal y={40}>
            <Card className="border-2 border-black bg-yellow-300 text-center shadow-brutal" hover={false}>
              <CardContent className="py-12 md:py-16">
                <h2 className="text-3xl md:text-4xl">Cover this hour.</h2>
                <p className="mx-auto mt-4 max-w-md text-black/80">
                  CPI, FOMC, Friday liquidations — pick your panic. Costs less than lunch.
                </p>
                <PulseWrap className="mt-8 inline-block">
                  <Link href="/app">
                    <Button variant="default" size="lg">
                      Open app
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </Button>
                  </Link>
                </PulseWrap>
                <p className="mt-3 text-xs text-black/70">1 tap · 1 sig · keeper pays out</p>
              </CardContent>
            </Card>
          </Reveal>
        </Shell>
      </section>

      <MarqueeStrip />

      {/* Footer */}
      <Reveal>
        <footer className="border-t-4 border-black bg-black py-8 text-white">
          <Shell className="flex flex-wrap items-start justify-between gap-6">
            <Link href="/" className="flex items-center gap-2.5 font-heading text-sm">
              <span className="grid h-9 w-9 place-items-center rounded-base border-2 border-black bg-cyan-200 text-black shadow-brutal">
                S
              </span>
              SENTINEL
            </Link>
            <p className="max-w-md text-sm text-white/70">
              One-hour crash cover for BTC. DeepBook Predict on Sui testnet. On-chain options with
              insurance framing — not a regulated policy.
            </p>
          </Shell>
        </footer>
      </Reveal>
    </div>
  );
}
