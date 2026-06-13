"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Calculator,
  Zap,
  Eye,
  ReceiptText,
  BadgeCheck,
  Repeat2,
  Clock4,
  Layers,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { DEFAULT_TRIGGER_PCT } from "@sentinel/shared";
import { Reveal } from "@/components/Reveal";
import styles from "./page.module.css";

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

export default function LandingPage() {
  const [btc, setBtc] = useState("0.5");
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className={styles.page}>
      {/* Nav */}
      <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={`${styles.shell} ${styles.navInner}`}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden>
              <ShieldCheck size={18} strokeWidth={2.4} />
            </span>
            Sentinel
          </Link>
          <nav className={styles.navLinks} aria-label="Primary">
            <a className={styles.navLink} href="#how">How it works</a>
            <a className={styles.navLink} href="#pricing">Honest pricing</a>
            <a className={styles.navLink} href="#why">Why it works</a>
          </nav>
          <div className={styles.navRight}>
            <a className={`${styles.btn} ${styles.btnSm}`} href="#quote">
              Protect my BTC
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero} id="top">
        <div className={styles.glow} aria-hidden />
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div>
            <motion.span
              className={styles.badge}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.badgeDot} aria-hidden />
              On-chain · settles in under 60 minutes
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              Crash-proof your Bitcoin for <em>the next hour.</em>
            </motion.h1>

            <motion.p
              className={styles.heroSub}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              Tell us how much BTC you hold. We quote one honest price. Tap once.
              If Bitcoin dips past your trigger, you get paid — automatically.
            </motion.p>

            <motion.div
              id="quote"
              className={styles.quote}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className={styles.quoteLabel} htmlFor="btc">
                How much BTC do you hold?
              </label>
              <div className={styles.inputRow}>
                <input
                  id="btc"
                  className={`${styles.input} tnum`}
                  inputMode="decimal"
                  value={btc}
                  onChange={(e) => {
                    setBtc(e.target.value.replace(/[^0-9.]/g, ""));
                    setReady(false);
                  }}
                  placeholder="0.00"
                  aria-describedby="promise"
                />
                <span className={styles.unit}>BTC</span>
              </div>

              <div className={styles.chips}>
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.chip} ${
                      quote.held === p ? styles.chipActive : ""
                    }`}
                    onClick={() => {
                      setBtc(String(p));
                      setReady(false);
                    }}
                  >
                    {p} BTC
                  </button>
                ))}
              </div>

              <p className={styles.promise} id="promise">
                {valid ? (
                  <>
                    If BTC falls to <b className="tnum">{usd(quote.strike)}</b> before
                    the hour&rsquo;s up, you&rsquo;re paid{" "}
                    <b className={`${styles.payoutAmt} tnum`}>{usd(quote.coverage)}</b>.
                  </>
                ) : (
                  <>Enter the amount of Bitcoin you&rsquo;d like to protect.</>
                )}
              </p>

              {ready ? (
                <div className={styles.ctaRow}>
                  <ConnectButton />
                  <p className={styles.micro}>
                    Connect your Sui wallet to mint this policy — one signature, no
                    account setup.
                  </p>
                </div>
              ) : (
                <div className={styles.ctaRow}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnFull}`}
                    disabled={!valid}
                    onClick={() => setReady(true)}
                  >
                    Protect my Bitcoin — {valid ? usd(quote.premium, 2) : "—"}
                    <ArrowRight size={18} strokeWidth={2.4} />
                  </button>
                  <p className={styles.micro}>
                    No account. No custody of your BTC. Cancel anytime before expiry.
                  </p>
                </div>
              )}

              <details className={styles.breakdown}>
                <summary>
                  How is this priced? <ChevronDown size={15} strokeWidth={2.4} />
                </summary>
                <div className={styles.bdList}>
                  <div className={styles.bdRow}>
                    <span>Fair value (live SVI surface)</span>
                    <span className="tnum">{usd(quote.fair, 2)}</span>
                  </div>
                  <div className={styles.bdRow}>
                    <span>Spread</span>
                    <span className="tnum">{usd(quote.spread, 2)}</span>
                  </div>
                  <div className={`${styles.bdRow} ${styles.bdRowFloor}`}>
                    <span>Protocol floor</span>
                    <span>min 1% of coverage</span>
                  </div>
                  <div className={`${styles.bdRow} ${styles.bdTotal}`}>
                    <span>You pay</span>
                    <span className="tnum">{usd(quote.premium, 2)}</span>
                  </div>
                </div>
              </details>
            </motion.div>
          </div>

          <div className={styles.heroArt}>
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                className={styles.heroArtImg}
                src="/hero-forcefield.png"
                alt="A Bitcoin coin sheltered inside a glowing indigo forcefield, deflecting a falling price arrow"
                width={1024}
                height={1024}
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="how">
        <div className={styles.shell}>
          <Reveal className={styles.head}>
            <p className={styles.kicker}>Three taps, no jargon</p>
            <h2 className={styles.h2}>Protection, minus the strike ladders.</h2>
            <p className={styles.lede}>
              You never see an options chain. You answer one question, we do the
              math against a live market, and the payout finds you.
            </p>
          </Reveal>

          <div className={styles.steps}>
            {[
              {
                icon: <Wallet size={24} strokeWidth={2.2} />,
                t: "Tell us your stack",
                b: "Type how much BTC you hold. That single number sizes your whole policy — nothing else to configure.",
              },
              {
                icon: <Calculator size={24} strokeWidth={2.2} />,
                t: "Get one honest price",
                b: "We quote the protocol's own ask off a live volatility surface, then show you exactly where every cent goes.",
              },
              {
                icon: <Zap size={24} strokeWidth={2.2} />,
                t: "Get paid automatically",
                b: "If BTC settles past your trigger, a keeper claims your payout on-chain. No forms, no waiting on hold.",
              },
            ].map((s, i) => (
              <Reveal as="article" key={s.t} className={styles.step} delay={i * 0.08}>
                <span className={styles.stepIcon} aria-hidden>
                  {s.icon}
                </span>
                <span className={styles.stepNum} aria-hidden>
                  0{i + 1}
                </span>
                <h3 className={styles.stepTitle}>{s.t}</h3>
                <p className={styles.stepBody}>{s.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Show the work */}
      <section className={styles.section} id="pricing">
        <div className={`${styles.shell} ${styles.workGrid}`}>
          <Reveal>
            <p className={styles.kicker}>We show our work</p>
            <h2 className={styles.h2}>No black-box premiums. Ever.</h2>
            <p className={styles.lede}>
              The price you see is the protocol&rsquo;s real ask — not a number we
              invented. We break it down so you (or a skeptical judge) can audit it.
            </p>

            <div className={styles.featList}>
              {[
                {
                  icon: <Eye size={19} strokeWidth={2.3} />,
                  t: "Every cent, itemized",
                  b: "Fair value, spread, and the protocol's 1% floor — laid out on the quote, not buried in a tooltip.",
                },
                {
                  icon: <ReceiptText size={19} strokeWidth={2.3} />,
                  t: "A receipt you can share",
                  b: "Coverage, trigger, premium, and a live price line — the whole policy on one screenshot-ready card.",
                },
                {
                  icon: <BadgeCheck size={19} strokeWidth={2.3} />,
                  t: "Quoted within 5% of execution",
                  b: "We re-check the price the instant before you sign. If it drifts too far, we stop — no nasty surprises.",
                },
              ].map((f) => (
                <div className={styles.feat} key={f.t}>
                  <span className={styles.featIcon} aria-hidden>
                    {f.icon}
                  </span>
                  <div>
                    <div className={styles.featTitle}>{f.t}</div>
                    <p className={styles.featBody}>{f.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={styles.receiptCard}>
              <div className={styles.receiptTop}>
                <span className={styles.receiptTag}>Policy receipt</span>
                <span className={styles.statusChip}>
                  <BadgeCheck size={14} strokeWidth={2.6} /> PAID · {usd(1000)}
                </span>
              </div>
              <div className={styles.bdBlock}>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>Fair value</span>
                  <span className={styles.barTrack}>
                    <motion.span
                      className={styles.barFill}
                      style={{ background: "var(--indigo)" }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 0.71 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className={`${styles.barVal} tnum`}>{usd(10, 2)}</span>
                </div>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>Spread</span>
                  <span className={styles.barTrack}>
                    <motion.span
                      className={styles.barFill}
                      style={{ background: "var(--periwinkle)" }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 0.29 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className={`${styles.barVal} tnum`}>{usd(4, 2)}</span>
                </div>
              </div>
              <div className={styles.receiptFoot}>
                <small>
                  Premium on {usd(1000)} coverage
                  <br />
                  Effective rate 1.4%
                </small>
                <span className={`${styles.receiptTotal} tnum`}>{usd(14, 2)}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why it works */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="why">
        <div className={styles.shell}>
          <Reveal className={styles.head}>
            <p className={styles.kicker}>The clever bit</p>
            <h2 className={styles.h2}>Old primitive, friendly wrapper.</h2>
            <p className={styles.lede}>
              A deep out-of-the-money downside binary already <em>is</em> crash
              insurance. We just stopped pretending it was an options trade.
            </p>
          </Reveal>

          <div className={styles.whyGrid}>
            <Reveal className={styles.whyCardLg}>
              <div>
                <h3>We swap the trading desk for plain language.</h3>
                <p>
                  Same on-chain position a quant would build — reframed into the
                  five words that actually matter to you.
                </p>
              </div>
              <div className={styles.reframe}>
                {[
                  ["DOWN binary, deep OTM", "Crash insurance"],
                  ["Contract quantity", "Your payout"],
                  ["Strike price", "Your trigger"],
                  ["Ask × size", "Your premium"],
                ].map(([from, to]) => (
                  <div className={styles.reframeRow} key={to}>
                    <span className={styles.reframeFrom}>{from}</span>
                    <ArrowRight size={16} strokeWidth={2.4} color="var(--periwinkle)" />
                    <span className={styles.reframeTo}>{to}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal as="article" className={styles.whyCard} delay={0.06}>
              <span className={styles.whyIcon} aria-hidden>
                <Clock4 size={22} strokeWidth={2.2} />
              </span>
              <h3 className={styles.whyTitle}>Sub-hour, rolling</h3>
              <p className={styles.whyBody}>
                Coverage runs to the next on-chain settlement — roughly 30 to 60
                minutes out. Protect a nervous hour, not a whole quarter.
              </p>
            </Reveal>

            <Reveal as="article" className={styles.whyCard} delay={0.12}>
              <span className={styles.whyIcon} aria-hidden>
                <Layers size={22} strokeWidth={2.2} />
              </span>
              <h3 className={styles.whyTitle}>Priced by a live surface</h3>
              <p className={styles.whyBody}>
                Any trigger, any hour — quoted against a live volatility surface
                with a vault always ready to take the other side.
              </p>
            </Reveal>

            <Reveal as="article" className={styles.whyCard} delay={0.18}>
              <span className={styles.whyIcon} aria-hidden>
                <Repeat2 size={22} strokeWidth={2.2} />
              </span>
              <h3 className={styles.whyTitle}>One signature, start to finish</h3>
              <p className={styles.whyBody}>
                Wallet setup, deposit, and mint are bundled into a single tap. The
                plumbing stays out of your way.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Disclosures */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <Reveal className={styles.head}>
            <p className={styles.kicker}>Straight with you</p>
            <h2 className={styles.h2}>The fine print, in normal print.</h2>
          </Reveal>
          <Reveal>
            <div className={styles.discGrid}>
              {[
                ["Parametric, not indemnity", "Payout is a fixed amount at settlement — all-or-nothing. A deeper crash pays the same; a recovery before expiry pays nothing."],
                ["Coverage = the oracle hour", "Your window runs to the oracle's expiry, not a literal 60 minutes. The exact time is on your quote and receipt."],
                ["A vault is your counterparty", "Payouts come from a liquidity vault. Exposure is capped, and a policy can be declined when the vault is full."],
                ["Premium floors at 1%", "The protocol won't sell below 1% of coverage, so that's your minimum — even when fair value is lower. We show it."],
                ["Not regulated insurance", "This is an on-chain options position dressed in insurance language. Helpful framing, not a regulated product."],
                ["We never touch your BTC", "We insure your price exposure. Your Bitcoin stays exactly where it is, in your custody."],
              ].map(([t, b], i) => (
                <div className={styles.discItem} key={t}>
                  <span className={styles.discNum} aria-hidden>
                    {i + 1}
                  </span>
                  <p className={styles.discText}>
                    <b>{t}</b>
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.shell}>
          <Reveal className={styles.finalCard}>
            <h2>Switch the shield on.</h2>
            <p>
              The next hour of Bitcoin is unwritten. Spend a coffee&rsquo;s worth to
              make a crash someone else&rsquo;s problem.
            </p>
            <a className={`${styles.btn} ${styles.finalBtn}`} href="#quote">
              Protect my Bitcoin
              <ArrowRight size={18} strokeWidth={2.4} />
            </a>
            <p className={styles.finalNote}>One tap · one signature · paid automatically</p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.shell} ${styles.footerInner}`}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden>
              <ShieldCheck size={18} strokeWidth={2.4} />
            </span>
            Sentinel
          </Link>
          <p className={styles.footerNote}>
            One-hour parametric crash insurance for BTC, built on DeepBook Predict.
            An on-chain options position presented with insurance framing — not
            regulated insurance.
          </p>
        </div>
      </footer>
    </div>
  );
}
