"use client";

import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import { SentinelNavMenu } from "@/components/header/sentinel-nav-menu";

export function AppHeader() {
  const account = useCurrentAccount();

  return (
    <header className="sentinel-header fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="relative z-[1] flex shrink-0 items-center gap-2.5 no-underline">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold"
            style={{ background: "var(--sui-blue)", color: "#000" }}
            aria-hidden
          >
            S
          </span>
          <span
            className="text-[15px] font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--sui-white)" }}
          >
            Sentinel
          </span>
        </Link>

        <div className="pointer-events-none absolute inset-x-6 hidden justify-center sm:inset-x-10 sm:flex">
          <div className="pointer-events-auto">
            <SentinelNavMenu
              items={[
                { href: "/", label: "Home" },
                { href: "/app", label: "Quote", active: true },
              ]}
            />
          </div>
        </div>

        <div className="sentinel-wallet relative z-[1] shrink-0">
          {account ? <ConnectButton /> : <SentinelConnectButton />}
        </div>
      </div>
    </header>
  );
}
