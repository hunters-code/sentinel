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
    <div className="sentinel-app app-layout">
      <div className="app-layout-frame">
        <AppSidebar nav={nav} onNavChange={onNavChange} connected={connected} />

        <div className="app-main-panel">{children}</div>
      </div>
    </div>
  );
}
