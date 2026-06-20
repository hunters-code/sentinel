"use client";

import { ASSETS, type AssetId } from "@/lib/assets";
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
        <span className="text-sm font-medium" style={{ color: "var(--sui-steel)" }}>
          Which asset?
        </span>
        <span
          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
          style={{ color: "var(--sui-steel)", borderColor: "var(--sui-line)" }}
        >
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
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors"
              style={
                active
                  ? {
                      borderColor: "var(--sui-blue)",
                      background: "var(--color-card-fill, #000000)",
                      color: "var(--sui-white)",
                      boxShadow: "inset 0 1px 0 var(--color-card-accent, rgba(77, 162, 255, 0.14))",
                    }
                  : {
                      borderColor: "var(--sui-line)",
                      background: "var(--color-card-fill, #000000)",
                      color: "var(--sui-white)",
                    }
              }
            >
              <AssetLogo id={asset.id} size={20} />
              <span className="flex items-baseline gap-1.5">
                {asset.symbol}
                {!asset.live && (
                  <span className="text-[11px] font-normal" style={{ color: "var(--sui-steel)" }}>
                    soon
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
