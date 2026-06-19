"use client";

import Link from "next/link";
import { DEMO_POLICIES } from "@/lib/demo-policies";
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
      <Panel aria-busy="true">
        <div className="space-y-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
      </Panel>
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

  return (
    <div className="space-y-4">
      <Muted>
        {managerId && isError
          ? "Keeper offline — sample policies shown below"
          : "Sample policies — connect and buy cover to see yours"}
      </Muted>
      <Panel className="overflow-hidden p-0">
        {DEMO_POLICIES.map((item, i) => (
          <PolicyRow
            key={item.id}
            href={`/app/receipt/${item.id}`}
            label={`#${item.id} · ${item.date} — ${usd(item.coverage, 0)} · paid ${usd(item.premium)}`}
            status={item.status}
            payout={item.payout}
            bordered={i > 0}
          />
        ))}
      </Panel>
    </div>
  );
}
