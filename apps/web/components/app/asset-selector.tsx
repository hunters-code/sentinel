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
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-content-secondary">Which asset?</span>
        <span className="inline-flex items-center rounded-full border border-border-neutral px-2.5 py-0.5 text-xs font-medium text-content-secondary">
          Testnet
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Asset">
        {ASSETS.map((asset) => {
          const active = asset.id === selected;
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelect(asset.id)}
              aria-pressed={active}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-card-fill px-3 py-2.5 text-sm font-medium text-content-primary transition-colors",
                active
                  ? "border-sui-blue shadow-[inset_0_1px_0_theme(colors.card.accent)]"
                  : "border-border-neutral",
              )}
            >
              <AssetLogo id={asset.id} size={20} />
              <span className="flex items-baseline gap-1.5">
                {asset.symbol}
                {!asset.live && (
                  <span className="text-[11px] font-normal text-content-secondary">soon</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
