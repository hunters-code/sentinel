"use client";

import { useQuery } from "@tanstack/react-query";

export const KEEPER_URL =
  process.env.NEXT_PUBLIC_KEEPER_URL ?? "http://localhost:8787";

export interface KeeperHealth {
  status: string;
  network: string;
  executor: string | null;
  dryRun: boolean;
  lastPollAt: number | null;
  settlementsProcessed: number;
  claimsSubmitted: number;
  uptimeMs: number;
}

export type KeeperPolicyStatus = "active" | "paid" | "expired";

export interface KeeperPolicy {
  id: string;
  oracleId: string;
  expiryMs: number;
  strike: number;
  coverage: number;
  premium: number;
  payout: number;
  status: KeeperPolicyStatus;
}

export function useKeeperHealth() {
  return useQuery({
    queryKey: ["keeper-health"],
    retry: false,
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<KeeperHealth> => {
      const res = await fetch(`${KEEPER_URL}/health`);
      if (!res.ok) throw new Error(`keeper ${res.status}`);
      return res.json();
    },
  });
}

export function useManagerPolicies(managerId: string | null) {
  return useQuery({
    queryKey: ["keeper-policies", managerId],
    enabled: Boolean(managerId),
    retry: false,
    staleTime: 15_000,
    queryFn: async (): Promise<KeeperPolicy[]> => {
      const res = await fetch(
        `${KEEPER_URL}/managers/${encodeURIComponent(managerId!)}/policies`,
      );
      if (!res.ok) throw new Error(`keeper ${res.status}`);
      const data = (await res.json()) as { policies: KeeperPolicy[] };
      return data.policies ?? [];
    },
  });
}

export async function fetchManagerPolicies(managerId: string): Promise<KeeperPolicy[]> {
  const res = await fetch(
    `${KEEPER_URL}/managers/${encodeURIComponent(managerId)}/policies`,
  );
  if (!res.ok) throw new Error(`keeper ${res.status}`);
  const data = (await res.json()) as { policies: KeeperPolicy[] };
  return data.policies ?? [];
}
