"use client";

export function SettlementWindowsLoading() {
  return (
    <div
      className="mt-4 rounded-2xl border border-card-border bg-card-fill py-3.5 px-4 shadow-[inset_0_1px_0_theme(colors.card-accent)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 size-[1.125rem] shrink-0 animate-spin rounded-full border-2 border-white/[0.14] border-t-action-primary"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="mb-[0.2rem] mt-0 text-[0.8125rem] font-semibold leading-[1.3] text-content-primary">
            Checking open windows
          </p>
          <p className="m-0 text-xs leading-[1.45] text-content-secondary">
            Pulling BTC expiry oracles from Predict testnet — usually a few seconds.
          </p>
        </div>
      </div>
      <div className="mt-3.5 h-[0.1875rem] overflow-hidden rounded-full bg-white/[0.08]" aria-hidden>
        <span className="block h-full w-[40%] animate-settlement-bar rounded-[inherit] bg-gradient-to-r from-transparent via-action-primary to-transparent" />
      </div>
    </div>
  );
}
