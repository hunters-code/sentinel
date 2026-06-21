"use client";

import { AppTopBar } from "@/components/app/app-top-bar";
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
    <div className="flex min-h-dvh flex-col bg-sui-black font-body text-content-primary antialiased [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-bg-accent [&_a:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-bg-accent [&_button:focus-visible]:outline-offset-[3px] [&_h1]:font-display [&_h1]:font-medium [&_h1]:tracking-[-0.03em] [&_h1]:text-balance [&_h2]:font-display [&_h2]:font-medium [&_h2]:tracking-[-0.03em] [&_h2]:text-balance [&_h3]:font-display [&_h3]:font-medium [&_h3]:tracking-[-0.03em] [&_h3]:text-balance">
      <AppTopBar nav={nav} onNavChange={onNavChange} connected={connected} />
      <main className="flex flex-1 justify-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 md:px-6 md:pt-8">
        <div className="w-full max-w-[480px]">{children}</div>
      </main>
    </div>
  );
}
