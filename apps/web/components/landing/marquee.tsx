"use client";

import { useReducedMotion } from "framer-motion";

const ITEMS = [
  "Covers the next hour",
  "Honest market pricing",
  "Automatic payout",
  "Paid in stablecoins",
  "One tap to buy",
  "No claims to file",
];

export function Marquee() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="border-y border-sui-line bg-white/[0.02] px-6 py-4 md:px-10">
        <ul className="mx-auto flex max-w-container flex-wrap justify-center gap-x-6 gap-y-2">
          {ITEMS.map((item) => (
            <li key={item} className="text-sm text-sui-steel">
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
      className="overflow-hidden border-y border-sui-line bg-white/[0.02] py-4"
      aria-hidden
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="mx-8 inline-flex items-center gap-3 text-sm">
            <span className="text-sui-blue" aria-hidden>
              →
            </span>
            <span className="text-sui-steel">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
