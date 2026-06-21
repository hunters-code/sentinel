"use client";

import { motion, useReducedMotion } from "framer-motion";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";
import { SuiGradientBackdrop } from "@/components/landing/sui-gradient-backdrop";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LANDING_EASE } from "@/lib/landing-motion";

export function LandingCtaSection() {
  const reduce = useReducedMotion();

  return (
    <section className="border-t border-[var(--color-chrome-border)] bg-sui-black px-5 py-20 md:px-10 md:py-24">
      <LandingReveal>
        <div className="group relative mx-auto flex w-full max-w-container flex-col items-start justify-between gap-8 overflow-hidden rounded-[1.75rem] border border-sui-blue/25 p-8 transition-colors duration-300 hover:border-sui-blue/45 md:flex-row md:items-end md:p-10">
          <SuiGradientBackdrop
            variant="secondaryPanel"
            overlay="panel"
            drift={!reduce}
            imageClassName="object-cover object-[center_55%]"
          />
          <div className="relative z-[1]">
            <h2 className="text-landing-h2 max-w-[16ch] text-balance">
              Insure the next move before it happens.
            </h2>
            <p className="text-landing-body mt-4 max-w-[58ch] text-content-secondary text-pretty">
              Parametric, all-or-nothing payout at oracle settlement. Coverage window follows expiry on
              your quote — not a regulated insurance product.
            </p>
          </div>
          {reduce ? (
            <div className="relative z-[1] w-full shrink-0 md:w-auto">
              <QuoteCtaButton href="/app" quiet className="w-full md:w-auto" />
            </div>
          ) : (
            <motion.div
              className="relative z-[1] w-full shrink-0 md:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: LANDING_EASE }}
            >
              <QuoteCtaButton href="/app" quiet className="w-full md:w-auto" />
            </motion.div>
          )}
        </div>
      </LandingReveal>
    </section>
  );
}
