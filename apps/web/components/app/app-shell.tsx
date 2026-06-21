"use client";

import { AppTopBar } from "@/components/app/app-top-bar";
import { AppBottomNav, AppSidebarNav } from "@/components/app/app-bottom-nav";
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
    <div className="flex min-h-dvh w-full justify-center bg-[image:var(--color-app-shell-bg)] font-body text-content-primary antialiased md:justify-normal [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-bg-accent [&_a:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-bg-accent [&_button:focus-visible]:outline-offset-[3px] [&_h1]:font-display [&_h1]:font-medium [&_h1]:tracking-[-0.03em] [&_h1]:text-balance [&_h2]:font-display [&_h2]:font-medium [&_h2]:tracking-[-0.03em] [&_h2]:text-balance [&_h3]:font-display [&_h3]:font-medium [&_h3]:tracking-[-0.03em] [&_h3]:text-balance">
      <div className="relative flex min-h-dvh w-full max-w-[600px] flex-col bg-sui-black md:max-w-none md:flex-row">
        <AppSidebarNav nav={nav} onNavChange={onNavChange} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AppTopBar connected={connected} />
          <main className="relative z-[1] flex-1">{children}</main>
          <AppBottomNav nav={nav} onNavChange={onNavChange} />
        </div>
      </div>
    </div>
  );
}
