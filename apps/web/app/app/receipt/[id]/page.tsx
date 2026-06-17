"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DEMO_SPOT, getPolicy, type PolicyStatus } from "@/lib/demo-policies";
import { useManagerId } from "@/lib/use-manager";
import { useManagerPolicies } from "@/lib/keeper";
import { formatExpiryUtc } from "@/lib/use-cover-quote";
import { useSpotPrice } from "@/lib/use-oracle-data";
import { cn } from "@/lib/cn";

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

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-md px-5 py-6", className)}>{children}</div>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed border-black/20 py-2.5 text-sm last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className="tnum text-right font-heading">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: PolicyStatus }) {
  const labels: Record<PolicyStatus, string> = {
    active: "ACTIVE",
    paid: "PAID",
    expired: "EXPIRED — NO CLAIM",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-base border-2 border-black px-2.5 py-0.5 text-xs font-base",
        status === "active" ? "bg-black text-white" : "bg-white text-black",
      )}
    >
      {labels[status]}
    </span>
  );
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-base text-black">
      <header className="border-b-2 border-black">
        <Shell className="py-4">
          <Link href="/app" className="flex items-center gap-2 font-heading text-sm hover:underline">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back
          </Link>
        </Shell>
      </header>
      <Shell>{children}</Shell>
    </div>
  );
}

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const decodedId = decodeURIComponent(id);

  const demo = getPolicy(decodedId);
  const { managerId } = useManagerId();
  const { data: keeperPolicies, isLoading } = useManagerPolicies(demo ? null : managerId);

  // Live spot for the price line (oracle id unknown here; use first available)
  const spotQuery = useSpotPrice(null);

  let view: ReceiptView | null = null;

  if (demo) {
    view = {
      id: demo.id,
      status: demo.status,
      coverage: demo.coverage,
      premium: demo.premium,
      trigger: demo.trigger,
      payout: demo.payout,
      subtitle: `${demo.btc} BTC · floor ${usd(demo.trigger, 0)}`,
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
        subtitle: `floor ${usd(kp.strike, 0)}`,
        when: full,
        source: "keeper",
      };
    }
  }

  if (!view) {
    return (
      <ShellFrame>
        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading receipt…</p>
        ) : (
          <>
            <p className="font-heading">Receipt not found.</p>
            <Link href="/app" className="mt-4 inline-block text-sm underline">
              Back to app
            </Link>
          </>
        )}
      </ShellFrame>
    );
  }

  return (
    <ShellFrame>
      <Card className="gap-0 border-2 border-black py-0 shadow-none" hover={false}>
        <CardHeader className="flex flex-row items-center justify-between border-b border-black py-3">
          <span className="text-xs font-heading">
            RECEIPT {view.source === "demo" ? `#${view.id}` : ""}
          </span>
          <StatusBadge status={view.status} />
        </CardHeader>

        <CardContent className="py-4">
          <p className="font-heading text-2xl">{usd(view.coverage, 0)}</p>
          <p className="mt-1 text-sm text-neutral-600">{view.subtitle}</p>

          {view.status === "active" && (
            <div className="mt-4 rounded-base border-2 border-black bg-neutral-50 p-3">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>BTC now</span>
                <span className="tnum font-heading text-black">{usd(spotQuery.data ?? DEMO_SPOT, 0)}</span>
              </div>
              <div className="relative mt-2 h-12">
                <div className="absolute inset-x-0 border-t-2 border-black" style={{ top: "65%" }} />
                <span className="absolute right-0 text-[10px] text-neutral-500" style={{ top: "65%" }}>
                  {usd(view.trigger, 0)}
                </span>
                <div
                  className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-black bg-white"
                  style={{ top: "30%" }}
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <Row label="Premium paid" value={usd(view.premium)} />
            <Row label="Coverage" value={usd(view.coverage, 0)} />
            <Row label="Trigger" value={usd(view.trigger, 0)} />
            <Row label={view.source === "keeper" ? "Settles" : "Date"} value={view.when} />
            {view.status === "paid" && view.payout != null && view.payout > 0 && (
              <Row label="Payout" value={usd(view.payout, 0)} />
            )}
          </div>

          {view.status === "paid" && view.payout != null && view.payout > 0 && (
            <Button
              variant="noShadow"
              fullWidth
              className="mt-4 border-2 border-black bg-black text-white hover:bg-neutral-800"
            >
              Withdraw {usd(view.payout, 0)} to wallet
            </Button>
          )}
        </CardContent>
      </Card>
    </ShellFrame>
  );
}
