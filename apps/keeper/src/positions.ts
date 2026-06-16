import {
  aggregateOpenPositions,
  createPredictServerClient,
  downBinaryWins,
  dusdcToUsd,
  oraclePriceToUsd,
  type OpenPosition,
} from "@sentinel/shared";
import { config } from "./config.js";

export interface ClaimablePosition extends OpenPosition {
  settlementPrice: number;
}

const predictServer = createPredictServerClient({
  baseUrl: config.predictServerUrl,
});

export async function findClaimablePositions(
  oracleId: string,
  settlementPrice: number,
): Promise<ClaimablePosition[]> {
  const [minted, redeemed] = await Promise.all([
    predictServer.getMintedPositions({ oracleId, limit: 10_000 }),
    predictServer.getRedeemedPositions({ oracleId, limit: 10_000 }),
  ]);

  const open = aggregateOpenPositions(minted, redeemed);

  return open
    .filter((position) => !position.isUp)
    .filter((position) => downBinaryWins(position.strike, settlementPrice))
    .map((position) => ({ ...position, settlementPrice }));
}

export async function groupByManager(
  positions: ClaimablePosition[],
): Promise<Map<string, ClaimablePosition[]>> {
  const groups = new Map<string, ClaimablePosition[]>();
  for (const position of positions) {
    const existing = groups.get(position.managerId);
    if (existing) {
      existing.push(position);
    } else {
      groups.set(position.managerId, [position]);
    }
  }
  return groups;
}

export type KeeperPolicyStatus = "active" | "paid" | "expired";

export interface KeeperPolicy {
  id: string;
  oracleId: string;
  expiryMs: number;
  strike: number; // USD
  coverage: number; // USD payout if triggered
  premium: number; // USD paid
  payout: number; // USD actually paid out
  status: KeeperPolicyStatus;
}

/**
 * Builds the renderable policy list for one PredictManager: minted DOWN
 * positions grouped by oracle+strike, enriched with redeem and settlement
 * state so the frontend can show ACTIVE / PAID / EXPIRED.
 */
export async function getManagerPolicies(managerId: string): Promise<KeeperPolicy[]> {
  const [minted, redeemed] = await Promise.all([
    predictServer.getMintedPositions({ managerId, limit: 10_000 }),
    predictServer.getRedeemedPositions({ managerId, limit: 10_000 }),
  ]);

  type Agg = {
    oracleId: string;
    expiry: number;
    strike: number;
    quantity: number;
    cost: number;
  };

  const mints = new Map<string, Agg>();
  for (const m of minted) {
    if (m.is_up) continue; // Sentinel only mints DOWN binaries
    const key = `${m.oracle_id}:${m.strike}`;
    const e = mints.get(key) ?? {
      oracleId: m.oracle_id,
      expiry: m.expiry,
      strike: m.strike,
      quantity: 0,
      cost: 0,
    };
    e.quantity += m.quantity;
    e.cost += m.cost;
    mints.set(key, e);
  }

  const redeems = new Map<string, { payout: number }>();
  for (const r of redeemed) {
    if (r.is_up) continue;
    const key = `${r.oracle_id}:${r.strike}`;
    const e = redeems.get(key) ?? { payout: 0 };
    e.payout += r.payout;
    redeems.set(key, e);
  }

  const oracleIds = [...new Set([...mints.values()].map((e) => e.oracleId))];
  const states = new Map<string, { status: string; settlementPrice: number | null }>();
  await Promise.all(
    oracleIds.map(async (id) => {
      try {
        const { oracle } = await predictServer.getOracleState(id);
        states.set(id, {
          status: oracle.status,
          settlementPrice: oracle.settlement_price,
        });
      } catch {
        // leave unknown — treated as still active
      }
    }),
  );

  const policies: KeeperPolicy[] = [];
  for (const [key, e] of mints) {
    const coverage = dusdcToUsd(e.quantity);
    const premium = dusdcToUsd(e.cost);
    const red = redeems.get(key);
    const state = states.get(e.oracleId);

    let status: KeeperPolicyStatus = "active";
    let payout = 0;

    if (red && red.payout > 0) {
      status = "paid";
      payout = dusdcToUsd(red.payout);
    } else if (state?.status === "settled") {
      const sp = state.settlementPrice;
      if (sp != null && downBinaryWins(e.strike, sp)) {
        status = "paid"; // settled in the money, keeper claim pending/landing
        payout = coverage;
      } else {
        status = "expired";
      }
    }

    policies.push({
      id: key,
      oracleId: e.oracleId,
      expiryMs: e.expiry,
      strike: oraclePriceToUsd(e.strike),
      coverage,
      premium,
      payout,
      status,
    });
  }

  policies.sort((a, b) => b.expiryMs - a.expiryMs);
  return policies;
}
