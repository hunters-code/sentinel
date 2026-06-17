"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { DEFAULT_TRIGGER_PCT } from "@sentinel/shared";

const DEMO_SPOT = 100_000;
const FAIR_RATE = 0.01;
const SPREAD_RATE = 0.004;
const EFFECTIVE_RATE = FAIR_RATE + SPREAD_RATE;
const PRESETS = [0.05, 0.5, 2];

const usd = (n: number, max = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  }).format(n);

const STEPS = [
  ["01", "How much?", "One field. Your BTC stack sizes coverage, trigger, and premium. No ladder. No expiry picker."],
  ["02", "Pay the ask", "Premium comes from the protocol — SVI fair value plus spread. We show every line. Floor is 1% of coverage."],
  ["03", "Collect", "BTC at or below your trigger at settlement? Keeper sends dUSDC. No form. No phone tree."],
];

const FEATURES = [
  ["Line by line", "Fair value, spread, floor — on screen, not buried."],
  ["The receipt", "Trigger, coverage, premium, status. One card. Screenshot it."],
  ["5% slippage cap", "We re-check right before you sign. Drifts too far? Transaction stops."],
];

const REFRAMES: [string, string][] = [
  ["DOWN binary, deep OTM", "Crash cover"],
  ["Contract qty", "Your payout"],
  ["Strike", "Your floor"],
  ["Ask × size", "Your premium"],
];

const WHY: [string, string][] = [
  ["30–60 min window", "Coverage to the next oracle settlement. Nervous hour, not nervous quarter."],
  ["Any floor, any hour", "Priced off a vol surface. Vault on the other side of every mint."],
  ["One signature", "Create manager, deposit, mint — bundled. You tap once."],
  ["DeepBook Predict", "Sub-hour oracles + any-strike pricing. Only works here."],
];

const DISCLOSURES: [string, string][] = [
  ["All or nothing", "Fixed payout at settlement. Deeper crash = same check. Bounce before expiry = $0."],
  ["Oracle hour, not wall clock", "Window runs to oracle expiry (~30–60 min). Exact time is on your quote and receipt."],
  ["Vault takes the other side", "Payout comes from a liquidity vault. Full vault = no new policies."],
  ["1% minimum premium", "Protocol won't mint below 1% of coverage. We flag it when the floor binds."],
  ["Not regulated insurance", "On-chain options position with insurance words. Framing, not a policy from Hartford."],
  ["Your BTC stays put", "We cover price exposure. Coins never leave your wallet."],
];

export default function LandingPage() {
  const [btc, setBtc] = useState("0.5");
  const [ready, setReady] = useState(false);

  const quote = useMemo(() => {
    const held = Math.max(0, Number(btc) || 0);
    const strike = DEMO_SPOT * (1 - DEFAULT_TRIGGER_PCT);
    const coverage = held * (DEMO_SPOT - strike);
    const premium = coverage * EFFECTIVE_RATE;
    return {
      held,
      strike,
      coverage,
      premium,
      fair: coverage * FAIR_RATE,
      spread: coverage * SPREAD_RATE,
    };
  }, [btc]);

  const valid = quote.coverage > 0;

  return (
    <div>
      {/* Nav */}
      <header style={{ borderBottom: "1px solid #ccc" }}>
        <div className="wrap row" style={{ alignItems: "center" }}>
          <Link href="/">SENTINEL</Link>
          <nav>
            <a href="#how">How</a> · <a href="#pricing">Math</a> · <a href="#why">Why</a>
          </nav>
          <Link href="/app">Open app</Link>
        </div>
      </header>

      <main className="wrap">
        {/* Hero */}
        <section id="top">
          <p className="tag">SUB-HOUR ORACLE · −2% FLOOR</p>
          <h1>BTC dumps. You still get paid.</h1>
          <p>
            Type your stack. Get one price. Sign once. Hit your floor before the oracle closes —
            dUSDC lands in your wallet.
          </p>

          {/* Coverage form */}
          <div className="box" id="quote">
            <div className="row">
              <span className="tag">COVERAGE FORM</span>
              <span className="tag">~45 MIN</span>
            </div>

            <label htmlFor="btc">Your stack (BTC)</label>
            <div className="field">
              <input
                id="btc"
                inputMode="decimal"
                value={btc}
                placeholder="0.00"
                aria-describedby="promise"
                onChange={(e) => {
                  setBtc(e.target.value.replace(/[^0-9.]/g, ""));
                  setReady(false);
                }}
              />
              <span className="muted">BTC</span>
            </div>

            <div>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setBtc(String(p));
                    setReady(false);
                  }}
                  style={{ marginRight: "0.5rem" }}
                >
                  {p}
                </button>
              ))}
            </div>

            <p id="promise">
              {valid
                ? `BTC ≤ ${usd(quote.strike)} at settlement → ${usd(quote.coverage)} to you.`
                : "Stack size goes here."}
            </p>

            <div>
              {ready ? (
                <>
                  <ConnectButton />
                  <p className="muted">Connect wallet → mint policy. One signature.</p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn--full"
                    disabled={!valid}
                    onClick={() => setReady(true)}
                  >
                    Cover it — {valid ? usd(quote.premium, 2) : "—"}
                  </button>
                  <p className="muted">BTC stays in your wallet. Cancel before expiry.</p>
                </>
              )}
            </div>

            <details>
              <summary>Show the math</summary>
              <div className="stack">
                <div className="row">
                  <span>SVI fair value</span>
                  <span>{usd(quote.fair, 2)}</span>
                </div>
                <div className="row">
                  <span>Spread</span>
                  <span>{usd(quote.spread, 2)}</span>
                </div>
                <div className="row">
                  <span>Protocol floor</span>
                  <span>min 1%</span>
                </div>
                <div className="row">
                  <strong>Total</strong>
                  <strong>{usd(quote.premium, 2)}</strong>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* How */}
        <section id="how">
          <p className="tag">3 MOVES</p>
          <h2>No strike ladder. Three steps.</h2>
          <p>You don&rsquo;t touch an options chain. One input, one price, one payout if the floor breaks.</p>
          <div className="grid grid--3">
            {STEPS.map(([num, title, body]) => (
              <div key={num} className="box">
                <p className="tag">{num}</p>
                <h3>{title}</h3>
                <p className="muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing">
          <p className="tag">THE MATH</p>
          <h2>We didn&rsquo;t invent the price.</h2>
          <p>DeepBook&rsquo;s ask, broken into parts you can actually read.</p>
          <div className="grid grid--2">
            <div className="stack">
              {FEATURES.map(([title, body]) => (
                <div key={title} className="box">
                  <p><strong>{title}</strong></p>
                  <p className="muted">{body}</p>
                </div>
              ))}
            </div>
            <div className="box">
              <div className="row">
                <span className="tag">RECEIPT #0041</span>
                <span className="tag">PAID · {usd(1000)}</span>
              </div>
              <div className="row"><span>Fair</span><span>{usd(10, 2)}</span></div>
              <div className="row"><span>Spread</span><span>{usd(4, 2)}</span></div>
              <hr />
              <div className="row">
                <span className="muted">{usd(1000)} coverage · 1.4% effective</span>
                <strong>{usd(14, 2)}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section id="why">
          <p className="tag">UNDER THE HOOD</p>
          <h2>Binary option. Insurance words.</h2>
          <p>Deep OTM downside binary = crash cover. We just stopped calling it a trade.</p>

          <div className="box">
            <h3>Trader speak → plain English</h3>
            <p className="muted">Same position a desk would build. Different labels on the receipt.</p>
            <table>
              <tbody>
                {REFRAMES.map(([from, to]) => (
                  <tr key={to}>
                    <td className="muted">{from}</td>
                    <td>→</td>
                    <td>{to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid--2">
            {WHY.map(([title, body]) => (
              <div key={title} className="box">
                <h3>{title}</h3>
                <p className="muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclosures */}
        <section>
          <p className="tag">READ THIS</p>
          <h2>Before you tap.</h2>
          <div className="grid grid--2">
            {DISCLOSURES.map(([title, body], i) => (
              <div key={title} className="box">
                <p><strong>{i + 1}. {title}</strong></p>
                <p className="muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="box">
            <h2>Cover this hour.</h2>
            <p>CPI, FOMC, Friday liquidations — pick your panic. Costs less than lunch.</p>
            <Link href="/app">Open app</Link>
            <p className="muted">1 tap · 1 sig · keeper pays out</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #ccc" }}>
        <div className="wrap">
          <p>SENTINEL</p>
          <p className="muted">
            One-hour crash cover for BTC. DeepBook Predict on Sui testnet. On-chain options with
            insurance framing — not a regulated policy.
          </p>
        </div>
      </footer>
    </div>
  );
}
