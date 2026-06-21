"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";
import { SentinelLogo } from "@/components/sentinel-logo";
import { LANDING_EASE } from "@/lib/landing-motion";

const NAV_ITEMS = [
  {
    label: "How it works",
    href: "#how",
    id: "how",
    links: [
      { label: "Quote", desc: "Price and size your coverage in seconds." },
      { label: "Receipt", desc: "Live price tracker with trigger status." },
      { label: "Payout", desc: "Auto-settle on expiry — no claim needed." },
    ],
    card: { label: "One tap, one signature", hint: "No options desk" },
  },
  {
    label: "Built on Sui",
    href: "#stack",
    id: "stack",
    links: [
      { label: "DeepBook Predict", desc: "Live SVI pricing, market-derived." },
      { label: "On-chain settlement", desc: "Payouts run without us." },
      { label: "Keeper network", desc: "Permissionless payout claims." },
    ],
    card: { label: "Powered by Sui", hint: "Testnet live" },
  },
] as const;

type NavItemId = (typeof NAV_ITEMS)[number]["id"];

export function LandingHeader() {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<NavItemId | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) observer.observe(section!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) dialog.showModal();
    else if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

  useEffect(() => {
    if (!openDropdown) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDropdown(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openDropdown]);

  const openNav = useCallback((id: NavItemId) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenDropdown(id);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpenDropdown(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }, []);

  const navItems = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: item.label,
    active: activeSection === item.id,
  }));

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 bg-sui-black"
      initial={reduce ? false : { opacity: 1, y: -12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: LANDING_EASE }}
    >
      <div className="relative mx-auto hidden max-w-container items-center gap-6 px-5 py-4 md:px-10 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex items-center gap-3 justify-self-start text-content-primary no-underline">
          <SentinelLogo size={38} />
          <span className="font-display text-[1.25rem] font-normal leading-none tracking-[-0.02em]">
            Sentinel
          </span>
        </Link>

        <nav aria-label="Primary" className="relative flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isOpen = openDropdown === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => openNav(item.id)}
                onMouseLeave={scheduleClose}
                onFocus={() => openNav(item.id)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) scheduleClose();
                }}
              >
                <a
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 font-display text-[0.9375rem] font-normal leading-none tracking-[-0.012em] no-underline transition-colors duration-200",
                    isOpen
                      ? "bg-[var(--color-background-inverse-bleedthrough-weak)] text-sui-blue"
                      : "text-content-primary/86 hover:bg-[var(--color-background-inverse-bleedthrough-weak)] hover:text-sui-blue",
                  )}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onFocus={() => openNav(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setOpenDropdown(null);
                    }
                  }}
                >
                  {item.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className="opacity-55"
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                <div
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-[calc(100%+0.85rem)] z-[60] grid w-[min(92vw,560px)] -translate-x-1/2 grid-cols-[1fr_auto] gap-3 rounded-[1.25rem] border border-white/12 bg-[rgba(0,18,41,0.92)] p-3 text-white opacity-0 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-[26px] transition-all duration-200",
                    isOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "translate-y-1.5",
                  )}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  role="region"
                  aria-label={`${item.label} menu`}
                  hidden={!isOpen}
                >
                  <ul className="m-0 flex min-w-[220px] list-none flex-col gap-1 p-0">
                    {item.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={item.href}
                          className="flex min-h-[52px] flex-col justify-center gap-0.5 rounded-xl px-3 py-2.5 no-underline transition-colors duration-150 hover:bg-white/[0.06]"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="font-display text-[0.9375rem] font-normal leading-tight text-white">
                            {link.label}
                          </span>
                          <span className="text-landing-body leading-[1.35] text-sui-steel">{link.desc}</span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="relative min-w-[180px] rounded-2xl border border-sui-blue/35 bg-[linear-gradient(180deg,rgba(0,46,106,0.88)_0%,rgba(0,17,42,0.92)_100%)] p-3.5">
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_top,rgba(41,141,255,0.24)_0%,rgba(41,141,255,0)_72%)]"
                      aria-hidden
                    />
                    <p className="relative font-display text-[0.9375rem] font-normal leading-tight text-white">
                      {item.card.label}
                    </p>
                    <p className="text-landing-body relative mt-1 leading-[1.4] text-sui-steel">{item.card.hint}</p>
                    <a
                      href="/app"
                      className="text-landing-body relative mt-3 inline-flex font-medium text-sui-blue no-underline transition-colors duration-150 hover:text-white"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Get a quote →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-3 text-base md:flex lg:text-lg">
          <QuoteCtaButton href="/app" quiet />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-3 text-content-primary no-underline">
          <SentinelLogo size={34} />
          <span className="font-display text-[1.125rem] font-normal leading-none tracking-[-0.02em]">
            Sentinel
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-sui-line text-sui-white"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            {mobileOpen ? (
              <path
                d="M4 4L14 14M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-nav"
        className="m-0 h-full w-full max-w-none border-0 bg-sui-black p-0 text-content-primary lg:hidden [&::backdrop]:bg-black/80 [&::backdrop]:backdrop-blur-sm"
        onClose={() => setMobileOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setMobileOpen(false);
        }}
      >
        <div className="flex min-h-full flex-col px-5 pb-10 pt-24">
          <nav aria-label="Mobile">
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-11 w-full items-center rounded-xl px-4 py-2 text-base no-underline transition-colors duration-150",
                      item.active
                        ? "bg-[var(--color-background-inverse-bleedthrough-medium)] text-content-primary"
                        : "text-sui-steel hover:bg-[var(--color-background-inverse-bleedthrough-weak)] hover:text-content-primary",
                    )}
                    onClick={() => setMobileOpen(false)}
                    aria-current={item.active ? "true" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pt-10">
            <QuoteCtaButton href="/app" quiet className="w-full" onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      </dialog>
    </motion.header>
  );
}
