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

      <div className="sentinel-wallet">
        {account ? <ConnectButton /> : <SentinelConnectButton />}
      </div>
    </header>
  );
}
