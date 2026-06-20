"use client";

import { Link2, Receipt } from "lucide-react";
import { AppHeroIcon } from "@/components/app/app-hero-icon";
import { AppFeatureCards } from "@/components/app/app-feature-cards";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";

const STEPS = [
  {
    icon: Link2,
    title: "Connect a Sui wallet",
    body: "Cover is paid in dUSDC. Your wallet signs the purchase and holds the receipt.",
  },
  {
    icon: Receipt,
    title: "One quote, one receipt",
    body: "No strike ladder. Enter your BTC size, check the premium, buy if it looks right.",
  },
] as const;

export function AppEmptyState() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center text-center">
      <AppHeroIcon />
      <h1 className="mb-3 mt-0 max-w-[22rem] text-balance text-[clamp(1.125rem,3.5vw,1.375rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-content-primary">
        Connect wallet to buy cover
      </h1>
      <p className="mb-5 mt-0 max-w-[22rem] text-pretty text-sm leading-normal text-content-secondary">
        Link your wallet to quote cover and receive payouts.
      </p>
      <AppFeatureCards items={STEPS} />
      <SentinelConnectButton className="w-full max-w-[16rem]" label="Connect wallet" />
    </div>
  );
}
