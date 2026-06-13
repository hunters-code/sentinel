import {
  aggregateOpenPositions,
  createPredictServerClient,
  downBinaryWins,
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
