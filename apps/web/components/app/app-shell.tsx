"use client";

import { AppSidebar } from "@/components/app/app-sidebar";
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
    <div className="font-body text-content-primary antialiased flex h-dvh overflow-hidden bg-transparent [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-bg-accent [&_a:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-bg-accent [&_button:focus-visible]:outline-offset-[3px] [&_h1]:font-display [&_h1]:font-medium [&_h1]:tracking-[-0.03em] [&_h1]:text-balance [&_h2]:font-display [&_h2]:font-medium [&_h2]:tracking-[-0.03em] [&_h2]:text-balance [&_h3]:font-display [&_h3]:font-medium [&_h3]:tracking-[-0.03em] [&_h3]:text-balance">
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 gap-4 p-4 max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:gap-5 md:p-5">
        <AppSidebar nav={nav} onNavChange={onNavChange} connected={connected} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-page-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
