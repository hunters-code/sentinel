"use client";

import { usd } from "@/lib/format";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { useWithdraw } from "@/lib/use-purchase";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";
import { PrimaryButton } from "@/components/app/ui/primary-button";

export function WalletPanel({ managerId }: { managerId: string | null }) {
  const { balance, loading: balanceLoading, refetch } = useManagerBalance(managerId);
  const { withdraw, withdrawing, done, error } = useWithdraw();

  if (!managerId) {
    return (
      <Panel>
        <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
          No manager yet
        </h2>
        <Muted>
          Your first cover purchase creates a manager account to hold payouts until you withdraw to
          your wallet.
        </Muted>
      </Panel>
    );
  }

  return (
    <Panel className="space-y-4">
      <Muted>Manager balance</Muted>
      <p
        className="text-3xl font-medium tabular-nums"
        style={{ fontFamily: "var(--font-display)" }}
        aria-live="polite"
      >
        {balanceLoading ? "…" : usd(balance)}
      </p>
      <Muted>dUSDC ready to withdraw to your connected wallet</Muted>

      {error && (
        <p className="text-sm" role="alert" style={{ color: "#fa8543" }}>
          {error}
        </p>
      )}

      {done ? (
        <p className="text-sm font-medium" style={{ color: "#7df752" }}>
          Sent to your wallet
        </p>
      ) : (
        <PrimaryButton
          disabled={balance <= 0 || withdrawing || balanceLoading}
          onClick={() => {
            if (managerId) {
              withdraw(managerId, balance).then(() => refetch());
            }
          }}
        >
          {withdrawing ? "Withdrawing…" : "Withdraw to wallet"}
        </PrimaryButton>
      )}
    </Panel>
  );
}
