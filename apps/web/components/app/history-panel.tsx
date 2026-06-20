"use client";

import Link from "next/link";
import { usd } from "@/lib/format";
import { formatExpiryUtc } from "@/lib/use-cover-quote";
import { useManagerId } from "@/lib/use-manager";
import { useKeeperHealth, useManagerPolicies, type KeeperPolicy } from "@/lib/keeper";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";
import { StatusChip } from "@/components/app/ui/status-chip";

function statusLabel(status: "active" | "paid" | "expired", payout?: number) {
  if (status === "paid") return payout != null && payout > 0 ? `Paid ${usd(payout, 0)}` : "Paid";
  if (status === "active") return "Active";
  return "Expired";
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
      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 no-underline transition-colors hover:bg-white/[0.03] md:px-8"
      style={bordered ? { borderTop: "1px solid var(--sui-line)" } : undefined}
    >
      <span className="text-sm" style={{ color: "var(--sui-white)" }}>
        {label}
      </span>
      <StatusChip tone={statusTone(status)}>{statusLabel(status, payout)}</StatusChip>
    </Link>
  );
}

export function HistoryPanel() {
  const { managerId, loading: managerLoading } = useManagerId();
  const { data: keeperPolicies, isLoading, isError } = useManagerPolicies(managerId);
  const { data: keeper } = useKeeperHealth();

  const live = keeperPolicies && keeperPolicies.length > 0;

  if (managerLoading || (managerId && isLoading)) {
    return (
      <div className="app-skeleton-list" aria-busy="true" aria-label="Loading policies">
        {[0, 1, 2].map((i) => (
          <div key={i} className="app-skeleton-row">
            <div className="app-skeleton-circle" />
            <div className="app-skeleton-lines">
              <div className="app-skeleton-line app-skeleton-line-lg" />
              <div className="app-skeleton-line app-skeleton-line-sm" />
            </div>
            <div className="app-skeleton-line app-skeleton-line-xs" />
          </div>
        ))}
      </div>
    );
  }

  if (live) {
    return (
      <div className="space-y-4">
        <Muted>
          {keeper?.status === "ok" ? "Your policies" : "Your policies — keeper offline, data may lag"}
        </Muted>
        <Panel className="overflow-hidden p-0">
          {keeperPolicies!.map((p: KeeperPolicy, i) => {
            const { date, time } = formatExpiryUtc(p.expiryMs);
            return (
              <PolicyRow
                key={p.id}
                href={`/app/receipt/${encodeURIComponent(p.id)}`}
                label={`${date} · ${time} — ${usd(p.coverage, 0)} cover · ${usd(p.premium)} paid`}
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

  if (managerId && !isError) {
    return (
      <Panel>
        <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
          No policies yet
        </h2>
        <Muted>
          Buy cover on the Cover tab. After your purchase confirms, policies appear here with live
          settlement status.
        </Muted>
      </Panel>
    );
  }

  if (managerId && isError) {
    return (
      <Panel>
        <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
          History unavailable
        </h2>
        <Muted>
          Keeper is offline — policy history couldn&apos;t be loaded. Try again shortly.
        </Muted>
      </Panel>
    );
  }

  return (
    <Panel>
      <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
        No policies yet
      </h2>
      <Muted>
        Connect your wallet and buy cover on the Cover tab. After your purchase confirms,
        policies appear here with live settlement status.
      </Muted>
    </Panel>
  );
}
