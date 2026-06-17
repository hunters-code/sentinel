"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEMO_POLICIES } from "@/lib/demo-policies";
import {
  buildCoverQuote,
  durationLabel,
  formatExpiryUtc,
  formatPickedLocal,
  parseDatetimeLocal,
  snapToOracle,
  toDatetimeLocalValue,
  useOracleOptions,
  type CoverQuote,
  type OracleOption,
} from "@/lib/use-cover-quote";
import { MIN_EXPIRY_LEAD_MS, QUOTE_FRESHNESS_MS } from "@sentinel/shared";
import { useWalletBtc } from "@/lib/use-wallet-btc";
import { useManagerId } from "@/lib/use-manager";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { useOracleData } from "@/lib/use-oracle-data";
import { usePurchase, useWithdraw } from "@/lib/use-purchase";
import { useKeeperHealth, useManagerPolicies, type KeeperPolicy } from "@/lib/keeper";
import { cn } from "@/lib/cn";

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

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-md px-5 py-6", className)}>{children}</div>
  );
}

function MenuButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex-1 rounded-base border-2 border-black px-2 py-2.5 text-xs font-heading transition-colors sm:text-sm",
        active ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100",
      )}
    >
      {children}
    </button>
  );
}

function minsLabel(expiryMs: number) {
  return durationLabel(expiryMs);
}

type PickMode = "list" | "custom";

function KeeperBadge() {
  const { data, isLoading, isError } = useKeeperHealth();
  const live = !isLoading && !isError && data?.status === "ok";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-base border-2 border-black px-2 py-0.5 text-[11px] font-heading",
        live ? "bg-black text-white" : "bg-white text-neutral-500",
      )}
      title={
        live
          ? `Auto-payout keeper online${data?.dryRun ? " (dry-run)" : ""}`
          : "Auto-payout keeper offline"
      }
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          live ? "bg-white" : "bg-neutral-400",
        )}
      />
      Auto-payout {live ? "live" : "offline"}
    </span>
  );
}

function QuotePreview({
  quote,
  subtitle,
}: {
  quote: CoverQuote;
  subtitle?: string;
}) {
  return (
    <div className="grid gap-2 rounded-base border-2 border-black bg-neutral-50 p-3 text-sm">
      {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
      <div className="flex justify-between">
        <span className="text-neutral-600">Payout</span>
        <span className="tnum font-heading">{usd(quote.coverage, 0)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-neutral-600">Premium</span>
        <span className="tnum font-heading">{usd(quote.premium)}</span>
      </div>
      <div className="flex justify-between border-t border-dashed border-black/20 pt-2 text-xs text-neutral-500">
        <span>Floor {usd(quote.strike, 0)}</span>
        <span>{quote.duration} window</span>
      </div>
      <p className="text-xs text-neutral-500">Settles {quote.expiryLabel}</p>
    </div>
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
  return (
    <p className="text-xs font-heading text-amber-600">
      Quote expired — prices may have changed
    </p>
  );
}

function CoverPanel() {
  const { btc: detectedBtc, fromWallet, loading: btcLoading } = useWalletBtc();
  const { options, loading: oracleLoading, defaultOracleId } = useOracleOptions();
  const { managerId } = useManagerId();
  const { balance: managerBalanceUsd } = useManagerBalance(managerId);

  const [btcInput, setBtcInput] = useState("");
  const [btcTouched, setBtcTouched] = useState(false);
  const [oracleId, setOracleId] = useState<string | null>(null);
  const [pickMode, setPickMode] = useState<PickMode>("list");
  const [customDatetime, setCustomDatetime] = useState("");

  const { purchase, status, error } = usePurchase();
  const signing = status === "checking" || status === "signing" || status === "confirming";

  useEffect(() => {
    if (detectedBtc != null && !btcTouched) {
      setBtcInput(String(detectedBtc));
    }
  }, [detectedBtc, btcTouched]);

  useEffect(() => {
    if (defaultOracleId && oracleId == null) {
      setOracleId(defaultOracleId);
    }
  }, [defaultOracleId, oracleId]);

  useEffect(() => {
    if (options.length > 0 && !customDatetime) {
      const first = options[0]!;
      setCustomDatetime(toDatetimeLocalValue(first.expiryMs));
    }
  }, [options, customDatetime]);

  const btcHeld = Math.max(0, Number(btcInput) || 0);

  const listOracle = options.find((o) => o.oracleId === oracleId) ?? options[0] ?? null;
  const customTarget = parseDatetimeLocal(customDatetime);
  const customOracle =
    customTarget != null ? snapToOracle(options, customTarget) : listOracle;

  const selectedOracle: OracleOption | null =
    pickMode === "custom" ? customOracle : listOracle;

  // Live oracle data (spot price + SVI) for the selected oracle
  const { spot, svi, spotLive } = useOracleData(selectedOracle?.oracleId ?? null);

  const quote = useMemo(
    () => buildCoverQuote(btcHeld, selectedOracle, spot, svi),
    // Re-compute every time spot or svi changes to keep freshness timer accurate
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [btcHeld, selectedOracle, spot, svi],
  );
  const ready = !btcLoading && !oracleLoading && quote.valid;
  const customSnapped =
    pickMode === "custom" &&
    customTarget != null &&
    customOracle != null &&
    customOracle.expiryMs !== customTarget;
  const pickedLabel = formatPickedLocal(customDatetime);

  const buttonLabel = () => {
    if (status === "checking") return "Checking price…";
    if (status === "signing") return "Confirm in wallet…";
    if (status === "confirming") return "Submitting…";
    if (status === "success") return "Purchase confirmed!";
    return `Protect — ${usd(quote.premium)}`;
  };

  return (
    <div className="grid gap-4">
      <Card className="border-2 border-black shadow-none" hover={false}>
        <CardContent className="grid gap-5 py-5">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="btc" className="text-sm font-heading">
                How much BTC?
              </label>
              {fromWallet && detectedBtc != null && (
                <button
                  type="button"
                  className="text-xs text-neutral-500 underline"
                  onClick={() => {
                    setBtcTouched(true);
                    setBtcInput(String(detectedBtc));
                  }}
                >
                  Use balance ({detectedBtc.toLocaleString(undefined, { maximumFractionDigits: 4 })})
                </button>
              )}
            </div>
            <Input
              id="btc"
              className="mt-2"
              inputMode="decimal"
              value={btcInput}
              suffix="BTC"
              onChange={(e) => {
                setBtcTouched(true);
                setBtcInput(e.target.value.replace(/[^0-9.]/g, ""));
              }}
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              {btcLoading
                ? "Detecting your balance…"
                : fromWallet
                  ? "Detected from your wallet — edit anytime"
                  : "Enter the amount you want to cover"}
            </p>
          </div>

          <div>
            <p className="text-sm font-heading">Cover until</p>
            <div className="mt-2 flex gap-2">
              {(
                [
                  ["list", "Pick a window"],
                  ["custom", "Pick date & time"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPickMode(mode)}
                  className={cn(
                    "flex-1 rounded-base border-2 border-black px-2 py-2 text-xs font-heading sm:text-sm",
                    pickMode === mode ? "bg-black text-white" : "bg-white hover:bg-neutral-100",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {oracleLoading ? (
              <p className="mt-3 text-sm text-neutral-400">Loading windows…</p>
            ) : pickMode === "list" ? (
              <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                {options.map((o) => {
                  const active = o.oracleId === listOracle?.oracleId;
                  const { date, time } = formatExpiryUtc(o.expiryMs);
                  const rowQuote = btcHeld > 0 ? buildCoverQuote(btcHeld, o, spot, svi) : null;
                  return (
                    <button
                      key={o.oracleId}
                      type="button"
                      onClick={() => setOracleId(o.oracleId)}
                      className={cn(
                        "w-full rounded-base border-2 border-black px-3 py-2.5 text-left transition-colors",
                        active ? "bg-black text-white" : "bg-white hover:bg-neutral-100",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-heading text-sm">
                            {date} · {time}
                          </p>
                          <p className={cn("mt-0.5 text-xs", active ? "text-white/70" : "text-neutral-500")}>
                            {minsLabel(o.expiryMs)} from now
                          </p>
                        </div>
                        {rowQuote?.valid && (
                          <span className={cn("tnum shrink-0 text-xs font-heading", active ? "text-white" : "text-black")}>
                            {usd(rowQuote.premium)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3">
                <label htmlFor="cover-until" className="text-xs text-neutral-600">
                  When should coverage end?
                </label>
                <input
                  id="cover-until"
                  type="datetime-local"
                  className="mt-2 w-full rounded-base border-2 border-black bg-white px-3 py-2.5 font-heading text-sm shadow-brutal focus:outline-none focus:ring-2 focus:ring-black"
                  min={toDatetimeLocalValue(Date.now() + MIN_EXPIRY_LEAD_MS)}
                  value={customDatetime}
                  onChange={(e) => setCustomDatetime(e.target.value)}
                />
                {customOracle && btcHeld > 0 && (
                  <QuotePreview
                    quote={buildCoverQuote(btcHeld, customOracle, spot, svi)}
                    subtitle={
                      customSnapped && pickedLabel
                        ? `You picked ${pickedLabel} → nearest window below`
                        : pickedLabel
                          ? `You picked ${pickedLabel}`
                          : undefined
                    }
                  />
                )}
              </div>
            )}
          </div>

          {ready && pickMode === "list" && (
            <div className="rounded-base border-2 border-black bg-neutral-50 px-4 py-4 text-center">
              <p className="text-xs text-neutral-500 mb-2">
                BTC{spotLive ? "" : " (demo)"} at {usd(quote.spot, 0)}
              </p>
              <p className="text-sm leading-relaxed text-neutral-700">
                BTC at or below{" "}
                <span className="font-heading text-black">{usd(quote.strike, 0)}</span>
                <br />
                by <span className="font-heading text-black">{quote.expiryLabel}</span>
              </p>
              <p className="mt-3 tnum font-heading text-3xl">{usd(quote.coverage, 0)}</p>
              <p className="mt-1 text-xs text-neutral-500">to you · premium {usd(quote.premium)}</p>
              {quote.floorBinds && (
                <p className="mt-1 text-xs text-neutral-400">1% minimum premium applies</p>
              )}
            </div>
          )}

          {ready && (
            <>
              {status === "error" && error && (
                <p className="text-xs font-heading text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}

              {status !== "success" ? (
                <>
                  {quote.valid && <QuoteFreshnessBadge createdAtMs={quote.createdAtMs} />}
                  <Button
                    variant="noShadow"
                    fullWidth
                    className="border-2 border-black bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300"
                    disabled={signing}
                    onClick={() => {
                      if (!selectedOracle) return;
                      purchase(quote, selectedOracle, managerId, managerBalanceUsd);
                    }}
                  >
                    {buttonLabel()}
                    {!signing && <ArrowRight size={16} strokeWidth={2.5} />}
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-base border-2 border-black bg-white py-3 text-sm font-heading">
                  <Check size={16} />
                  Purchase confirmed — check History
                </div>
              )}

              <details>
                <summary className="flex cursor-pointer list-none items-center justify-center gap-1 text-xs text-neutral-500 [&::-webkit-details-marker]:hidden">
                  How is this priced? <ChevronDown size={14} />
                </summary>
                <div className="mt-2 space-y-1 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Fair value</span>
                    <span className="tnum font-heading">{usd(quote.fair)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spread</span>
                    <span className="tnum font-heading">{usd(quote.spreadAmt)}</span>
                  </div>
                  <div className="flex justify-between border-t border-black/20 pt-1 font-heading">
                    <span>You pay</span>
                    <span className="tnum">{usd(quote.premium)}</span>
                  </div>
                  {quote.floorBinds && (
                    <p className="text-[10px] text-neutral-400 pt-1">
                      Floor of 1¢/contract applies — parametric payout, not regulated insurance.
                    </p>
                  )}
                </div>
              </details>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function statusBadge(status: "active" | "paid" | "expired", payout?: number) {
  const label =
    status === "paid"
      ? payout != null && payout > 0
        ? `PAID ${usd(payout, 0)}`
        : "PAID"
      : status === "active"
        ? "ACTIVE"
        : "EXPIRED";
  return (
    <span
      className={cn(
        "shrink-0 rounded-base border-2 border-black px-2 py-0.5 text-xs",
        status !== "expired" ? "bg-black text-white" : "bg-white text-black",
      )}
    >
      {label}
    </span>
  );
}

function HistoryPanel() {
  const { managerId, loading: managerLoading } = useManagerId();
  const { data: keeperPolicies, isLoading, isError } = useManagerPolicies(managerId);

  const live = keeperPolicies && keeperPolicies.length > 0;

  if (managerLoading || (managerId && isLoading)) {
    return <p className="text-sm text-neutral-400">Loading your policies…</p>;
  }

  if (live) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-neutral-600">Your policies · live from keeper</p>
        <Card className="divide-y divide-black gap-0 border-2 border-black py-0 shadow-none" hover={false}>
          {keeperPolicies!.map((p: KeeperPolicy) => {
            const { date, time } = formatExpiryUtc(p.expiryMs);
            return (
              <Link
                key={p.id}
                href={`/app/receipt/${encodeURIComponent(p.id)}`}
                className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-neutral-50"
              >
                <div>
                  <p className="font-heading">
                    {date} · {time}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {usd(p.coverage, 0)} cover · {usd(p.premium)} paid
                  </p>
                </div>
                {statusBadge(p.status, p.payout)}
              </Link>
            );
          })}
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm text-neutral-600">
        {managerId
          ? isError
            ? "Keeper offline — showing sample policies"
            : "No policies yet — sample shown below"
          : "No policies yet — buy your first cover"}
      </p>
      <Card className="divide-y divide-black gap-0 border-2 border-black py-0 shadow-none" hover={false}>
        {DEMO_POLICIES.map((item) => (
          <Link
            key={item.id}
            href={`/app/receipt/${item.id}`}
            className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-neutral-50"
          >
            <div>
              <p className="font-heading">
                #{item.id} · {item.date}
              </p>
              <p className="text-xs text-neutral-500">
                {usd(item.coverage, 0)} · paid {usd(item.premium)}
              </p>
            </div>
            {statusBadge(item.status, item.payout)}
          </Link>
        ))}
      </Card>
    </div>
  );
}

function WalletPanel({ managerId }: { managerId: string | null }) {
  const { balance, loading: balanceLoading, refetch } = useManagerBalance(managerId);
  const { withdraw, withdrawing, done, error } = useWithdraw();

  if (!managerId) {
    return (
      <Card className="border-2 border-black bg-neutral-50 shadow-none" hover={false}>
        <CardContent className="py-5 text-center">
          <p className="text-sm text-neutral-500">Buy your first cover to create a manager account.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-black bg-neutral-50 shadow-none" hover={false}>
      <CardContent className="py-5">
        <p className="text-xs text-neutral-500">Manager balance</p>
        {balanceLoading ? (
          <p className="tnum font-heading text-4xl text-neutral-400">…</p>
        ) : (
          <p className="tnum font-heading text-4xl">{usd(balance)}</p>
        )}
        <p className="text-sm text-neutral-600">dUSDC ready to withdraw</p>

        {error && (
          <p className="mt-3 text-xs text-red-600">{error}</p>
        )}

        {done ? (
          <p className="mt-5 flex items-center justify-center gap-2 rounded-base border-2 border-black bg-white py-3 text-sm font-heading">
            <Check size={16} />
            Sent to your wallet
          </p>
        ) : (
          <Button
            variant="noShadow"
            fullWidth
            className="mt-5 border-2 border-black bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300"
            disabled={balance <= 0 || withdrawing || balanceLoading}
            onClick={() => {
              if (managerId) {
                withdraw(managerId, balance).then(() => refetch());
              }
            }}
          >
            {withdrawing ? "Withdrawing…" : "Withdraw to wallet"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function AppPage() {
  const account = useCurrentAccount();
  const connected = Boolean(account?.address);
  const [tab, setTab] = useState<Tab>("cover");
  const { managerId } = useManagerId();

  return (
    <div className="min-h-screen bg-white font-base text-black">
      <header className="border-b-2 border-black">
        <Shell className="flex items-center justify-between gap-3 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-sm hover:underline">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Home
          </Link>
          <span className="font-heading text-sm tracking-widest">SENTINEL</span>
          <ConnectButton />
        </Shell>
      </header>

      <Shell>
        {!connected ? (
          <Card className="border-2 border-dashed border-black bg-neutral-50 shadow-none" hover={false}>
            <CardContent className="py-12 text-center">
              <p className="font-heading text-lg">Connect wallet</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-600">
                Connect to buy cover and view your policies.
              </p>
              <div className="mt-6 flex justify-center [&_*]:!text-black">
                <ConnectButton />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs text-neutral-500">
                {shortAddr(account!.address)} · testnet
              </p>
              <KeeperBadge />
            </div>

            <nav aria-label="App menu" className="mb-6 flex gap-2">
              {TABS.map(({ id, label }) => (
                <MenuButton key={id} active={tab === id} onClick={() => setTab(id)}>
                  {label}
                </MenuButton>
              ))}
            </nav>

            {tab === "cover" && <CoverPanel />}

            {tab === "history" && <HistoryPanel />}

            {tab === "wallet" && <WalletPanel managerId={managerId} />}
          </>
        )}
      </Shell>
    </div>
  );
}
