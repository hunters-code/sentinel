"use client";

import { useKeeperHealth } from "@/lib/keeper";
import { StatusChip } from "@/components/app/ui/status-chip";

export function KeeperBadge() {
  const { data, isLoading, isError } = useKeeperHealth();
  const live = !isLoading && !isError && data?.status === "ok";

  return (
    <StatusChip tone={live ? "live" : "offline"}>
      Auto-payout {live ? `live${data?.dryRun ? " (dry-run)" : ""}` : "offline"}
    </StatusChip>
  );
}
