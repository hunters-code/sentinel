"use client";

export function SettlementWindowsLoading() {
  return (
    <div className="app-settlement-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="app-settlement-loading-row">
        <span className="app-settlement-loading-spinner" aria-hidden />
        <div className="app-settlement-loading-text">
          <p className="app-settlement-loading-title">Checking open windows</p>
          <p className="app-settlement-loading-hint">
            Pulling BTC expiry oracles from Predict testnet — usually a few seconds.
          </p>
        </div>
      </div>
      <div className="app-settlement-loading-track" aria-hidden>
        <span className="app-settlement-loading-bar" />
      </div>
    </div>
  );
}
