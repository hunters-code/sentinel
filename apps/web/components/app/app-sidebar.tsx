"use client";

import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Home, Shield, Clock, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import { AppSidebarAccountMenu } from "@/components/app/app-sidebar-account-menu";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import { SentinelLogo } from "@/components/sentinel-logo";
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
      <aside
        className="hidden w-56 shrink-0 flex-col self-stretch rounded-3xl border border-white/[0.08] bg-page-tab-bar py-[1.125rem] px-3 pb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:flex min-h-0"
        aria-label="App navigation"
      >
        <Link
          href="/app"
          className="mb-5 flex justify-start px-[0.35rem] no-underline"
          aria-label="Sentinel app home"
        >
          <SentinelLogo size={36} />
        </Link>

        <nav className="flex min-h-0 flex-1 flex-col gap-[0.2rem]">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = nav === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavChange(id)}
                className={cn(
                  "flex w-full cursor-pointer flex-row items-center gap-2.5 rounded-xl border-none bg-transparent py-[0.5625rem] px-[0.6875rem] text-[0.8125rem] font-medium leading-[1.2] text-sui-steel no-underline transition-[background,color] duration-150 hover:not-disabled:bg-white/[0.07] hover:not-disabled:text-content-persistent-white disabled:cursor-not-allowed disabled:opacity-45",
                  active &&
                    "bg-bg-accent text-content-persistent-black shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
                )}
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
          <div className="mt-auto flex min-h-[2.375rem] items-center gap-2 rounded-full border border-border-neutral bg-sui-black py-2 px-2.5 text-content-persistent-white">
            <AppSidebarAccountMenu address={account.address} />
          </div>
        ) : (
          <div className="mt-auto flex min-h-0 items-center gap-2 bg-transparent p-0">
            <SentinelConnectButton
              className="!min-h-[2.375rem] w-full !rounded-full !py-2 !px-3 !text-[0.8125rem] !font-semibold"
              label="Connect"
            />
          </div>
        )}
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex justify-start gap-[0.15rem] overflow-x-auto rounded-t-[1.25rem] bg-page-tab-bar py-2 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="App navigation"
      >
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = nav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              className={cn(
                "flex min-w-[3.75rem] shrink-0 cursor-pointer flex-col items-center gap-[0.2rem] rounded-xl border-none bg-transparent py-[0.4rem] px-[0.35rem] text-[0.625rem] font-medium text-sui-steel",
                active &&
                  "bg-white/10 text-content-persistent-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
              )}
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
