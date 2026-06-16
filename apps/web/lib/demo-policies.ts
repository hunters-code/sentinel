export type PolicyStatus = "active" | "paid" | "expired";

export type Policy = {
  id: string;
  date: string;
  btc: number;
  trigger: number;
  coverage: number;
  premium: number;
  status: PolicyStatus;
  payout?: number;
  expiresIn?: string;
  spot?: number;
};

export const DEMO_SPOT = 100_000;

export const DEMO_POLICIES: Policy[] = [
  {
    id: "0042",
    date: "Jun 16",
    btc: 0.5,
    trigger: 98_000,
    coverage: 1_000,
    premium: 14,
    status: "active",
    expiresIn: "22 min",
    spot: DEMO_SPOT,
  },
  {
    id: "0041",
    date: "Jun 14",
    btc: 0.5,
    trigger: 98_000,
    coverage: 1_000,
    premium: 14,
    status: "paid",
    payout: 1_000,
    spot: DEMO_SPOT,
  },
  {
    id: "0038",
    date: "Jun 12",
    btc: 0.2,
    trigger: 98_000,
    coverage: 400,
    premium: 5.6,
    status: "expired",
    spot: DEMO_SPOT,
  },
];

export function getPolicy(id: string): Policy | undefined {
  return DEMO_POLICIES.find((p) => p.id === id);
}

export const DEMO_MANAGER_BALANCE = 847;
