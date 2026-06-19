"use client";

import { ConnectModal } from "@mysten/dapp-kit";
import { cn } from "@/lib/cn";

type SentinelConnectButtonProps = {
  className?: string;
  label?: string;
};

export function SentinelConnectButton({
  className,
  label = "Connect wallet",
}: SentinelConnectButtonProps) {
  return (
    <ConnectModal
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90",
            className,
          )}
          style={{ background: "var(--sui-blue)", color: "#000" }}
        >
          {label}
        </button>
      }
    />
  );
}
