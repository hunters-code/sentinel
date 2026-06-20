"use client";

import { AppTopBar } from "@/components/app/app-top-bar";
import { AppBottomNav } from "@/components/app/app-bottom-nav";
import type { AppNavId } from "@/components/app/app-tabs";

export function AppShell({
  children,
  nav,
  onNavChange,
  connected,
}: {
  children: React.ReactNode;
  nav: AppNavId;
  onNavChange: (nav: AppNavId) => void;
  connected?: boolean;
}) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-[radial-gradient(ellipse_130%_70%_at_50%_-15%,rgba(77,162,255,0.22)_0%,transparent_58%),#000000] font-body text-content-primary antialiased [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-bg-accent [&_a:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-bg-accent [&_button:focus-visible]:outline-offset-[3px] [&_h1]:font-display [&_h1]:font-medium [&_h1]:tracking-[-0.03em] [&_h1]:text-balance [&_h2]:font-display [&_h2]:font-medium [&_h2]:tracking-[-0.03em] [&_h2]:text-balance [&_h3]:font-display [&_h3]:font-medium [&_h3]:tracking-[-0.03em] [&_h3]:text-balance">
      <div className="relative flex min-h-dvh w-full max-w-[600px] flex-col bg-sui-black md:border-x md:border-white/[0.06]">
        <AppTopBar connected={connected} />
        <main className="relative z-[1] flex-1">{children}</main>
        <AppBottomNav nav={nav} onNavChange={onNavChange} />
      </div>
    </div>
  );
}
