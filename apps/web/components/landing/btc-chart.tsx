"use client";

import { motion, useReducedMotion } from "framer-motion";

export function BtcChartVisual() {
  const reduce = useReducedMotion();

  return (
    <figure className="relative aspect-[4/3] w-full max-w-xl">
      <figcaption className="sr-only">
        Illustrative BTC price chart with a dashed trigger line at $98,000. If price settles at or
        below the trigger before expiry, the policy pays out.
      </figcaption>
      <div
        className="absolute inset-0 rounded-2xl"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(41,141,255,0.18) 0%, transparent 70%)",
        }}
      />
      <svg viewBox="0 0 400 300" className="relative h-full w-full" fill="none" aria-hidden>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5CA9FF" />
            <stop offset="100%" stopColor="#298DFF" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(41,141,255,0.25)" />
            <stop offset="100%" stopColor="rgba(41,141,255,0)" />
          </linearGradient>
        </defs>

        {[60, 120, 180, 240, 300].map((y) => (
          <line
            key={y}
            x1="32"
            y1={y}
            x2="368"
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        <line
          x1="32"
          y1="195"
          x2="368"
          y2="195"
          stroke="#7df752"
          strokeWidth="1.5"
          strokeDasharray="6 5"
        />
        <text x="372" y="199" fill="#7df752" fontSize="10" fontFamily="system-ui">
          trigger
        </text>

        <path
          d="M 32 80 L 80 95 L 130 70 L 180 110 L 230 85 L 280 140 L 330 120 L 368 210"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 32 80 L 80 95 L 130 70 L 180 110 L 230 85 L 280 140 L 330 120 L 368 210 L 368 280 L 32 280 Z"
          fill="url(#areaGrad)"
        />

        {!reduce && (
          <motion.circle
            cx="368"
            cy="210"
            r="5"
            fill="#298DFF"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <rect x="32" y="24" width="132" height="28" rx="6" fill="rgba(255,255,255,0.06)" />
        <text x="44" y="42" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="system-ui">
          BTC/USD · example
        </text>
        <text x="44" y="58" fill="#fff" fontSize="13" fontWeight="600" fontFamily="system-ui">
          $98,000 trigger
        </text>
      </svg>
    </figure>
  );
}
