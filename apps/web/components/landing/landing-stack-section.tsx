"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SuiGradientBackdrop } from "@/components/landing/sui-gradient-backdrop";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LANDING_EASE, LANDING_VIEWPORT, landingFadeUp, landingStaggerContainer } from "@/lib/landing-motion";

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
  const reduce = useReducedMotion();

  return (
    <section id="stack" className="relative overflow-hidden border-t border-[var(--color-chrome-border)] px-5 py-20 md:px-10 md:py-28">
      <SuiGradientBackdrop
        variant="secondaryStack"
        overlay="section"
        imageClassName="object-cover object-center opacity-50"
      />
      <div className="relative z-[1] mx-auto w-full max-w-container">
        <LandingReveal className="max-w-[44rem]">
          <p className="landing-sui-type-label font-medium text-sui-blue">Built on Sui</p>
          <h2 className="landing-sui-type-h2 mt-3 max-w-[20ch] text-balance text-content-primary">
            Priced from live markets, settled on-chain.
          </h2>
          <p className="landing-sui-type-lead mt-5 max-w-[62ch] text-content-secondary text-pretty">
            Quotes refresh before you sign. Settlement follows the oracle expiry on your receipt — not a
            fixed duration from purchase.
          </p>
        </LandingReveal>

        {reduce ? (
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-sui-blue/25 bg-sui-blue/25 sm:grid-cols-2">
            {COVERAGE_POINTS.map((item, index) => (
              <div key={item.label} className={index === 0 ? "sm:col-span-2" : undefined}>
                <CoverageCell item={item} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-sui-blue/25 bg-sui-blue/25 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={LANDING_VIEWPORT}
            variants={landingStaggerContainer}
          >
            {COVERAGE_POINTS.map((item, index) => (
              <motion.div
                key={item.label}
                variants={landingFadeUp}
                transition={{ ease: LANDING_EASE }}
                className={index === 0 ? "sm:col-span-2" : undefined}
              >
                <CoverageCell item={item} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <LandingReveal className="mt-8" delay={0.12}>
          <details className="group rounded-2xl border border-border-neutral bg-black/55 px-6 py-5 backdrop-blur-sm open:pb-6">
            <summary className="cursor-pointer list-none font-display text-base font-normal leading-snug text-content-primary marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2.5">
                <span className="landing-sui-type-label text-sui-blue">For builders</span>
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
            <dl className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
              {BUILDER_DETAILS.map((item) => (
                <div key={item.term}>
                  <dt className="landing-sui-type-label text-sui-steel-dark">{item.term}</dt>
                  <dd className="landing-sui-type-body mt-2.5 leading-[1.55] text-content-primary">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </details>
        </LandingReveal>
      </div>
    </section>
  );
}

function CoverageCell({
  item,
  index,
}: {
  item: (typeof COVERAGE_POINTS)[number];
  index: number;
}) {
  return (
    <dl
      className={`m-0 h-full p-6 backdrop-blur-sm md:p-7 ${
        index === 0 ? "bg-black/80 sm:bg-black/85" : "bg-black/70"
      }`}
    >
      <dt className="landing-sui-type-label text-sui-blue">{item.label}</dt>
      <dd className="mt-3 font-display text-lg font-normal leading-[1.35] tracking-[-0.02em] text-content-primary md:text-xl">
        {item.value}
      </dd>
      <dd className="landing-sui-type-body mt-3 max-w-[42ch] leading-[1.55] text-content-secondary">
        {item.detail}
      </dd>
    </dl>
  );
}
