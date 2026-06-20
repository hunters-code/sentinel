"use client";

import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";

export function AppHeader() {
  const account = useCurrentAccount();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
      style={{
        background: "var(--sui-black)",
        borderBottom: "1px solid var(--sui-line)",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" width={28} height={28} className="h-7 w-7" aria-hidden />
        <span
          className="text-[15px] font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--sui-white)" }}
        >
          Sentinel
        </span>
      </Link>

      <div className="sentinel-wallet">
        {account ? <ConnectButton /> : <SentinelConnectButton />}
      </div>
    </header>
  );
}
