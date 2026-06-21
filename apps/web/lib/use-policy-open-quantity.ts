"use client";

import { useQuery } from "@tanstack/react-query";
import { createPredictServerClient } from "@sentinel/shared";
import { parsePolicyReceiptId } from "@/lib/policy-id";

export function usePolicyOpenQuantity(
  managerId: string | null,
  policyId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["policy-open-qty", managerId, policyId],
    enabled: Boolean(managerId && policyId && enabled),
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<number> => {
      const parsed = parsePolicyReceiptId(policyId!);
      if (!parsed) return 0;
      const client = createPredictServerClient();
      const rows = await client.getManagerPositionsSummary(managerId!);
      const row = rows.find(
        (r) =>
          r.oracle_id === parsed.oracleId && r.strike === parsed.strikeRaw && !r.is_up,
      );
      return row?.open_quantity ?? 0;
    },
  });
}
