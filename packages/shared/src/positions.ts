import type { PositionMinted, PositionRedeemed } from "./predictServer";

export interface PositionKey {
  managerId: string;
  oracleId: string;
  expiry: number;
  strike: number;
  isUp: boolean;
}

export interface OpenPosition extends PositionKey {
  quantity: number;
}

function positionKeyId(key: PositionKey): string {
  return `${key.managerId}:${key.oracleId}:${key.expiry}:${key.strike}:${key.isUp}`;
}

export function aggregateOpenPositions(
  minted: PositionMinted[],
  redeemed: PositionRedeemed[],
): OpenPosition[] {
  const quantities = new Map<string, OpenPosition>();

  for (const row of minted) {
    const key: OpenPosition = {
      managerId: row.manager_id,
      oracleId: row.oracle_id,
      expiry: row.expiry,
      strike: row.strike,
      isUp: row.is_up,
      quantity: row.quantity,
    };
    const id = positionKeyId(key);
    const existing = quantities.get(id);
    if (existing) {
      existing.quantity += row.quantity;
    } else {
      quantities.set(id, { ...key });
    }
  }

  for (const row of redeemed) {
    const key: PositionKey = {
      managerId: row.manager_id,
      oracleId: row.oracle_id,
      expiry: row.expiry,
      strike: row.strike,
      isUp: row.is_up,
    };
    const id = positionKeyId(key);
    const existing = quantities.get(id);
    if (!existing) continue;
    existing.quantity -= row.quantity;
  }

  return [...quantities.values()].filter((position) => position.quantity > 0);
}

export function downBinaryWins(strike: number, settlementPrice: number): boolean {
  return settlementPrice <= strike;
}
