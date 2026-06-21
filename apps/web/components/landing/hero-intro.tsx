"use client";

import { motion, useReducedMotion } from "framer-motion";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";
import { LANDING_EASE } from "@/lib/landing-motion";

export function HeroIntro() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <>
        <p className="text-landing-lead mx-auto mt-6 max-w-[65ch] text-center text-content-secondary text-pretty">
          Cover your crypto against a sharp drop. Cross the{" "}
          <strong className="font-medium text-content-primary">2%</strong> trigger and you&apos;re{" "}
          <strong className="font-medium text-content-primary">paid automatically</strong> —{" "}
          <strong className="font-medium text-content-primary">one tap</strong>, no paperwork.
        </p>
        <div className="mt-8 inline-flex justify-center">
          <QuoteCtaButton href="/app" quiet />
        </div>
      </>
    );
  }

  return (
    <>
      <motion.p
        className="text-landing-lead mx-auto mt-6 max-w-[65ch] text-center text-content-secondary text-pretty"
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.38, ease: LANDING_EASE }}
      >
        Cover your crypto against a sharp drop. Cross the{" "}
        <strong className="font-medium text-content-primary">2%</strong> trigger and you&apos;re{" "}
        <strong className="font-medium text-content-primary">paid automatically</strong> —{" "}
        <strong className="font-medium text-content-primary">one tap</strong>, no paperwork.
      </motion.p>
      <motion.div
        className="mt-8 inline-flex justify-center"
        initial={{ opacity: 1, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.52, ease: LANDING_EASE }}
      >
        <QuoteCtaButton href="/app" quiet />
      </motion.div>
    </>
  );
}
