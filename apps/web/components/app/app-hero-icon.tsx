"use client";

import { Sparkles } from "lucide-react";
import { SentinelLogo } from "@/components/sentinel-logo";

export function AppHeroIcon() {
  return (
    <div className="app-hero-icon-wrap" aria-hidden>
      <Sparkles className="app-hero-sparkle app-hero-sparkle-a" size={14} strokeWidth={2} />
      <Sparkles className="app-hero-sparkle app-hero-sparkle-b" size={10} strokeWidth={2} />
      <SentinelLogo size={72} className="app-hero-logo" />
    </div>
  );
}
