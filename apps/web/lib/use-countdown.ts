"use client";

import { useEffect, useState } from "react";

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Settling…";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function useCountdown(expiryMs: number | null, enabled: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled || expiryMs == null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled, expiryMs]);

  if (expiryMs == null) return { remainingMs: 0, label: "—", nearExpiry: false, settling: false };

  const remainingMs = Math.max(0, expiryMs - now);
  const nearExpiry = remainingMs > 0 && remainingMs < 5 * 60 * 1000;
  const settling = remainingMs <= 0;

  return {
    remainingMs,
    label: formatCountdown(remainingMs),
    nearExpiry,
    settling,
  };
}
