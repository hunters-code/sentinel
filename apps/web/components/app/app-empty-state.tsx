"use client";

import { ShieldCheck, Zap, FileText } from "lucide-react";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "One quote, one signature",
    body: "See your premium, sign once — no strike ladders, no paperwork.",
  },
  {
    icon: Zap,
    title: "Paid automatically",
    body: "Cross the trigger before expiry and the payout lands without you lifting a finger.",
  },
  {
    icon: FileText,
    title: "Honest by default",
    body: "Coverage window follows oracle expiry. Parametric payout — not regulated insurance.",
  },
] as const;

export function AppEmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-5 py-12 md:py-16">
      <div className="w-full max-w-[30rem] text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-card-border bg-black/40 shadow-[inset_0_1px_0_theme(colors.card-accent)]">
          <ShieldCheck size={26} strokeWidth={1.75} className="text-sui-blue-bright" aria-hidden />
        </span>

        <h1 className="text-balance font-display text-[clamp(1.5rem,4vw,2rem)] font-medium leading-[1.1] tracking-[-0.03em] text-content-primary">
          Connect to quote cover
        </h1>
        <p className="mx-auto mt-3 max-w-[26rem] text-pretty text-sm leading-relaxed text-content-secondary">
          Link a Sui wallet to see your premium, sign one purchase, and receive payouts automatically
          at settlement.
        </p>

        <ul className="mx-auto mt-8 mb-8 grid w-full list-none gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border p-0 text-left">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3.5 bg-card-fill px-4 py-3.5">
              <Icon
                size={18}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0 text-sui-blue-bright"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-content-primary">{title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-content-secondary">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <SentinelConnectButton className="w-full max-w-[18rem]" label="Connect wallet" />
      </div>
    </div>
  );
}
