"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "@/components/app/app-shell";
import { AppBanner } from "@/components/app/app-banner";
import { AppContentCard } from "@/components/app/app-content-card";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { AppHomePanel } from "@/components/app/app-home-panel";
import { isAppNavId, type AppNavId } from "@/components/app/app-tabs";
import { CoverPanel } from "@/components/app/cover-panel";
import { HistoryPanel } from "@/components/app/history-panel";
import { WalletPanel } from "@/components/app/wallet-panel";
import { useManagerId } from "@/lib/use-manager";

function navFromQuery(tab: string | null): AppNavId {
  if (isAppNavId(tab)) return tab;
  return "home";
}

export default function AppPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const account = useCurrentAccount();
  const connected = Boolean(account?.address);
  const [nav, setNav] = useState<AppNavId>(navFromQuery(searchParams.get("tab")));
  const { managerId } = useManagerId();

  useEffect(() => {
    setNav(navFromQuery(searchParams.get("tab")));
  }, [searchParams]);

  const handleNavChange = (id: AppNavId) => {
    setNav(id);
    const path = id === "home" ? "/app" : `/app?tab=${id}`;
    router.replace(path);
  };

  return (
    <AppShell
      nav={nav}
      onNavChange={handleNavChange}
      connected={connected}
    >
      {/* <AppBanner /> */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <AppContentCard>
          {!connected ? (
            <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <AppEmptyState />
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {nav === "home" && <AppHomePanel onGetQuote={() => handleNavChange("cover")} />}
              {nav === "cover" && (
                <CoverPanel onViewHistory={() => handleNavChange("history")} />
              )}
              {nav === "history" && <HistoryPanel />}
              {nav === "wallet" && <WalletPanel managerId={managerId} />}
            </div>
          )}
        </AppContentCard>
      </div>
    </AppShell>
  );
}
