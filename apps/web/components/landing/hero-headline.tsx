"use client";

import { motion, useReducedMotion } from "framer-motion";
import { landingHeroContainer, landingHeroLine } from "@/lib/landing-motion";

const LINES = [
  { text: "When the market drops", accent: false },
  { text: "you're covered.", accent: true },
] as const;

export function HeroHeadline() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h1 className="text-landing-h1 text-center font-display font-normal text-balance">
        {LINES.map((line) => (
          <span
            key={line.text}
            className={`block ${line.accent ? "font-medium text-sui-blue" : "text-content-primary"}`}
          >
            {line.text}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1
      className="text-landing-h1 text-center font-display font-normal text-balance"
      initial="hidden"
      animate="visible"
      variants={landingHeroContainer}
    >
      {LINES.map((line) => (
        <motion.span
          key={line.text}
          variants={landingHeroLine}
          className={`block ${line.accent ? "font-medium text-sui-blue" : "text-content-primary"}`}
        >
          {line.text}
        </motion.span>
      ))}
    </motion.h1>
  );
}
