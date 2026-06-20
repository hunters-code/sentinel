"use client";

import { Sparkles } from "lucide-react";
import { SentinelLogo } from "@/components/sentinel-logo";

export function AppHeroIcon() {
  return (
    <div className="relative mb-5 size-[5.5rem]" aria-hidden>
      <Sparkles
        className="absolute right-[0.35rem] top-[0.15rem] text-bg-accent opacity-90"
        size={14}
        strokeWidth={2}
      />
      <Sparkles
        className="absolute bottom-2 left-[0.1rem] text-bg-accent opacity-65"
        size={10}
        strokeWidth={2}
      />
      <SentinelLogo size={72} className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.56)]" />
    </div>
  );
}
