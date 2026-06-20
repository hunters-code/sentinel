"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";
import { SentinelNavMenu } from "@/components/header/sentinel-nav-menu";
import { SentinelLogo } from "@/components/sentinel-logo";

const NAV_LINKS = [
  { href: "#how", id: "how", label: "How it works" },
  { href: "#stack", id: "stack", label: "On Sui" },
  { href: "#disclosures", id: "disclosures", label: "Disclosures" },
] as const;

export function LandingHeader() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const sections = NAV_LINKS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) {
      observer.observe(section!);
    }

    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  const navItems = NAV_LINKS.map((item) => ({
    href: item.href,
    label: item.label,
    active: activeSection === item.id,
  }));

  return (
    <header className="sentinel-header fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="relative z-[1] flex shrink-0 items-center gap-2.5 no-underline">
          <SentinelLogo size={32} />
          <span
            className="text-[15px] font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--sui-white)" }}
          >
            Sentinel
          </span>
        </Link>

        <div className="pointer-events-none absolute inset-x-6 hidden justify-center md:inset-x-10 md:flex">
          <div className="pointer-events-auto">
            <SentinelNavMenu items={navItems} />
          </div>
        </div>

        <div className="relative z-[1] ml-auto flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg border md:hidden"
            style={{ borderColor: "var(--sui-line)", color: "var(--sui-white)" }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              {open ? (
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

          <QuoteCtaButton href="/app" />
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-nav"
        className="landing-dialog m-0 w-full max-w-none border-0 p-0 md:hidden"
        style={{ background: "var(--sui-black)", color: "var(--sui-white)" }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="flex min-h-full flex-col px-6 pb-10 pt-24">
          <SentinelNavMenu
            items={navItems}
            vertical
            onLinkClick={closeMenu}
            ariaLabel="Mobile"
          />

          <div className="mt-auto pt-10">
            <QuoteCtaButton href="/app" className="w-full [&_.sentinel-quote-cta]:w-full [&_.sentinel-quote-cta]:justify-center" onClick={closeMenu} />
          </div>
        </div>
      </dialog>
    </header>
  );
}
