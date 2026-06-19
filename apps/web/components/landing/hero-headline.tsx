"use client";

import { motion, useReducedMotion } from "framer-motion";

const LINES = [
  { text: "Protect your", accent: false },
  { text: "Bitcoin for", accent: false },
  { text: "the next hour.", accent: true },
] as const;

export function HeroHeadline() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h1
        className="text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Protect your Bitcoin for{" "}
        <span style={{ color: "var(--sui-blue-bright)" }}>the next hour.</span>
      </h1>
    );
  }

  return (
    <h1
      className="text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {LINES.map((line, i) => (
        <motion.span
          key={line.text}
          className="block"
          style={line.accent ? { color: "var(--sui-blue-bright)" } : undefined}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.12 + i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {line.text}
        </motion.span>
      ))}
    </h1>
  );
}
