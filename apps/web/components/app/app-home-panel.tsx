"use client";

import { Shield, Clock, Wallet } from "lucide-react";
import { AppHeroIcon } from "@/components/app/app-hero-icon";
import { AppFeatureCards } from "@/components/app/app-feature-cards";
import { PrimaryButton } from "@/components/app/ui/primary-button";

const STEPS = [
  {
    icon: Shield,
    title: "See the price first",
    body: "Premium comes from DeepBook Predict's live ask. You sign the same number we show.",
  },
  {
    icon: Clock,
    title: "About an hour of cover",
    body: "Trigger sits 2% below spot. BTC finishes below it at expiry, you get the payout.",
  },
  {
    icon: Wallet,
    title: "Payout without a claim",
    body: "Winning policies settle on-chain. Pull dUSDC to your wallet when you're ready.",
  },
] as const;

export function AppHomePanel({ onGetQuote }: { onGetQuote: () => void }) {
  return (
    <div className="app-empty-state">
      <AppHeroIcon />
      <h1 className="app-empty-title">Crash cover for your crypto</h1>
      <p className="app-empty-lede">
        How much BTC are you holding? We&apos;ll quote cover for roughly the next hour.
      </p>
      <AppFeatureCards items={STEPS} />
      <PrimaryButton className="app-empty-cta" onClick={onGetQuote}>
        Get a quote
      </PrimaryButton>
    </div>
  );
}
