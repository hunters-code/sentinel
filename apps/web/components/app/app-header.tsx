"use client";

import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import { SentinelNavMenu } from "@/components/header/sentinel-nav-menu";
import { SentinelLogo } from "@/components/sentinel-logo";

export function AppHeader() {
  const account = useCurrentAccount();

  return (
    <header className="sentinel-header fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="sentinel-header-brand relative z-[1]">
          <SentinelLogo size={38} />
          <span className="sentinel-header-brand-name">Sentinel</span>
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
