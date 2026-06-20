"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#stack", label: "On Sui" },
  { href: "#disclosures", label: "Disclosures" },
] as const;

const linkClass =
  "block min-h-11 rounded-lg px-4 py-3 text-base no-underline transition-colors hover:bg-white/5";

export function LandingHeader() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
      style={{
        background: "var(--sui-black)",
        borderBottom: "1px solid var(--sui-line)",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" width={28} height={28} className="h-7 w-7" aria-hidden />
        <span
          className="text-[15px] font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sentinel
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Primary">
        {NAV_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="no-underline transition-opacity hover:opacity-70"
            style={{ color: "var(--sui-steel)" }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/app"
          className="rounded-full px-5 py-2.5 text-sm font-medium no-underline transition-opacity hover:opacity-90"
          style={{ background: "var(--sui-blue)", color: "#000" }}
        >
          Get a quote
        </Link>

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
        <nav className="flex flex-col px-6 pb-8 pt-24" aria-label="Mobile">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={linkClass}
              style={{ color: "var(--sui-white)" }}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
