"use client";

import { Sparkles } from "lucide-react";

export function AppHeroIcon() {
  return (
    <div className="app-hero-icon-wrap" aria-hidden>
      <Sparkles className="app-hero-sparkle app-hero-sparkle-a" size={14} strokeWidth={2} />
      <Sparkles className="app-hero-sparkle app-hero-sparkle-b" size={10} strokeWidth={2} />
      <div className="app-hero-icon">
        <svg viewBox="0 0 64 64" fill="none" className="app-hero-coin">
          <circle cx="32" cy="32" r="30" fill="url(#hero-coin-grad)" />
          <path
            d="M32 14c-6.2 0-11.5 3.8-13.8 9.4h8.4c1.6-2.2 4.2-3.6 7.1-3.6 4.8 0 8.7 3.9 8.7 8.7s-3.9 8.7-8.7 8.7h-4.3v6.4h4.3c6.2 0 11.5-3.8 13.8-9.4h-8.4c-1.6 2.2-4.2 3.6-7.1 3.6-4.8 0-8.7-3.9-8.7-8.7s3.9-8.7 8.7-8.7h4.3V14h-4.3z"
            fill="white"
            fillOpacity="0.95"
          />
          <defs>
            <linearGradient id="hero-coin-grad" x1="8" y1="8" x2="56" y2="56">
              <stop stopColor="#4da2ff" />
              <stop offset="1" stopColor="#125eb0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
