"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import { shortPolicyRef } from "@/lib/policy-id";
import { formatExpiry } from "@/lib/use-cover-quote";
import { useCountdown } from "@/lib/use-countdown";
import { useLiveBtcPrice } from "@/lib/use-oracle-data";
import type { KeeperPolicy, KeeperPolicyStatus } from "@/lib/keeper";
import { Muted } from "@/components/app/ui/muted";
import { QuoteLiveLine } from "@/components/app/quote-live-line";
import { PolicyPayoutActions } from "@/components/app/policy-payout-actions";

function triggerDelta(spot: number | undefined, trigger: number): { text: string; warn: boolean } {
  if (spot == null) return { text: "—", warn: false };
  const delta = spot - trigger;
  if (delta <= 0) return { text: "At or below trigger", warn: true };
  return { text: `${usd(delta, 0)} above`, warn: false };
}

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <span className="text-sm text-content-secondary">{label}</span>
      <span
        className={cn(
          "text-right text-sm font-medium tabular-nums",
          accent ? "text-sui-blue-bright" : "text-content-primary",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function LiveMonitor({ spot, trigger, expiryMs }: { spot: number | undefined; trigger: number; expiryMs: number }) {
  const { label, nearExpiry, settling } = useCountdown(expiryMs, true);
  const delta = triggerDelta(spot, trigger);

  return (
    <div className="grid grid-cols-1 gap-4 border-y border-separator py-4 sm:grid-cols-3 sm:gap-3">
      <div>
        <p className="text-xs text-content-secondary">BTC now</p>
        <p className="mt-1 font-display text-lg tabular-nums text-content-primary sm:text-xl">
          {spot != null ? usd(spot, 0) : "—"}
        </p>
      </div>
      <div>
        <p className="text-xs text-content-secondary">To trigger</p>
        <p
          className={cn(
            "mt-1 text-sm font-medium tabular-nums",
            delta.warn ? "text-signal-orange" : "text-content-primary",
          )}
        >
          {delta.text}
        </p>
      </div>
      <div>
        <p className="text-xs text-content-secondary">Expires in</p>
        <p
          className={cn(
            "mt-1 font-display text-lg tabular-nums sm:text-xl",
            nearExpiry || settling ? "text-signal-orange" : "text-content-primary",
          )}
          aria-live="polite"
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function SettledSummary({
  status,
  payout,
  when,
}: {
  status: KeeperPolicyStatus;
  payout: number;
  when: string;
}) {
  const line =
    status === "paid" && payout > 0
      ? `Paid ${usd(payout, 0)} · settled ${when}`
      : `Expired · no payout · ${when}`;

  return (
    <p className="border-y border-separator py-3 text-sm font-medium text-content-secondary">{line}</p>
  );
}

export function PolicyReceiptBody({
  policy,
  managerId,
}: {
  policy: KeeperPolicy;
  managerId: string | null;
}) {
  const spotQuery = useLiveBtcPrice();

  const { full, time } = formatExpiry(policy.expiryMs);
  const isActive = policy.status === "active";
  const isPaidOut = policy.status === "paid" && policy.payout > 0;

  return (
    <div className="space-y-4">
      <QuoteLiveLine
        strike={policy.strike}
        expiryMs={policy.expiryMs}
        coverage={policy.coverage}
      />

      {isActive ? (
        <LiveMonitor spot={spotQuery.data} trigger={policy.strike} expiryMs={policy.expiryMs} />
      ) : (
        <SettledSummary status={policy.status} payout={policy.payout} when={time} />
      )}

      <div className="divide-y divide-separator border-t border-separator">
        <DetailRow label="Premium paid" value={usd(policy.premium)} />
        <DetailRow label="Coverage" value={usd(policy.coverage, 0)} />
        <DetailRow label="Trigger" value={usd(policy.strike, 0)} />
        <DetailRow label="Settles" value={full} />
        <DetailRow label="Policy ref" value={shortPolicyRef(policy.id)} />
        {isPaidOut && <DetailRow label="Payout" value={usd(policy.payout, 0)} accent />}
      </div>

      <PolicyPayoutActions policy={policy} managerId={managerId} />

      <Muted className="block text-pretty text-sm leading-relaxed">
        Parametric payout at oracle expiry. Not regulated insurance.
      </Muted>
    </div>
  );
}
