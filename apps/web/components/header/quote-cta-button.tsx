"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type QuoteCtaButtonProps = {
  href: string;
  label?: string;
  className?: string;
  onClick?: () => void;
};

export function QuoteCtaButton({
  href,
  label = "Get a quote",
  className,
  onClick,
}: QuoteCtaButtonProps) {
  return (
    <span className={cn("sentinel-quote-cta-wrap", className)}>
      <span className="sentinel-quote-cta-ring" aria-hidden />
      <Link href={href} className="sentinel-quote-cta" onClick={onClick}>
        {label}
      </Link>
    </span>
  );
}
