"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getPolicy, type PolicyStatus } from "@/lib/demo-policies";
import { useManagerId } from "@/lib/use-manager";
import { useManagerPolicies } from "@/lib/keeper";
import { formatExpiryUtc } from "@/lib/use-cover-quote";
import { useLiveBtcPrice } from "@/lib/use-oracle-data";
import { AppShell } from "@/components/app/app-shell";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";
import { PrimaryButton } from "@/components/app/ui/primary-button";
import { StatusChip } from "@/components/app/ui/status-chip";

type ReceiptView = {
  id: string;
  status: PolicyStatus;
  coverage: number;
  premium: number;
  trigger: number;
  payout?: number;
  subtitle: string;
  when: string;
  source: "demo" | "keeper";
};

const usd = (n: number, max = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  }).format(n);

const STATUS_LABELS: Record<PolicyStatus, string> = {
  active: "Active",
  paid: "Paid",
  expired: "Expired — no claim",
};

const STATUS_TONE: Record<PolicyStatus, "active" | "paid" | "expired"> = {
  active: "active",
  paid: "paid",
  expired: "expired",
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center px-6 py-4 md:px-10"
        style={{ background: "var(--sui-black)", borderBottom: "1px solid var(--sui-line)" }}
      >
        <Link
          href="/app"
          className="inline-flex min-h-11 items-center gap-2 text-sm no-underline transition-colors hover:text-white"
          style={{ color: "var(--sui-steel)" }}
        >
          <span aria-hidden>←</span> Back
        </Link>
      </header>
      <main className="relative mx-auto max-w-lg px-6 pb-16 pt-24 md:px-10 md:pt-28">{children}</main>
    </AppShell>
  );
}

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3"
      style={{ borderTop: "1px solid var(--sui-line)" }}
    >
      <span className="text-sm" style={{ color: "var(--sui-steel)" }}>
        {label}
      </span>
      <span
        className="text-sm font-medium"
        style={{ color: accent ? "#7df752" : "var(--sui-white)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const decodedId = decodeURIComponent(id);

  const demo = getPolicy(decodedId);
  const { managerId } = useManagerId();
  const { data: keeperPolicies, isLoading } = useManagerPolicies(demo ? null : managerId);

  // Live spot for the price line — tracks the real BTC market.
  const spotQuery = useLiveBtcPrice();

  let view: ReceiptView | null = null;

  if (demo) {
    view = {
      id: demo.id,
      status: demo.status,
      coverage: demo.coverage,
      premium: demo.premium,
      trigger: demo.trigger,
      payout: demo.payout,
      subtitle: `${demo.btc} BTC · trigger ${usd(demo.trigger, 0)}`,
      when: demo.date,
      source: "demo",
    };
  } else if (keeperPolicies) {
    const kp = keeperPolicies.find((p) => p.id === decodedId);
    if (kp) {
      const { full } = formatExpiryUtc(kp.expiryMs);
      view = {
        id: kp.id,
        status: kp.status,
        coverage: kp.coverage,
        premium: kp.premium,
        trigger: kp.strike,
        payout: kp.payout,
        subtitle: `trigger ${usd(kp.strike, 0)}`,
        when: full,
        source: "keeper",
      };
    }
  }

  if (!view) {
    return (
      <Frame>
        {isLoading ? (
          <Panel aria-busy="true">
            <div className="space-y-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-20 animate-pulse rounded-xl bg-white/5" />
            </div>
          </Panel>
        ) : (
          <Panel className="text-center">
            <h1 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
              Receipt not found
            </h1>
            <Muted className="mb-6">
              This policy isn&apos;t on record for the connected wallet.
            </Muted>
            <Link
              href="/app"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium no-underline transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--sui-line)", color: "var(--sui-white)" }}
            >
              Back to app
            </Link>
          </Panel>
        )}
      </Frame>
    );
  }

  const isPaidOut = view.status === "paid" && view.payout != null && view.payout > 0;

  return (
    <Frame>
      <div className="mb-8">
        <p className="mb-2 text-sm" style={{ color: "var(--sui-blue-bright)" }}>
          Receipt{view.source === "demo" ? ` · #${view.id}` : ""}
        </p>
        <h1 className="text-balance text-[clamp(1.75rem,5vw,2.25rem)] leading-tight">
          Your cover
        </h1>
      </div>

      <div className="space-y-6">
        {/* Coverage summary */}
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Muted>Coverage</Muted>
            <StatusChip tone={STATUS_TONE[view.status]}>{STATUS_LABELS[view.status]}</StatusChip>
          </div>
          <p
            className="text-[clamp(2rem,8vw,2.75rem)] leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--sui-white)" }}
          >
            {usd(view.coverage, 0)}
          </p>
          <Muted className="mt-3">{view.subtitle}</Muted>
        </Panel>

        {/* Live price line — only while the policy is open */}
        {view.status === "active" && (
          <Panel>
            <Muted className="mb-4">Live BTC price · settlement at trigger</Muted>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs" style={{ color: "var(--sui-steel)" }}>
                  BTC now
                </p>
                <p
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sui-white)" }}
                >
                  {usd(spotQuery.data ?? 100_000, 0)}
                </p>
              </div>
              <span aria-hidden style={{ color: "var(--sui-steel-dark)" }}>
                →
              </span>
              <div className="text-right">
                <p className="text-xs" style={{ color: "var(--sui-steel)" }}>
                  Trigger
                </p>
                <p
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sui-blue-bright)" }}
                >
                  {usd(view.trigger, 0)}
                </p>
              </div>
            </div>
          </Panel>
        )}

        {/* Detail breakdown */}
        <Panel>
          <h2 className="mb-1 text-lg" style={{ fontFamily: "var(--font-display)" }}>
            Policy details
          </h2>
          <div className="mt-3">
            <DetailRow label="Premium paid" value={usd(view.premium)} />
            <DetailRow label="Coverage" value={usd(view.coverage, 0)} />
            <DetailRow label="Trigger" value={usd(view.trigger, 0)} />
            <DetailRow label={view.source === "keeper" ? "Settles" : "Date"} value={view.when} />
            {isPaidOut && <DetailRow label="Payout" value={usd(view.payout!, 0)} accent />}
          </div>
        </Panel>

        {isPaidOut && (
          <PrimaryButton>Withdraw {usd(view.payout!, 0)} to wallet</PrimaryButton>
        )}

        <Muted>
          Parametric payout, settled on-chain at the oracle print. Not regulated insurance.
        </Muted>
      </div>
    </Frame>
  );
}
