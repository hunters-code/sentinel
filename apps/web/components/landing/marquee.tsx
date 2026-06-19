"use client";

import { useReducedMotion } from "framer-motion";

const ITEMS = [
  "One-hour coverage",
  "Honest protocol pricing",
  "Automatic payout",
  "dUSDC settlement",
  "One signature",
  "Sub-hour expiry",
];

export function Marquee() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className="border-y px-6 py-4 md:px-10"
        style={{ borderColor: "var(--sui-line)", background: "rgba(255,255,255,0.02)" }}
      >
        <ul className="mx-auto flex max-w-container flex-wrap justify-center gap-x-6 gap-y-2">
          {ITEMS.map((item) => (
            <li key={item} className="text-sm" style={{ color: "var(--sui-steel)" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden border-y py-4"
      style={{ borderColor: "var(--sui-line)", background: "rgba(255,255,255,0.02)" }}
      aria-hidden
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="mx-8 inline-flex items-center gap-3 text-sm">
            <span style={{ color: "var(--sui-blue)" }} aria-hidden>
              →
            </span>
            <span style={{ color: "var(--sui-steel)" }}>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
