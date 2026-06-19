"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppHeader } from "@/components/app/app-header";
import { AppShell } from "@/components/app/app-shell";
import { AppTabs, type AppTab } from "@/components/app/app-tabs";
import { CoverPanel } from "@/components/app/cover-panel";
import { HistoryPanel } from "@/components/app/history-panel";
import { WalletPanel } from "@/components/app/wallet-panel";
import { KeeperBadge } from "@/components/app/keeper-badge";
import { SentinelConnectButton } from "@/components/app/sentinel-connect-button";
import { useManagerId } from "@/lib/use-manager";
import { shortAddr } from "@/lib/format";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";

export default function AppPage() {
  const account = useCurrentAccount();
  const connected = Boolean(account?.address);
  const [tab, setTab] = useState<AppTab>("cover");
  const { managerId } = useManagerId();

  return (
    <AppShell>
      <AppHeader />

      <main className="relative mx-auto max-w-lg px-6 pb-16 pt-24 md:px-10 md:pt-28">
        <div className="mb-8">
          <p className="mb-2 text-sm" style={{ color: "var(--sui-blue-bright)" }}>
            Get a quote
          </p>
          <h1 className="text-balance text-[clamp(1.75rem,5vw,2.25rem)] leading-tight">
            Protect your crypto
          </h1>
        </div>

        {!connected ? (
          <Panel className="text-center">
            <h2 className="mb-2 text-lg">Connect your wallet</h2>
            <Muted className="mb-6">
              Connect to buy cover, view policies, and withdraw payouts on Sui testnet.
            </Muted>
            <SentinelConnectButton className="px-8" />
          </Panel>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Muted>{shortAddr(account!.address)} · testnet</Muted>
              <KeeperBadge />
            </div>

            <AppTabs tab={tab} onTabChange={setTab} />

            {tab === "cover" && <CoverPanel onViewHistory={() => setTab("history")} />}
            {tab === "history" && <HistoryPanel />}
            {tab === "wallet" && <WalletPanel managerId={managerId} />}
          </>
        )}
      </main>
    </AppShell>
  );
}
