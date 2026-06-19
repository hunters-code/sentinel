"use client";

import { useEffect, useState } from "react";
import { QUOTE_FRESHNESS_MS } from "@sentinel/shared";

export function useQuoteFreshness(createdAtMs: number) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, QUOTE_FRESHNESS_MS - (Date.now() - createdAtMs)),
  );

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, QUOTE_FRESHNESS_MS - (Date.now() - createdAtMs)));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [createdAtMs]);

  return { remainingMs, stale: remainingMs <= 0 };
}

export function QuoteFreshness({ createdAtMs }: { createdAtMs: number }) {
  const { remainingMs, stale } = useQuoteFreshness(createdAtMs);
  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <p
      className="text-sm tabular-nums"
      style={{ color: stale ? "#fa8543" : "var(--sui-steel)" }}
      role="status"
      aria-live="polite"
    >
      {stale
        ? "Quote expired — edit your amount to refresh"
        : `Price valid for ${seconds}s`}
    </p>
  );
}
