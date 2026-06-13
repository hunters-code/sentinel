import type { SuiClient, SuiEvent } from "@mysten/sui/client";
import { config } from "./config.js";
import { ORACLE_SETTLED_EVENT } from "./sui.js";

export interface OracleSettledEvent {
  oracleId: string;
  expiry: number;
  settlementPrice: number;
  timestamp: number;
}

export function parseOracleSettled(event: SuiEvent): OracleSettledEvent | null {
  if (event.type !== ORACLE_SETTLED_EVENT) return null;
  const parsed = event.parsedJson as Record<string, string> | null;
  if (!parsed) return null;

  const oracleId = parsed.oracle_id;
  if (!oracleId) return null;

  return {
    oracleId,
    expiry: Number(parsed.expiry),
    settlementPrice: Number(parsed.settlement_price),
    timestamp: Number(parsed.timestamp),
  };
}

export class OracleSettledWatcher {
  private readonly seen = new Set<string>();

  constructor(private readonly client: SuiClient) {}

  async poll(limit = config.eventPollLimit): Promise<OracleSettledEvent[]> {
    const page = await this.client.queryEvents({
      query: { MoveEventType: ORACLE_SETTLED_EVENT },
      limit,
      order: "descending",
    });

    const fresh: OracleSettledEvent[] = [];

    for (const event of page.data) {
      const settled = parseOracleSettled(event);
      if (!settled) continue;
      if (this.seen.has(settled.oracleId)) continue;
      this.seen.add(settled.oracleId);
      fresh.push(settled);
    }

    return fresh.reverse();
  }

  async bootstrap(recentCount = config.bootstrapSettlements): Promise<OracleSettledEvent[]> {
    const page = await this.client.queryEvents({
      query: { MoveEventType: ORACLE_SETTLED_EVENT },
      limit: recentCount,
      order: "descending",
    });

    const events: OracleSettledEvent[] = [];
    for (const event of page.data) {
      const settled = parseOracleSettled(event);
      if (!settled) continue;
      if (this.seen.has(settled.oracleId)) continue;
      this.seen.add(settled.oracleId);
      events.push(settled);
    }

    return events.reverse();
  }
}
