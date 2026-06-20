"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import { formatExpiry } from "@/lib/use-cover-quote";
import { useManagerId } from "@/lib/use-manager";
import { useKeeperHealth, useManagerPolicies, type KeeperPolicy } from "@/lib/keeper";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";
import { PrimaryButton } from "@/components/app/ui/primary-button";
import { StatusChip } from "@/components/app/ui/status-chip";

function statusLabel(status: "active" | "paid" | "expired", payout?: number) {
  if (status === "paid") return payout != null && payout > 0 ? `Paid ${usd(payout, 0)}` : "Paid";
  if (status === "active") return "Active";
  return "Expired · no payout";
}

function statusTone(status: "active" | "paid" | "expired") {
  if (status === "paid") return "paid" as const;
  if (status === "active") return "active" as const;
  return "expired" as const;
}

function PolicyRow({
  href,
  label,
  status,
  payout,
  bordered,
}: {
  href: string;
  label: string;
  status: "active" | "paid" | "expired";
  payout?: number;
  bordered?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm text-content-primary no-underline transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[-2px] md:px-8",
        bordered && "border-t border-separator",
      )}
    >
      <span className="min-w-0 text-pretty">{label}</span>
      <StatusChip tone={statusTone(status)}>{statusLabel(status, payout)}</StatusChip>
    </Link>
  );
}

export function HistoryPanel() {
  const router = useRouter();
  const { managerId, loading: managerLoading } = useManagerId();
  const { data: keeperPolicies, isLoading, isError } = useManagerPolicies(managerId);
  const { data: keeper } = useKeeperHealth();

  const live = keeperPolicies && keeperPolicies.length > 0;

  if (managerLoading || (managerId && isLoading)) {
    return (
      <div className="flex w-full flex-col gap-3 px-1" aria-busy="true" aria-label="Loading policies">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <div className="h-10 w-full max-w-[70%] animate-skeleton-pulse rounded-lg bg-white/[0.08]" />
            <div className="ml-auto h-6 w-16 shrink-0 animate-skeleton-pulse rounded-full bg-white/[0.08]" />
          </div>
        ))}
      </div>
    );
  }

  if (live) {
    return (
      <div className="space-y-4">
        <Muted>
          {keeper?.status === "ok"
            ? "Tap a receipt for live price and settlement status."
            : "Receipts may take a moment to update after settlement."}
        </Muted>
        <Panel className="overflow-hidden p-0">
          {keeperPolicies!.map((p: KeeperPolicy, i) => {
            const { date, time } = formatExpiry(p.expiryMs);
            return (
              <PolicyRow
                key={p.id}
                href={`/app/receipt/${encodeURIComponent(p.id)}`}
                label={`${date} · ${time} — ${usd(p.coverage, 0)} cover · ${usd(p.premium)} premium`}
                status={p.status}
                payout={p.payout}
                bordered={i > 0}
              />
            );
          })}
        </Panel>
      </div>
    );
  }

  if (managerId && isError) {
    return (
      <Panel>
        <h2 className="mb-2 font-display text-lg font-medium">History unavailable</h2>
        <Muted className="mb-6">
          We couldn&apos;t load your receipts right now. Try again in a moment.
        </Muted>
        <PrimaryButton className="max-w-xs" onClick={() => window.location.reload()}>
          Retry
        </PrimaryButton>
      </Panel>
    );
  }

  return (
    <Panel>
      <h2 className="mb-2 font-display text-lg font-medium">No policies yet</h2>
      <Muted className="mb-6">
        Buy cover on the Cover tab. After purchase confirms, your receipt appears here with live
        settlement status.
      </Muted>
      <PrimaryButton className="max-w-xs" onClick={() => router.push("/app?tab=cover")}>
        Quote cover
      </PrimaryButton>
    </Panel>
  );
}
