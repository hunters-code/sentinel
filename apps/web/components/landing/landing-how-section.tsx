"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LANDING_EASE, LANDING_VIEWPORT, landingFadeUp, landingStaggerContainer } from "@/lib/landing-motion";

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

const CHIPS = ["Parametric payout", "One signature", "No claims paperwork"] as const;

export function LandingHowSection() {
  const reduce = useReducedMotion();

  return (
    <section id="how" className="border-t border-[var(--color-chrome-border)] bg-sui-black px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-container">
        <LandingReveal className="max-w-[40rem]">
          <h2 className="landing-sui-type-h2 max-w-[18ch] text-balance">
            Buy coverage in one tap, settle automatically on expiry.
          </h2>
          <p className="landing-sui-type-body mt-6 max-w-[62ch] text-content-secondary text-pretty">
            Enter how much crypto you hold, review your trigger and premium, then sign once. If the
            settlement price lands at or below your trigger, payout is sent to your wallet automatically.
          </p>
          {reduce ? (
            <ul className="mt-8 flex flex-wrap gap-2.5 landing-sui-type-body text-sui-steel-dark">
              <li className="rounded-full border border-sui-blue/45 bg-sui-blue/10 px-3 py-1 text-sui-blue">
                Parametric payout
              </li>
              <li className="rounded-full border border-border-neutral px-3 py-1">One signature</li>
              <li className="rounded-full border border-border-neutral px-3 py-1">No claims paperwork</li>
            </ul>
          ) : (
            <motion.ul
              className="mt-8 flex flex-wrap gap-2.5 landing-sui-type-body text-sui-steel-dark"
              initial="hidden"
              whileInView="visible"
              viewport={LANDING_VIEWPORT}
              variants={landingStaggerContainer}
            >
              {CHIPS.map((chip, index) => (
                <motion.li
                  key={chip}
                  variants={landingFadeUp}
                  transition={{ delay: index * 0.06, ease: LANDING_EASE }}
                  className={
                    index === 0
                      ? "rounded-full border border-sui-blue/45 bg-sui-blue/10 px-3 py-1 text-sui-blue"
                      : "rounded-full border border-border-neutral px-3 py-1"
                  }
                >
                  {chip}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </LandingReveal>

        <div className="relative mt-16 md:mt-20 lg:mt-24">
          <div
            className="pointer-events-none absolute inset-x-0 top-4 hidden h-px origin-left bg-[var(--color-chrome-border)] landing-shimmer-line md:block"
            aria-hidden
          />
          {reduce ? (
            <ul className="m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8 lg:gap-12">
              {STEPS.map((step, index) => (
                <li key={step.title} className="min-w-0">
                  <StepContent step={step} index={index} />
                </li>
              ))}
            </ul>
          ) : (
            <motion.ul
              className="m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8 lg:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={LANDING_VIEWPORT}
              variants={landingStaggerContainer}
            >
              {STEPS.map((step, index) => (
                <motion.li key={step.title} className="min-w-0" variants={landingFadeUp}>
                  <StepContent step={step} index={index} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </section>
  );
}

function StepContent({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  return (
    <div className="flex gap-4 md:flex-col md:gap-5">
      <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sui-blue/35 bg-sui-black font-display text-sm font-normal text-sui-blue md:h-9 md:w-9">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1 pt-0.5 md:pt-0">
        <h3 className="font-display text-lg font-normal tracking-[-0.02em] text-content-primary md:text-xl">
          {step.title}
        </h3>
        <p className="landing-sui-type-body mt-2 max-w-[34ch] text-sui-steel md:mt-3">{step.body}</p>
      </div>
    </div>
  );
}
