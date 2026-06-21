"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "@/components/app/app-shell";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { DEFAULT_NAV, isAppNavId, type AppNavId } from "@/components/app/app-tabs";
import { CoverPanel } from "@/components/app/cover-panel";
import { HistoryPanel } from "@/components/app/history-panel";
import { WalletPanel } from "@/components/app/wallet-panel";
import { useManagerId } from "@/lib/use-manager";

function navFromQuery(tab: string | null): AppNavId {
  if (isAppNavId(tab)) return tab;
  return DEFAULT_NAV;
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
    const path = id === DEFAULT_NAV ? "/app" : `/app?tab=${id}`;
    router.replace(path);
  };

  return (
    <AppShell nav={nav} onNavChange={handleNavChange} connected={connected}>
      {!connected ? (
        <AppEmptyState />
      ) : (
        <>
          <div className="min-h-full bg-sui-root px-4 py-5 md:px-6 md:py-6">
            {nav === "cover" && <CoverPanel onViewHistory={() => handleNavChange("history")} />}
            {nav === "history" && <HistoryPanel />}
            {nav === "wallet" && <WalletPanel managerId={managerId} />}
          </div>
        </>
      )}
    </AppShell>
  );
}
