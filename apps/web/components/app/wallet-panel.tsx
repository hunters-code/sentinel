"use client";

import { usd } from "@/lib/format";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { WalletPayoutActions } from "@/components/app/policy-payout-actions";
import { Panel } from "@/components/app/ui/panel";
import { Muted } from "@/components/app/ui/muted";

export function WalletPanel({ managerId }: { managerId: string | null }) {
  const { balance, loading: balanceLoading } = useManagerBalance(managerId);

  if (!managerId) {
    return (
      <Panel>
        <h2 className="mb-2 font-display text-lg font-medium">Nothing to withdraw yet</h2>
        <Muted>
          Your first cover purchase opens a payout balance here. Settled winnings land automatically —
          then you can send them to your wallet.
        </Muted>
      </Panel>
    );
  }

  return (
    <Panel className="space-y-4">
      <div>
        <p className="text-sm font-medium text-content-secondary">Available to withdraw</p>
        <p className="mt-2 font-display text-3xl font-medium tabular-nums text-content-primary" aria-live="polite">
          {balanceLoading ? "…" : usd(balance)}
        </p>
        <Muted className="mt-2">Stablecoin balance from settled cover payouts</Muted>
      </div>

      <WalletPayoutActions managerId={managerId} />
    </Panel>
  );
}
