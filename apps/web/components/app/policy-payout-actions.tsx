"use client";

import Link from "next/link";
import { PrimaryButton } from "@/components/app/ui/primary-button";
import { usd } from "@/lib/format";
import {
  formatQuantityUsd,
  useClaimPayout,
  useWithdraw,
  withdrawableAmount,
} from "@/lib/use-payout-actions";
import { useManagerBalance } from "@/lib/use-manager-balance";
import { usePolicyOpenQuantity } from "@/lib/use-policy-open-quantity";
import type { KeeperPolicy } from "@/lib/keeper";

export function WalletPayoutActions({ managerId }: { managerId: string }) {
  const { balance, loading: balanceLoading, refetch } = useManagerBalance(managerId);
  const { withdraw, withdrawing, done, error } = useWithdraw();
  const amount = withdrawableAmount(balance);

  if (done) {
    return (
      <p className="text-sm font-medium text-sui-blue-bright" role="status">
        Sent to your wallet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-signal-orange" role="alert">
          {error}
        </p>
      )}
      <PrimaryButton
        disabled={amount <= 0 || withdrawing || balanceLoading}
        onClick={() => withdraw(managerId, amount).then(() => refetch())}
      >
        {withdrawing ? "Withdrawing…" : "Withdraw to wallet"}
      </PrimaryButton>
    </div>
  );
}

export function PolicyPayoutActions({
  policy,
  managerId,
}: {
  policy: KeeperPolicy;
  managerId: string | null;
}) {
  const isPaidOut = policy.status === "paid" && policy.payout > 0;
  const { balance, loading: balanceLoading, refetch } = useManagerBalance(managerId);
  const { data: openQuantity = 0, isLoading: openLoading } = usePolicyOpenQuantity(
    managerId,
    policy.id,
    isPaidOut,
  );
  const { withdraw, withdrawing, done, error: withdrawError, reset } = useWithdraw();
  const { claim, claiming, error: claimError } = useClaimPayout();

  const needsClaim = isPaidOut && openQuantity > 0;
  const withdrawAmount = withdrawableAmount(balance, policy.payout);
  const canWithdraw = Boolean(managerId) && withdrawAmount > 0 && !done;
  const claimAmountUsd = formatQuantityUsd(openQuantity);
  const busy = withdrawing || claiming || balanceLoading || openLoading;

  if (!isPaidOut) return null;

  if (done) {
    return (
      <p className="text-sm font-medium text-sui-blue-bright" role="status">
        Sent to your wallet.{" "}
        <Link href="/app?tab=wallet" className="text-sui-blue-bright underline">
          Open Wallet
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {claimError && (
        <p className="text-sm text-signal-orange" role="alert">
          {claimError}
        </p>
      )}
      {withdrawError && (
        <p className="text-sm text-signal-orange" role="alert">
          {withdrawError}
        </p>
      )}

      {needsClaim && managerId && (
        <PrimaryButton
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={async () => {
            reset();
            await claim(policy, managerId, openQuantity);
            await refetch();
          }}
        >
          {claiming ? "Claiming…" : `Claim ${usd(claimAmountUsd, 0)} payout`}
        </PrimaryButton>
      )}

      {canWithdraw && managerId && (
        <PrimaryButton
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={async () => {
            await withdraw(managerId, withdrawAmount);
            await refetch();
          }}
        >
          {withdrawing ? "Withdrawing…" : `Withdraw ${usd(withdrawAmount, 0)} to wallet`}
        </PrimaryButton>
      )}

      {isPaidOut && !needsClaim && !canWithdraw && !busy && (
        <p className="text-sm text-content-secondary" role="status">
          {balance <= 0 ? "Payout already sent to your wallet." : "Nothing left to withdraw."}
        </p>
      )}
    </div>
  );
}
