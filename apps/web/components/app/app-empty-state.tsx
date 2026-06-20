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
    <div className="app-empty-state">
      <AppHeroIcon />
      <h1 className="app-empty-title">Connect wallet to buy cover</h1>
      <p className="app-empty-lede">
        Link your wallet to quote cover and receive payouts.
      </p>
      <AppFeatureCards items={STEPS} />
      <SentinelConnectButton className="app-empty-cta" label="Connect wallet" />
    </div>
  );
}
