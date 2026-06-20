import { Muted } from "@/components/app/ui/muted";

export function QuoteDisclosures() {
  return (
    <details className="rounded-xl border border-card-border bg-card-fill p-5 shadow-[inset_0_1px_0_theme(colors.card.accent)]">
      <summary className="cursor-pointer list-none text-sm font-medium text-content-secondary [&::-webkit-details-marker]:hidden">
        Important disclosures
      </summary>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-content-secondary">
        <li>
          <strong className="text-content-primary">Parametric, not indemnity.</strong> Payout is
          fixed at settlement. A crash deeper than the trigger pays the same amount; a dip that recovers
          before expiry pays nothing.
        </li>
        <li>
          <strong className="text-content-primary">Coverage window</strong> is the oracle expiry
          shown on your quote — not a rolling hour from purchase.
        </li>
        <li>
          <strong className="text-content-primary">Counterparty</strong> is the PLP vault. Payouts
          depend on vault solvency; mints can be rejected at capacity.
        </li>
        <li>
          <strong className="text-content-primary">Minimum premium</strong> is 1% of coverage when
          the protocol ask floor binds, even if fair value is lower.
        </li>
        <li>
          <strong className="text-content-primary">Not regulated insurance.</strong> This is an
          on-chain options position with insurance-style framing.
        </li>
      </ul>
      <Muted className="mt-4">
        Deeper crashes than the trigger are under-covered relative to your paper loss — the payout is
        capped at the amount shown.
      </Muted>
    </details>
  );
}
