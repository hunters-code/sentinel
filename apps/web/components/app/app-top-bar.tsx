"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { shortAddr } from "@/lib/format";
import { SentinelLogo } from "@/components/sentinel-logo";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";

function AccountMenu({ address }: { address: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { mutate: disconnect } = useDisconnectWallet();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border-neutral bg-black/30 py-1.5 pl-3 pr-2.5 text-[0.8125rem] font-medium tabular-nums text-content-primary transition-colors hover:bg-white/[0.06]"
        title={address}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-content-positive" aria-hidden />
        {shortAddr(address)}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={cn("opacity-60 transition-transform duration-150", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 min-w-[9rem] rounded-xl border border-border-neutral bg-sui-black p-1 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full cursor-pointer rounded-lg border-none bg-transparent px-2.5 py-2 text-left text-sm font-medium text-content-persistent-white transition-colors duration-150 hover:bg-white/[0.08]"
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export function AppTopBar({ connected }: { connected?: boolean }) {
  const account = useCurrentAccount();

  return (
    <header className="sticky top-0 z-[2] flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] bg-sui-black px-4 py-3 md:px-6">
      <Link
        href="/app"
        aria-label="Sentinel"
        className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[3px]"
      >
        <SentinelLogo size={30} />
      </Link>

      {connected && account?.address ? (
        <AccountMenu address={account.address} />
      ) : (
        <SentinelConnectButton label="Connect" className="!min-h-9 !py-1.5 !text-[0.8125rem]" />
      )}
    </header>
  );
}
