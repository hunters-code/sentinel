"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DEMO_SPOT, getPolicy, type PolicyStatus } from "@/lib/demo-policies";
import { useManagerId } from "@/lib/use-manager";
import { useManagerPolicies } from "@/lib/keeper";
import { formatExpiryUtc } from "@/lib/use-cover-quote";
import { useSpotPrice } from "@/lib/use-oracle-data";

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
  active: "ACTIVE",
  paid: "PAID",
  expired: "EXPIRED — NO CLAIM",
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ borderBottom: "1px solid #ccc" }}>
        <div className="wrap wrap--narrow">
          <Link href="/app">Back</Link>
        </div>
      </header>
      <main className="wrap wrap--narrow">{children}</main>
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
      <Frame>
        {isLoading ? (
          <p className="muted">Loading receipt…</p>
        ) : (
          <>
            <p>Receipt not found.</p>
            <Link href="/app">Back to app</Link>
          </>
        )}
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="box stack">
        <div className="row">
          <span className="tag">RECEIPT {view.source === "demo" ? `#${view.id}` : ""}</span>
          <span className="tag">{STATUS_LABELS[view.status]}</span>
        </div>

        <p>{usd(view.coverage, 0)}</p>
        <p className="muted">{view.subtitle}</p>

        {view.status === "active" && (
          <div className="box">
            <div className="row">
              <span>BTC now</span>
              <span>{usd(spotQuery.data ?? DEMO_SPOT, 0)}</span>
            </div>
            <div className="row">
              <span>Trigger</span>
              <span>{usd(view.trigger, 0)}</span>
            </div>
          </div>
        )}

        <table>
          <tbody>
            <tr>
              <td>Premium paid</td>
              <td>{usd(view.premium)}</td>
            </tr>
            <tr>
              <td>Coverage</td>
              <td>{usd(view.coverage, 0)}</td>
            </tr>
            <tr>
              <td>Trigger</td>
              <td>{usd(view.trigger, 0)}</td>
            </tr>
            <tr>
              <td>{view.source === "keeper" ? "Settles" : "Date"}</td>
              <td>{view.when}</td>
            </tr>
            {view.status === "paid" && view.payout != null && view.payout > 0 && (
              <tr>
                <td>Payout</td>
                <td>{usd(view.payout, 0)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {view.status === "paid" && view.payout != null && view.payout > 0 && (
          <button type="button" className="btn--full">
            Withdraw {usd(view.payout, 0)} to wallet
          </button>
        )}
      </div>
    </Frame>
  );
}
