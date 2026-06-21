"use client";

import { Shield, Clock, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AppNavId } from "@/components/app/app-tabs";

const NAV: { id: AppNavId; label: string; icon: typeof Shield }[] = [
  { id: "cover", label: "Cover", icon: Shield },
  { id: "history", label: "History", icon: Clock },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

const LIQUID_NAV =
  "rounded-[1.75rem] border border-[var(--color-liquid-nav-border)] bg-[var(--color-liquid-nav-bg)] p-2 shadow-[var(--color-liquid-nav-shadow)] backdrop-blur-2xl";

function NavButton({
  id,
  label,
  icon: Icon,
  active,
  layout,
  onSelect,
}: {
  id: AppNavId;
  label: string;
  icon: typeof Shield;
  active: boolean;
  layout: "bottom" | "sidebar";
  onSelect: (id: AppNavId) => void;
}) {
  const isBottom = layout === "bottom";

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-current={active ? "page" : undefined}
      aria-label={active || !isBottom ? undefined : label}
      className={cn(
        "group relative flex min-h-[3.25rem] items-center rounded-full transition-[background-color,color,box-shadow] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-content-persistent-white focus-visible:outline-offset-2 motion-reduce:transition-none",
        isBottom ? "flex-1 justify-center px-4" : "w-full justify-start gap-3 px-4",
        active
          ? "bg-sui-blue-dark text-content-persistent-white shadow-[0_4px_18px_rgba(23,89,196,0.55),inset_0_1px_0_rgba(255,255,255,0.28)]"
          : "bg-transparent text-content-primary/70 hover:bg-[var(--color-liquid-nav-hover)] hover:text-content-primary",
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.25 : 1.9} className="shrink-0" aria-hidden />
      {isBottom ? (
        <span
          className={cn(
            "grid transition-[grid-template-columns,opacity,margin] duration-300 ease-out motion-reduce:transition-none",
            active ? "ml-2 grid-cols-[1fr] opacity-100" : "ml-0 grid-cols-[0fr] opacity-0",
          )}
        >
          <span className="overflow-hidden whitespace-nowrap text-[0.8125rem] font-semibold tracking-[-0.01em]">
            {label}
          </span>
        </span>
      ) : (
        <span className="text-[0.8125rem] font-semibold tracking-[-0.01em]">{label}</span>
      )}
    </button>
  );
}

export function AppSidebarNav({
  nav,
  onNavChange,
}: {
  nav: AppNavId;
  onNavChange: (nav: AppNavId) => void;
}) {
  return (
    <aside className="pointer-events-none sticky top-0 z-[2] hidden h-dvh w-[11.5rem] shrink-0 flex-col justify-center bg-gradient-to-r from-sui-black via-sui-black/90 to-transparent px-4 py-8 md:flex">
      <nav aria-label="App navigation" className={cn(LIQUID_NAV, "pointer-events-auto flex flex-col gap-2")}>
        {NAV.map((item) => (
          <NavButton
            key={item.id}
            {...item}
            active={nav === item.id}
            layout="sidebar"
            onSelect={onNavChange}
          />
        ))}
      </nav>
    </aside>
  );
}

export function AppBottomNav({
  nav,
  onNavChange,
}: {
  nav: AppNavId;
  onNavChange: (nav: AppNavId) => void;
}) {
  return (
    <div className="pointer-events-none sticky bottom-0 z-[2] w-full bg-gradient-to-t from-sui-black via-sui-black/80 to-transparent px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10 md:hidden md:px-6">
      <nav aria-label="App navigation" className={cn(LIQUID_NAV, "pointer-events-auto flex w-full items-center gap-2")}>
        {NAV.map((item) => (
          <NavButton
            key={item.id}
            {...item}
            active={nav === item.id}
            layout="bottom"
            onSelect={onNavChange}
          />
        ))}
      </nav>
    </div>
  );
}
