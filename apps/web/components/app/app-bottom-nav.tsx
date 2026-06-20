"use client";

import { Shield, Clock, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AppNavId } from "@/components/app/app-tabs";

const NAV: { id: AppNavId; label: string; icon: typeof Shield }[] = [
  { id: "cover", label: "Cover", icon: Shield },
  { id: "history", label: "History", icon: Clock },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export function AppBottomNav({
  nav,
  onNavChange,
}: {
  nav: AppNavId;
  onNavChange: (nav: AppNavId) => void;
}) {
  return (
    <nav
      className="sticky bottom-0 z-[2] shrink-0 bg-sui-black px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      aria-label="App navigation"
    >
      <div className="flex items-stretch gap-0.5 rounded-full bg-page-tab-bar p-1 shadow-[0_-4px_20px_rgba(0,0,0,0.55),0_10px_36px_rgba(0,0,0,0.5),0_2px_14px_rgba(10,61,114,0.65)]">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = nav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full border-none px-2 py-1.5 text-[0.6875rem] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-content-persistent-white focus-visible:outline-offset-2",
                active
                  ? "bg-sui-black text-content-persistent-white"
                  : "bg-transparent text-content-persistent-white/75 hover:text-content-persistent-white",
              )}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 1.75}
                aria-hidden
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
