"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { DEMO_POLICIES } from "@/lib/demo-policies";
import {
  buildCoverQuote,
  COVER_TERMS,
  formatExpiryUtc,
  snapTermToOracle,
  useOracleOptions,
} from "@/lib/use-cover-quote";
import { QUOTE_FRESHNESS_MS } from "@sentinel/shared";
import { useWalletBtc } from "@/lib/use-wallet-btc";
import { useManagerId } from "@/lib/use-manager";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { useOracleData, useOnChainPremium } from "@/lib/use-oracle-data";
import { usePurchase, useWithdraw } from "@/lib/use-purchase";
import { useKeeperHealth, useManagerPolicies, type KeeperPolicy } from "@/lib/keeper";

type Tab = "cover" | "history" | "wallet";

const TABS: { id: Tab; label: string }[] = [
  { id: "cover", label: "Cover" },
  { id: "history", label: "History" },
  { id: "wallet", label: "Wallet" },
];

const usd = (n: number, max = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  }).format(n);

const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

function KeeperBadge() {
  const { data, isLoading, isError } = useKeeperHealth();
  const live = !isLoading && !isError && data?.status === "ok";
  return (
    <span className="tag">
      Auto-payout {live ? `live${data?.dryRun ? " (dry-run)" : ""}` : "offline"}
    </span>
  );
}

function QuoteFreshnessBadge({ createdAtMs }: { createdAtMs: number }) {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    const check = () => setStale(Date.now() - createdAtMs > QUOTE_FRESHNESS_MS);
    check();
    const id = setInterval(check, 1_000);
    return () => clearInterval(id);
  }, [createdAtMs]);

  if (!stale) return null;
  return <p className="muted">Quote expired — prices may have changed</p>;
}

function CoverPanel() {
  const { btc: detectedBtc, fromWallet, loading: btcLoading } = useWalletBtc();
  const { options, loading: oracleLoading } = useOracleOptions();
  const { managerId } = useManagerId();
  const { balance: managerBalanceUsd } = useManagerBalance(managerId);

  const [btcInput, setBtcInput] = useState("");
  const [btcTouched, setBtcTouched] = useState(false);
  const [termId, setTermId] = useState<string>(COVER_TERMS[0]!.id);

  const { purchase, status, error } = usePurchase();
  const signing = status === "checking" || status === "signing" || status === "confirming";

  useEffect(() => {
    if (detectedBtc != null && !btcTouched) {
      setBtcInput(String(detectedBtc));
    }
  }, [detectedBtc, btcTouched]);

  const btcHeld = Math.max(0, Number(btcInput) || 0);

  const selectedTerm = COVER_TERMS.find((t) => t.id === termId) ?? COVER_TERMS[0]!;
  const { oracle: selectedOracle, capped } = snapTermToOracle(options, selectedTerm);

  const { spot, svi } = useOracleData(selectedOracle?.oracleId ?? null);

  const baseQuote = useMemo(
    () => buildCoverQuote(btcHeld, selectedOracle, spot, svi),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [btcHeld, selectedOracle, spot, svi],
  );

  // The protocol's real price for this exact cover (get_trade_amounts). This is
  // what the user is actually charged; the SVI math is only a fallback while it
  // loads. Override the displayed/charged premium with it when available.
  const { premium: livePremium, loading: premiumLoading } = useOnChainPremium({
    oracleId: selectedOracle?.oracleId ?? null,
    expiryRaw: selectedOracle?.expiryMs ?? null,
    strikeUsd: baseQuote.strike,
    coverageUsd: baseQuote.coverage,
  });
  const premiumIsLive = livePremium != null;
  const quote = useMemo(
    () => ({ ...baseQuote, premium: livePremium ?? baseQuote.premium }),
    [baseQuote, livePremium],
  );

  const demoOracle = Boolean(selectedOracle?.isDemo);
  const ready = !btcLoading && !oracleLoading && quote.valid;

  const buttonLabel = () => {
    if (status === "checking") return "Checking price…";
    if (status === "signing") return "Confirm in wallet…";
    if (status === "confirming") return "Submitting…";
    if (status === "success") return "Purchase confirmed!";
    if (premiumLoading && !premiumIsLive) return "Getting price…";
    return `Protect — ${usd(quote.premium)}`;
  };

  return (
    <div className="box stack">
      <div>
        <div className="row">
          <label htmlFor="btc">How much BTC?</label>
          {fromWallet && detectedBtc != null && (
            <button
              type="button"
              onClick={() => {
                setBtcTouched(true);
                setBtcInput(String(detectedBtc));
              }}
            >
              Use balance ({detectedBtc.toLocaleString(undefined, { maximumFractionDigits: 4 })})
            </button>
          )}
        </div>
        <div className="field">
          <input
            id="btc"
            inputMode="decimal"
            value={btcInput}
            onChange={(e) => {
              setBtcTouched(true);
              setBtcInput(e.target.value.replace(/[^0-9.]/g, ""));
            }}
          />
          <span className="muted">BTC</span>
        </div>
        <p className="muted">
          {btcLoading
            ? "Detecting your balance…"
            : fromWallet
              ? "Detected from your wallet — edit anytime"
              : "Enter the amount you want to cover"}
        </p>
      </div>

      <div>
        <p>Cover for how long?</p>
        <p className="muted">
          Your floor is set from today&rsquo;s BTC price. Pick how long it&rsquo;s protected.
        </p>
        <div>
          {COVER_TERMS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTermId(t.id)}
              aria-pressed={t.id === termId}
              style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {oracleLoading ? (
          <p className="muted">Loading terms…</p>
        ) : capped && selectedOracle ? (
          <p className="muted">
            On testnet, settlement windows top out at ~3 weeks — this {selectedTerm.label} quote
            settles on the longest available window ({formatExpiryUtc(selectedOracle.expiryMs).full}).
          </p>
        ) : null}
      </div>

      {ready && (
        <div className="box">
          <p className="muted">BTC at {usd(quote.spot, 0)}</p>
          <p>
            If BTC is at or below {usd(quote.strike, 0)} when your {selectedTerm.label} cover settles
            ({quote.expiryLabel})
          </p>
          <p>{usd(quote.coverage, 0)}</p>
          <p className="muted">to you · premium {usd(quote.premium)}</p>
          {quote.floorBinds && <p className="muted">1% minimum premium applies</p>}
        </div>
      )}

      {ready && (
        <>
          {status === "error" && error && <p className="muted">{error}</p>}

          {status !== "success" ? (
            <>
              {quote.valid && <QuoteFreshnessBadge createdAtMs={quote.createdAtMs} />}
              {demoOracle && (
                <p className="muted">No settlement window available right now — try a different term.</p>
              )}
              <button
                type="button"
                className="btn--full"
                disabled={signing || demoOracle || !premiumIsLive}
                onClick={() => {
                  if (!selectedOracle) return;
                  purchase(quote, selectedOracle, managerId, managerBalanceUsd);
                }}
              >
                {buttonLabel()}
              </button>
            </>
          ) : (
            <p>Purchase confirmed — check History</p>
          )}

          <details>
            <summary>How is this priced?</summary>
            <div className="stack">
              {premiumIsLive ? (
                <>
                  <div className="row">
                    <span>Protocol price</span>
                    <strong>{usd(quote.premium)}</strong>
                  </div>
                  <p className="muted">
                    Live ask from DeepBook Predict for this exact cover — {(
                      (quote.premium / quote.coverage) * 100
                    ).toFixed(2)}% of the {usd(quote.coverage, 0)} payout. Parametric payout, not
                    regulated insurance.
                  </p>
                </>
              ) : (
                <>
                  <div className="row">
                    <span>Estimated price</span>
                    <strong>{usd(quote.premium)}</strong>
                  </div>
                  <p className="muted">Estimate — confirming the live protocol price…</p>
                </>
              )}
            </div>
          </details>
        </>
      )}
    </div>
  );
}

function statusLabel(status: "active" | "paid" | "expired", payout?: number) {
  if (status === "paid") return payout != null && payout > 0 ? `PAID ${usd(payout, 0)}` : "PAID";
  if (status === "active") return "ACTIVE";
  return "EXPIRED";
}

function HistoryPanel() {
  const { managerId, loading: managerLoading } = useManagerId();
  const { data: keeperPolicies, isLoading, isError } = useManagerPolicies(managerId);

  const live = keeperPolicies && keeperPolicies.length > 0;

  if (managerLoading || (managerId && isLoading)) {
    return <p className="muted">Loading your policies…</p>;
  }

  if (live) {
    return (
      <div className="stack">
        <p className="muted">Your policies · live from keeper</p>
        <div className="box stack">
          {keeperPolicies!.map((p: KeeperPolicy) => {
            const { date, time } = formatExpiryUtc(p.expiryMs);
            return (
              <Link key={p.id} href={`/app/receipt/${encodeURIComponent(p.id)}`} className="row">
                <span>
                  {date} · {time} — {usd(p.coverage, 0)} cover · {usd(p.premium)} paid
                </span>
                <span className="tag">{statusLabel(p.status, p.payout)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <p className="muted">
        {managerId
          ? isError
            ? "Keeper offline — showing sample policies"
            : "No policies yet — sample shown below"
          : "No policies yet — buy your first cover"}
      </p>
      <div className="box stack">
        {DEMO_POLICIES.map((item) => (
          <Link key={item.id} href={`/app/receipt/${item.id}`} className="row">
            <span>
              #{item.id} · {item.date} — {usd(item.coverage, 0)} · paid {usd(item.premium)}
            </span>
            <span className="tag">{statusLabel(item.status, item.payout)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function WalletPanel({ managerId }: { managerId: string | null }) {
  const { balance, loading: balanceLoading, refetch } = useManagerBalance(managerId);
  const { withdraw, withdrawing, done, error } = useWithdraw();

  if (!managerId) {
    return (
      <div className="box">
        <p className="muted">Buy your first cover to create a manager account.</p>
      </div>
    );
  }

  return (
    <div className="box stack">
      <p className="muted">Manager balance</p>
      <p>{balanceLoading ? "…" : usd(balance)}</p>
      <p className="muted">dUSDC ready to withdraw</p>

      {error && <p className="muted">{error}</p>}

      {done ? (
        <p>Sent to your wallet</p>
      ) : (
        <button
          type="button"
          className="btn--full"
          disabled={balance <= 0 || withdrawing || balanceLoading}
          onClick={() => {
            if (managerId) {
              withdraw(managerId, balance).then(() => refetch());
            }
          }}
        >
          {withdrawing ? "Withdrawing…" : "Withdraw to wallet"}
        </button>
      )}
    </div>
  );
}

export default function AppPage() {
  const account = useCurrentAccount();
  const connected = Boolean(account?.address);
  const [tab, setTab] = useState<Tab>("cover");
  const { managerId } = useManagerId();

  return (
    <div>
      <header style={{ borderBottom: "1px solid #ccc" }}>
        <div className="wrap wrap--narrow row" style={{ alignItems: "center" }}>
          <Link href="/">Home</Link>
          <span>SENTINEL</span>
          <ConnectButton />
        </div>
      </header>

      <main className="wrap wrap--narrow">
        {!connected ? (
          <div className="box">
            <p>Connect wallet</p>
            <p className="muted">Connect to buy cover and view your policies.</p>
            <ConnectButton />
          </div>
        ) : (
          <>
            <div className="row">
              <p className="muted">{shortAddr(account!.address)} · testnet</p>
              <KeeperBadge />
            </div>

            <nav aria-label="App menu">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-current={tab === id ? "page" : undefined}
                  style={{ marginRight: "0.5rem" }}
                >
                  {label}
                </button>
              ))}
            </nav>

            <hr />

            {tab === "cover" && <CoverPanel />}
            {tab === "history" && <HistoryPanel />}
            {tab === "wallet" && <WalletPanel managerId={managerId} />}
          </>
        )}
      </main>
    </div>
  );
}
