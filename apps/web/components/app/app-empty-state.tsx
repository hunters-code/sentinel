"use client";

import { ShieldCheck } from "lucide-react";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";

export function AppEmptyState() {
  return (
    <Panel className="flex flex-col items-center gap-6 px-6 py-12 text-center md:py-14">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-card-border bg-black/40">
        <ShieldCheck size={22} strokeWidth={1.75} className="text-sui-blue-bright" aria-hidden />
      </span>

      <div className="space-y-2">
        <h1 className="text-balance font-display text-xl font-medium tracking-[-0.03em] text-content-primary md:text-2xl">
          Quote cover
        </h1>
        <Muted className="mx-auto max-w-[14rem] text-sm">Connect wallet to see your premium.</Muted>
      </div>

      <SentinelConnectButton className="w-full max-w-[16rem]" />
    </Panel>
  );
}
