"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Clock3, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import { shortAddr } from "@/lib/format";
import { SentinelLogo } from "@/components/sentinel-logo";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import type { AppNavId } from "@/components/app/app-tabs";

const NAV: { id: AppNavId; label: string; icon: typeof ShieldCheck }[] = [
  { id: "cover", label: "Cover", icon: ShieldCheck },
  { id: "history", label: "History", icon: Clock3 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

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
        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border-neutral bg-[var(--color-background-inverse-bleedthrough-weak)] py-1.5 pl-3 pr-2.5 text-[0.8125rem] font-medium tabular-nums text-content-primary transition-colors hover:bg-[var(--color-background-inverse-bleedthrough-medium)]"
        title={address}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-bg-accent" aria-hidden />
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
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 min-w-[9rem] rounded-xl border border-border-neutral bg-[var(--color-shell-surface)] p-1 shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full cursor-pointer rounded-lg border-none bg-transparent px-2.5 py-2 text-left text-sm font-medium text-content-primary transition-colors duration-150 hover:bg-[var(--color-background-inverse-bleedthrough-medium)]"
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

function NavLink({
  id,
  label,
  icon: Icon,
  active,
  onSelect,
  reduceMotion,
}: {
  id: AppNavId;
  label: string;
  icon: typeof ShieldCheck;
  active: boolean;
  onSelect: (id: AppNavId) => void;
  reduceMotion: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-[color,background-color,box-shadow] duration-200 sm:gap-2 sm:px-4",
        active
          ? "text-content-primary"
          : "text-content-secondary hover:bg-[var(--color-liquid-nav-hover)] hover:text-content-primary hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:backdrop-blur-md",
      )}
    >
      {active && (
        <motion.span
          layoutId="app-nav-liquid"
          className="absolute inset-0 rounded-full border border-[var(--color-liquid-nav-border)] bg-[var(--color-liquid-nav-hover)] shadow-[var(--color-liquid-nav-shadow)] backdrop-blur-md"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 34, mass: 0.85 }
          }
          aria-hidden
        />
      )}
      <Icon
        size={16}
        strokeWidth={2}
        className={cn("relative z-[1] shrink-0", active ? "text-sui-blue-bright" : "opacity-75")}
        aria-hidden
      />
      <span className="relative z-[1]">{label}</span>
    </button>
  );
}

export function AppTopBar({
  nav,
  onNavChange,
  connected,
}: {
  nav: AppNavId;
  onNavChange: (nav: AppNavId) => void;
  connected?: boolean;
}) {
  const account = useCurrentAccount();
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-[2] shrink-0 border-b border-[var(--color-chrome-border)] bg-sui-black px-4 py-3 md:px-6">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link
          href="/app"
          aria-label="Sentinel"
          className="flex shrink-0 items-center justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[3px]"
          onClick={() => onNavChange("cover")}
        >
          <SentinelLogo size={28} />
        </Link>

        <nav
          aria-label="App navigation"
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--color-liquid-nav-border)] bg-[var(--color-liquid-nav-bg)] p-1 shadow-[var(--color-liquid-nav-shadow)] backdrop-blur-xl sm:gap-1"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.id}
              {...item}
              active={nav === item.id}
              onSelect={onNavChange}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-self-end gap-2">
          {connected && account?.address ? (
            <AccountMenu address={account.address} />
          ) : (
            <SentinelConnectButton label="Connect" className="!min-h-9 !py-1.5 !text-[0.8125rem]" />
          )}
        </div>
      </div>
    </header>
  );
}
