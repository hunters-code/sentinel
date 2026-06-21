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
            "inline-flex min-h-11 items-center justify-center rounded-full bg-bg-accent px-5 py-2.5 text-sm font-medium text-content-persistent-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[3px]",
            className,
          )}
        >
          {label}
        </button>
      }
    />
  );
}
