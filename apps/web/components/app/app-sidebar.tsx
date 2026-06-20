"use client";

import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Home, Shield, Clock, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import { AppSidebarAccountMenu } from "@/components/app/app-sidebar-account-menu";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import type { AppNavId } from "@/components/app/app-tabs";

const NAV: { id: AppNavId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "cover", label: "Cover", icon: Shield },
  { id: "history", label: "History", icon: Clock },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export function AppSidebar({
  nav,
  onNavChange,
  connected,
}: {
  nav: AppNavId;
  onNavChange: (nav: AppNavId) => void;
  connected?: boolean;
}) {
  const account = useCurrentAccount();

  return (
    <>
      <aside className="app-sidebar hidden md:flex" aria-label="App navigation">
        <Link href="/app" className="app-sidebar-logo no-underline" aria-label="Sentinel app home">
          <span className="app-sidebar-logo-mark" aria-hidden>S</span>
        </Link>

        <nav className="app-sidebar-nav">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = nav === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavChange(id)}
                className={cn("app-sidebar-item", active && "app-sidebar-item-active")}
                aria-current={active ? "page" : undefined}
                title={label}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {connected && account?.address ? (
          <div className="app-sidebar-bottom">
            <AppSidebarAccountMenu address={account.address} />
          </div>
        ) : (
          <div className="app-sidebar-bottom app-sidebar-bottom--connect">
            <SentinelConnectButton className="app-sidebar-connect" label="Connect" />
          </div>
        )}
      </aside>

      <nav className="app-bottom-nav md:hidden" aria-label="App navigation">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = nav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              className={cn("app-bottom-nav-item", active && "app-bottom-nav-item-active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
