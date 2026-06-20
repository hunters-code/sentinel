"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import { useWalletBtc } from "@/lib/use-wallet-btc";
import { useManagerId } from "@/lib/use-manager";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { useOracleData, useOnChainPremium } from "@/lib/use-oracle-data";
import { usePurchase } from "@/lib/use-purchase";
import {
  buildCoverQuote,
  COVER_TERMS,
  formatExpiryUtc,
  snapTermToOracle,
  useOracleOptions,
} from "@/lib/use-cover-quote";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";
import { PrimaryButton } from "@/components/app/ui/primary-button";
import { AssetSelector } from "@/components/app/asset-selector";
import { AssetLogo } from "@/components/app/asset-logo";
import { DEFAULT_ASSET, getAsset, type AssetId } from "@/lib/assets";
import { QuoteFreshness, useQuoteFreshness } from "@/components/app/quote-freshness";
import { QuoteLiveLine } from "@/components/app/quote-live-line";
import { PricingBreakdown } from "@/components/app/pricing-breakdown";
import { QuoteDisclosures } from "@/components/app/quote-disclosures";
import { SettlementWindowsLoading } from "@/components/app/settlement-windows-loading";

type CoverPanelProps = {
  onViewHistory: () => void;
};

export function CoverPanel({ onViewHistory }: CoverPanelProps) {
  const { btc: detectedBtc, fromWallet, loading: btcLoading } = useWalletBtc();
  const { options, loading: oracleLoading } = useOracleOptions();
  const { managerId } = useManagerId();
  const { balance: managerBalanceUsd } = useManagerBalance(managerId);

  const [btcInput, setBtcInput] = useState("");
  const [btcTouched, setBtcTouched] = useState(false);
  const [termId, setTermId] = useState<string>(COVER_TERMS[0]!.id);
  const [assetId, setAssetId] = useState<AssetId>(DEFAULT_ASSET.id);
  const asset = getAsset(assetId);

  const { purchase, status, error, txDigest } = usePurchase();
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

  const hasAmount = btcHeld > 0;
  const quoteReady = hasAmount && !btcLoading && !oracleLoading && quote.valid;
  const { stale: quoteStale } = useQuoteFreshness(quote.createdAtMs);

  const buttonLabel = () => {
    if (status === "checking") return "Checking price…";
    if (status === "signing") return "Confirm in wallet…";
    if (status === "confirming") return "Submitting…";
    if (status === "success") return "Purchase confirmed";
    if (!hasAmount) return `Enter ${asset.symbol} amount`;
    if (premiumLoading && !premiumIsLive) return "Getting price…";
    return `Protect my ${asset.symbol} — ${usd(quote.premium)}`;
  };

  return (
    <div className="app-cover-layout">
      <div className="app-cover-sticky">
        <Panel className="app-cover-sticky-panel">
          <AssetSelector selected={assetId} onSelect={setAssetId} />
        </Panel>
      </div>

      <div className="app-cover-scroll space-y-5">
        {!asset.live ? (
        <Panel className="text-center">
          <div className="mb-4 flex justify-center">
            <AssetLogo id={asset.id} size={48} />
          </div>
          <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
            {asset.name} cover is coming to testnet
          </h2>
          <Muted className="mx-auto mb-6 max-w-sm">
            {asset.symbol} needs a live settlement oracle before we can quote honest premiums. It&apos;s
            next on the roadmap — {DEFAULT_ASSET.symbol} cover is live right now.
          </Muted>
          <button
            type="button"
            onClick={() => setAssetId(DEFAULT_ASSET.id)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--sui-line)", color: "var(--sui-white)" }}
          >
            <AssetLogo id={DEFAULT_ASSET.id} size={18} />
            Cover {DEFAULT_ASSET.symbol} instead
          </button>
        </Panel>
      ) : (
        <>
          <Panel>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="btc"
                className="text-base font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How much {asset.symbol} do you hold?
              </label>
              {fromWallet && detectedBtc != null && (
                <button
                  type="button"
                  className="min-h-11 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--sui-line)", color: "var(--sui-blue-bright)" }}
                  onClick={() => {
                    setBtcTouched(true);
                    setBtcInput(String(detectedBtc));
                  }}
                >
                  Use balance ({detectedBtc.toLocaleString(undefined, { maximumFractionDigits: 4 })})
                </button>
              )}
            </div>
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: "var(--sui-line)", background: "rgba(0,0,0,0.35)" }}
            >
              <input
                id="btc"
                inputMode="decimal"
                value={btcInput}
                onChange={(e) => {
                  setBtcTouched(true);
                  setBtcInput(e.target.value.replace(/[^0-9.]/g, ""));
                }}
                className="min-w-0 flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-[var(--sui-steel)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--sui-white)" }}
                placeholder="0.00"
                aria-describedby="btc-hint"
              />
              <span className="text-sm font-medium" style={{ color: "var(--sui-steel)" }}>
                {asset.symbol}
              </span>
            </div>
            <Muted id="btc-hint" className="mt-3">
              {btcLoading
                ? "Detecting your balance…"
                : fromWallet
                  ? "Detected from your wallet — edit anytime"
                  : "Enter the amount you want to cover"}
            </Muted>
          </Panel>

          {hasAmount && (
            <Panel>
              <h2 className="mb-1 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Cover for how long?
              </h2>
              <Muted className="mb-5">
                Trigger is −2% from today&apos;s {asset.symbol} price. Pick how long the cover runs.
              </Muted>
              <div
                className={cn(
                  "flex flex-wrap gap-2",
                  oracleLoading && "app-term-group-loading",
                )}
                role="group"
                aria-label="Coverage term"
                aria-busy={oracleLoading}
              >
                {COVER_TERMS.map((t) => {
                  const active = t.id === termId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTermId(t.id)}
                      aria-pressed={active}
                      className="min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                      style={
                        active
                          ? {
                            background: "var(--sui-blue)",
                            color: "#000",
                            borderColor: "var(--sui-blue)",
                          }
                          : { borderColor: "var(--sui-line)", color: "var(--sui-white)" }
                      }
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {oracleLoading ? (
                <SettlementWindowsLoading />
              ) : capped && selectedOracle ? (
                <Muted className="mt-4">
                  On testnet, windows top out around three weeks — your {selectedTerm.label} quote settles
                  on the longest available window ({formatExpiryUtc(selectedOracle.expiryMs).full}).
                </Muted>
              ) : selectedOracle ? (
                <Muted className="mt-4">Settles {formatExpiryUtc(selectedOracle.expiryMs).full}</Muted>
              ) : null}
            </Panel>
          )}

          {quoteReady && (
            <Panel>
              <Muted className="mb-3">{asset.symbol} at {usd(quote.spot, 0)} · trigger −2%</Muted>
              <QuoteLiveLine
                strike={quote.strike}
                expiryMs={quote.expiryMs}
                coverage={quote.coverage}
                symbol={asset.symbol}
              />
            </Panel>
          )}

          {quoteReady && status === "success" ? (
            <Panel className="space-y-4">
              <p className="font-medium" style={{ color: "#7df752" }}>
                Cover purchased — your receipt is in History.
              </p>
              {txDigest && (
                <Muted>
                  Transaction{" "}
                  <a
                    href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--sui-blue-bright)" }}
                  >
                    {txDigest.slice(0, 10)}…
                  </a>
                </Muted>
              )}
              <PrimaryButton onClick={onViewHistory}>View History</PrimaryButton>
            </Panel>
          ) : quoteReady ? (
            <div className="space-y-4">
              {status === "error" && error && (
                <p className="text-sm" role="alert" style={{ color: "#fa8543" }}>
                  {error}
                </p>
              )}

              <QuoteFreshness createdAtMs={quote.createdAtMs} />

              <PrimaryButton
                disabled={
                  signing ||
                  !selectedOracle ||
                  !premiumIsLive ||
                  quoteStale
                }
                onClick={() => {
                  if (!selectedOracle) return;
                  purchase(quote, selectedOracle, managerId, managerBalanceUsd);
                }}
              >
                {buttonLabel()}
              </PrimaryButton>

              <PricingBreakdown quote={quote} live={premiumIsLive} loading={premiumLoading} />
              <QuoteDisclosures />
            </div>
          ) : hasAmount && !oracleLoading && !quote.valid ? (
            <Panel>
              <Muted>Pricing temporarily unavailable — try again in a moment.</Muted>
            </Panel>
          ) : null}
        </>
      )}
      </div>
    </div>
  );
}
