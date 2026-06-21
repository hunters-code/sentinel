"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import { useWalletAsset } from "@/lib/use-wallet-btc";
import { useManagerId } from "@/lib/use-manager";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { useOracleData, useOnChainPremium } from "@/lib/use-oracle-data";
import { usePurchase } from "@/lib/use-purchase";
import {
  buildCoverQuote,
  COVER_TERMS,
  formatExpiry,
  snapTermToOracle,
  useOracleOptions,
} from "@/lib/use-cover-quote";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";
import { PrimaryButton } from "@/components/app/ui/primary-button";
import { AssetSelector } from "@/components/app/asset-selector";
import { AssetLogo } from "@/components/app/asset-logo";
import { DEFAULT_ASSET, getAsset, type AssetId } from "@/lib/assets";
import { useSpotPrice, niceTick } from "@/lib/use-spot-price";
import { QuoteFreshness, useQuoteFreshness } from "@/components/app/quote-freshness";
import { QuoteLiveLine } from "@/components/app/quote-live-line";
import { PricingBreakdown } from "@/components/app/pricing-breakdown";
import { QuoteDisclosures } from "@/components/app/quote-disclosures";
import { SettlementWindowsLoading } from "@/components/app/settlement-windows-loading";
import { buildPolicyReceiptId } from "@/lib/policy-id";
import Link from "next/link";

export function CoverPanel() {
  const [btcInput, setBtcInput] = useState("");
  const [btcTouched, setBtcTouched] = useState(false);
  const [termId, setTermId] = useState<string>(COVER_TERMS[0]!.id);
  const [assetId, setAssetId] = useState<AssetId>(DEFAULT_ASSET.id);
  const asset = getAsset(assetId);

  const { amount: detectedBtc, fromWallet, loading: btcLoading } = useWalletAsset(asset.coinType);
  const { options, loading: oracleLoading } = useOracleOptions();
  const { managerId } = useManagerId();
  const { balance: managerBalanceUsd } = useManagerBalance(managerId);

  const { purchase, status, error, txDigest } = usePurchase();
  const signing = status === "checking" || status === "signing" || status === "confirming";

  useEffect(() => {
    if (detectedBtc != null && !btcTouched) {
      setBtcInput(String(detectedBtc));
    }
  }, [detectedBtc, btcTouched]);

  useEffect(() => {
    setBtcTouched(false);
  }, [assetId]);

  const btcHeld = Math.max(0, Number(btcInput) || 0);
  const selectedTerm = COVER_TERMS.find((t) => t.id === termId) ?? COVER_TERMS[0]!;
  const { oracle: selectedOracle, capped } = snapTermToOracle(options, selectedTerm);
  const { spot: oracleSpot, svi } = useOracleData(selectedOracle?.oracleId ?? null);

  const feedSpot = useSpotPrice(asset.id);
  const spot = asset.id === "btc" ? oracleSpot : feedSpot;
  const quoteOracle = useMemo(() => {
    if (!selectedOracle || asset.id === "btc") return selectedOracle;
    return { ...selectedOracle, minStrikeUsd: 0, tickUsd: niceTick(spot ?? 0) };
  }, [selectedOracle, asset.id, spot]);

  const baseQuote = useMemo(
    () => buildCoverQuote(btcHeld, quoteOracle, spot, svi),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [btcHeld, quoteOracle, spot, svi],
  );

  const { premium: livePremium, loading: premiumLoading } = useOnChainPremium({
    oracleId: asset.id === "btc" ? (selectedOracle?.oracleId ?? null) : null,
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
    <Panel className="flex flex-col gap-8 p-6 md:p-8">
      <AssetSelector selected={assetId} onSelect={setAssetId} />

      {!asset.live ? (
        <div className="rounded-xl border border-border-neutral bg-black/30 px-5 py-4 text-left">
          <p className="font-display text-base font-medium text-content-primary">
            {asset.symbol} cover is coming soon
          </p>
          <Muted className="mt-2 max-w-md">
            We need a live settlement oracle before we can quote honest premiums. BTC is available now.
          </Muted>
          <button
            type="button"
            onClick={() => setAssetId(DEFAULT_ASSET.id)}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border-neutral px-4 py-2 text-sm font-medium text-content-primary transition-colors hover:bg-white/5"
          >
            <AssetLogo id={DEFAULT_ASSET.id} size={18} />
            Quote {DEFAULT_ASSET.symbol}
          </button>
        </div>
      ) : status === "success" && quoteReady ? (
        <div className="space-y-4">
          <p className="font-display text-[clamp(1.25rem,3vw,1.5rem)] font-medium leading-snug text-content-primary">
            Cover purchased.
          </p>
          {selectedOracle && (
            <Link
              href={`/app?tab=history&policy=${encodeURIComponent(buildPolicyReceiptId(selectedOracle.oracleId, quote.strike))}`}
              className="inline-flex min-h-11 items-center gap-1.5 font-medium text-sui-blue-bright no-underline transition-opacity hover:opacity-90"
            >
              View in History
              <span aria-hidden>→</span>
            </Link>
          )}
          {txDigest && (
            <Muted>
              <a
                href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sui-blue-bright underline"
              >
                {txDigest.slice(0, 10)}…
              </a>
            </Muted>
          )}
        </div>
      ) : (
        <>
          <div className="min-h-[4.5rem]">
            {quoteReady ? (
              <QuoteLiveLine
                strike={quote.strike}
                expiryMs={quote.expiryMs}
                coverage={quote.coverage}
                symbol={asset.symbol}
              />
            ) : hasAmount && oracleLoading ? (
              <SettlementWindowsLoading />
            ) : hasAmount && !oracleLoading && !quote.valid ? (
              <Muted>Pricing temporarily unavailable — try again in a moment.</Muted>
            ) : (
              <Muted className="text-base leading-relaxed">
                Enter how much {asset.symbol} you hold — your trigger, payout, and premium appear here.
              </Muted>
            )}
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="cover-amount" className="text-sm font-medium text-content-secondary">
                Holdings
              </label>
              {fromWallet && detectedBtc != null && (
                <button
                  type="button"
                  className="min-h-11 rounded-full border border-border-neutral px-3 py-1.5 text-sm text-sui-blue-bright transition-colors hover:bg-white/5"
                  onClick={() => {
                    setBtcTouched(true);
                    setBtcInput(String(detectedBtc));
                  }}
                >
                  Use wallet ({detectedBtc.toLocaleString(undefined, { maximumFractionDigits: 4 })})
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border-neutral bg-black/35 px-4 py-3">
              <input
                id="cover-amount"
                inputMode="decimal"
                value={btcInput}
                onChange={(e) => {
                  setBtcTouched(true);
                  setBtcInput(e.target.value.replace(/[^0-9.]/g, ""));
                }}
                className="min-w-0 flex-1 bg-transparent font-display text-2xl font-medium tabular-nums text-content-primary outline-none placeholder:text-content-tertiary"
                placeholder="0.00"
                aria-describedby="cover-amount-hint"
              />
              <span className="text-sm font-medium text-content-secondary">{asset.symbol}</span>
            </div>
            <Muted id="cover-amount-hint" className="mt-2">
              {btcLoading
                ? "Detecting your balance…"
                : fromWallet
                  ? "From your wallet — edit anytime"
                  : "Amount you want covered"}
            </Muted>
          </div>

          {hasAmount && (
            <div>
              <p className="mb-3 text-sm font-medium text-content-secondary">Coverage window</p>
              <div
                className={cn(
                  "flex flex-wrap gap-2",
                  oracleLoading && "pointer-events-none opacity-55",
                )}
                role="group"
                aria-label="Coverage window"
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
                      className={cn(
                        "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-sui-blue bg-sui-blue text-sui-black"
                          : "border-border-neutral text-content-primary hover:bg-white/[0.04]",
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              {!oracleLoading && capped && selectedOracle ? (
                <Muted className="mt-3">
                  Testnet windows cap around three weeks — your {selectedTerm.label} quote settles on{" "}
                  {formatExpiry(selectedOracle.expiryMs).full}.
                </Muted>
              ) : !oracleLoading && selectedOracle ? (
                <Muted className="mt-3">Settles {formatExpiry(selectedOracle.expiryMs).full}</Muted>
              ) : null}
            </div>
          )}

          {quoteReady && (
            <div className="space-y-4 border-t border-separator pt-6">
              {status === "error" && error && (
                <p className="text-sm text-signal-orange" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="font-display text-2xl font-medium tabular-nums text-content-primary">
                  {premiumLoading && !premiumIsLive ? "…" : usd(quote.premium)}
                </p>
                <QuoteFreshness createdAtMs={quote.createdAtMs} />
              </div>

              <PrimaryButton
                disabled={signing || !selectedOracle || !premiumIsLive || quoteStale}
                onClick={() => {
                  if (!selectedOracle) return;
                  purchase(quote, selectedOracle, managerId, managerBalanceUsd);
                }}
              >
                {buttonLabel()}
              </PrimaryButton>

              <div className="space-y-3 pt-1">
                <PricingBreakdown quote={quote} live={premiumIsLive} loading={premiumLoading} />
                <QuoteDisclosures />
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}
