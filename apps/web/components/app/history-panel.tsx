"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import { formatExpiry } from "@/lib/use-cover-quote";
import { useManagerId } from "@/lib/use-manager";
import { useKeeperHealth, useManagerPolicies, type KeeperPolicy } from "@/lib/keeper";
import { PolicyReceiptBody } from "@/components/app/receipt-detail";
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
  policy,
  label,
  expanded,
  bordered,
  managerId,
  onToggle,
}: {
  policy: KeeperPolicy;
  label: string;
  expanded: boolean;
  bordered?: boolean;
  managerId: string | null;
  onToggle: () => void;
}) {
  const panelId = `policy-panel-${policy.id}`;

  return (
    <div className={cn(bordered && "border-t border-separator")}>
      <button
        type="button"
        id={`policy-trigger-${policy.id}`}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm text-content-primary transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[-2px] md:px-6"
      >
        <span className="min-w-0 flex-1 text-pretty">{label}</span>
        <span className="flex shrink-0 items-center gap-2">
          <StatusChip tone={statusTone(policy.status)}>
            {statusLabel(policy.status, policy.payout)}
          </StatusChip>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={cn("text-content-secondary transition-transform duration-200", expanded && "rotate-180")}
            aria-hidden
          />
        </span>
      </button>
      {expanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={`policy-trigger-${policy.id}`}
          className="border-t border-separator bg-black/20 px-5 pb-5 pt-4 md:px-6 md:pb-6"
        >
          <PolicyReceiptBody policy={policy} managerId={managerId} />
        </div>
      )}
    </div>
  );
}

export function HistoryPanel({ expandedPolicyId }: { expandedPolicyId?: string | null }) {
  const router = useRouter();
  const { managerId, loading: managerLoading } = useManagerId();
  const { data: keeperPolicies, isLoading, isError } = useManagerPolicies(managerId);
  const { data: keeper } = useKeeperHealth();

  const live = keeperPolicies && keeperPolicies.length > 0;

  const setExpanded = (id: string | null) => {
    if (id) {
      router.replace(`/app?tab=history&policy=${encodeURIComponent(id)}`, { scroll: false });
    } else {
      router.replace("/app?tab=history", { scroll: false });
    }
  };

  const togglePolicy = (id: string) => {
    setExpanded(expandedPolicyId === id ? null : id);
  };

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
    const expandedExists =
      expandedPolicyId != null && keeperPolicies!.some((p) => p.id === expandedPolicyId);

    return (
      <div className="space-y-4">
        <Muted>
          {keeper?.status === "ok"
            ? "Expand a policy for live price and settlement status."
            : "Policies may take a moment to update after settlement."}
        </Muted>
        {isError && (
          <p className="text-sm text-signal-orange" role="status">
            Couldn&apos;t refresh — showing last known status.
          </p>
        )}
        {expandedPolicyId && !expandedExists && (
          <p className="text-sm text-content-secondary" role="status">
            Your latest policy may appear shortly after purchase.
          </p>
        )}
        <Panel className="overflow-hidden p-0">
          {keeperPolicies!.map((p: KeeperPolicy, i) => {
            const { date, time } = formatExpiry(p.expiryMs);
            return (
              <PolicyRow
                key={p.id}
                policy={p}
                managerId={managerId}
                label={`${date} · ${time} — ${usd(p.coverage, 0)} cover · ${usd(p.premium)} premium`}
                expanded={expandedPolicyId === p.id}
                bordered={i > 0}
                onToggle={() => togglePolicy(p.id)}
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
          We couldn&apos;t load your policies right now. Try again in a moment.
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
        Buy cover on the Cover tab. After purchase confirms, your policy appears here.
      </Muted>
      <PrimaryButton className="max-w-xs" onClick={() => router.push("/app?tab=cover")}>
        Quote cover
      </PrimaryButton>
    </Panel>
  );
}
