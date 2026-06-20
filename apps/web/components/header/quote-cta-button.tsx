"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type QuoteCtaButtonProps = {
  href: string;
  label?: string;
  className?: string;
  onClick?: () => void;
};

function LaunchArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 13"
      fill="none"
      className="h-[14.73px] w-[12.31px] shrink-0"
      aria-hidden
    >
      <path
        d="M11.52 5.66L5.86 0L5.16 0.71L10.31 5.86H0V6.86H10.31L5.16 12.02L5.86 12.73L11.52 7.07L12.23 6.36L11.52 5.66Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function QuoteCtaButton({
  href,
  label = "Get a quote",
  className,
  onClick,
}: QuoteCtaButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-[26px] border border-white/20 p-[1px] no-underline outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#5ca9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className,
      )}
      onClick={onClick}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
        <span className="absolute -inset-[42%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,rgba(92,169,255,0),rgba(92,169,255,0.85),rgba(92,169,255,0.25),rgba(92,169,255,0))]" />
      </span>
      <span
        className="pointer-events-none absolute inset-[1px] rounded-[calc(26px-1px)] border border-white/35 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      />
      <span className="relative z-[1] inline-flex min-h-[calc(44px-2px)] w-full items-center justify-center gap-2.5 rounded-[calc(26px-1px)] bg-black px-7 py-3 font-[var(--font-display)] text-[0.9375rem] font-medium leading-none tracking-[0.045em] text-white transition-colors duration-200 group-hover:text-[#5ca9ff]">
        <span>{label}</span>
        <LaunchArrowIcon />
      </span>
    </Link>
  );
}
