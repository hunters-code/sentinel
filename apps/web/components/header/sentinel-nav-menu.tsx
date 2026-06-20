"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export type SentinelNavItem = {
  href: string;
  label: string;
  active?: boolean;
};

type SentinelNavMenuProps = {
  items: readonly SentinelNavItem[];
  cta?: SentinelNavItem;
  vertical?: boolean;
  onLinkClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

function NavMenuLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = "sentinel-nav-link";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick} aria-current={active ? "true" : undefined}>
      {label}
    </a>
  );
}

export function SentinelNavMenu({
  items,
  cta,
  vertical = false,
  onLinkClick,
  className,
  ariaLabel = "Primary",
}: SentinelNavMenuProps) {
  return (
    <nav
      className={cn("sentinel-nav", vertical && "sentinel-nav--vertical", className)}
      aria-label={ariaLabel}
    >
      <menu>
        {items.map((item) => (
          <li key={item.href} className={cn(item.active && "is-active")}>
            <NavMenuLink
              href={item.href}
              label={item.label}
              active={item.active}
              onClick={onLinkClick}
            />
          </li>
        ))}
        {cta ? (
          <li className="cta">
            <NavMenuLink href={cta.href} label={cta.label} active={cta.active} onClick={onLinkClick} />
          </li>
        ) : null}
      </menu>
    </nav>
  );
}
