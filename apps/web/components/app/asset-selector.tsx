"use client";

import { ASSETS, type AssetId } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { AssetLogo } from "@/components/app/asset-logo";

export function AssetSelector({
  selected,
  onSelect,
}: {
  selected: AssetId;
  onSelect: (id: AssetId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Asset">
        {ASSETS.map((asset) => {
          const active = asset.id === selected;
          const disabled = !asset.live;

          return (
            <button
              key={asset.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(asset.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                disabled && "cursor-not-allowed opacity-55",
                active
                  ? "border-sui-blue bg-sui-blue/10 text-content-primary shadow-[inset_0_1px_0_theme(colors.card.accent)]"
                  : "border-border-neutral bg-transparent text-content-primary hover:bg-white/[0.04]",
                disabled && !active && "hover:bg-transparent",
              )}
            >
              <AssetLogo id={asset.id} size={18} />
              <span>{asset.symbol}</span>
              {disabled && (
                <span className="rounded-full border border-border-neutral px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-content-tertiary">
                  Soon
                </span>
              )}
            </button>
          );
        })}
    </div>
  );
}
