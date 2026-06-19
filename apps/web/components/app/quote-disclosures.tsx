import { Muted } from "@/components/app/ui/muted";

export function QuoteDisclosures() {
  return (
    <details
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--sui-line)", background: "rgba(255,255,255,0.02)" }}
    >
      <summary
        className="cursor-pointer text-sm font-medium list-none [&::-webkit-details-marker]:hidden"
        style={{ color: "var(--sui-steel)" }}
      >
        Important disclosures
      </summary>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--sui-steel)" }}>
        <li>
          <strong style={{ color: "var(--sui-white)" }}>Parametric, not indemnity.</strong> Payout is
          fixed at settlement. A crash deeper than the trigger pays the same amount; a dip that recovers
          before expiry pays nothing.
        </li>
        <li>
          <strong style={{ color: "var(--sui-white)" }}>Coverage window</strong> is the oracle expiry
          shown on your quote — not a rolling hour from purchase.
        </li>
        <li>
          <strong style={{ color: "var(--sui-white)" }}>Counterparty</strong> is the PLP vault. Payouts
          depend on vault solvency; mints can be rejected at capacity.
        </li>
        <li>
          <strong style={{ color: "var(--sui-white)" }}>Minimum premium</strong> is 1% of coverage when
          the protocol ask floor binds, even if fair value is lower.
        </li>
        <li>
          <strong style={{ color: "var(--sui-white)" }}>Not regulated insurance.</strong> This is an
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
