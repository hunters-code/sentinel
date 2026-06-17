import { PREDICT_SERVER_URL } from "./constants";

export interface PredictServerStatus {
  status: string;
  latest_onchain_checkpoint: number;
  current_time_ms: number;
}

export interface OracleRecord {
  predict_id: string;
  oracle_id: string;
  oracle_cap_id: string;
  underlying_asset: string;
  expiry: number;
  min_strike: number;
  tick_size: number;
  status: "inactive" | "active" | "settled";
  activated_at: number | null;
  settlement_price: number | null;
  settled_at: number | null;
  created_checkpoint: number;
}

export interface PositionMinted {
  event_digest: string;
  digest: string;
  predict_id: string;
  manager_id: string;
  trader: string;
  quote_asset: string;
  oracle_id: string;
  expiry: number;
  strike: number;
  is_up: boolean;
  quantity: number;
  cost: number;
  ask_price: number;
  checkpoint_timestamp_ms: number;
}

export interface PositionRedeemed {
  event_digest: string;
  digest: string;
  predict_id: string;
  manager_id: string;
  owner: string;
  executor: string;
  quote_asset: string;
  oracle_id: string;
  expiry: number;
  strike: number;
  is_up: boolean;
  quantity: number;
  payout: number;
  bid_price: number;
  is_settled: boolean;
  checkpoint_timestamp_ms: number;
}

export interface ManagerPositionSummary {
  predict_id: string;
  manager_id: string;
  quote_asset: string;
  oracle_id: string;
  underlying_asset: string;
  expiry: number;
  strike: number;
  is_up: boolean;
  minted_quantity: number;
  redeemed_quantity: number;
  open_quantity: number;
  status: string;
}

export interface OraclePriceRecord {
  oracle_id: string;
  price: number;
  timestamp_ms: number;
}

export interface OracleSviRecord {
  oracle_id: string;
  a: number;
  b: number;
  rho: number;
  m: number;
  sigma: number;
  updated_at: number;
}

export interface PredictServerClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export class PredictServerClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: PredictServerClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? PREDICT_SERVER_URL).replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async getStatus(): Promise<PredictServerStatus> {
    return this.getJson("/status");
  }

  async getOracles(predictId: string): Promise<OracleRecord[]> {
    return this.getJson(`/predicts/${predictId}/oracles`);
  }

  async getOracleState(oracleId: string): Promise<{ oracle: OracleRecord }> {
    return this.getJson(`/oracles/${oracleId}/state`);
  }

  async getMintedPositions(params: {
    oracleId?: string;
    managerId?: string;
    limit?: number;
  } = {}): Promise<PositionMinted[]> {
    return this.getJson("/positions/minted", params);
  }

  async getRedeemedPositions(params: {
    oracleId?: string;
    managerId?: string;
    limit?: number;
  } = {}): Promise<PositionRedeemed[]> {
    return this.getJson("/positions/redeemed", params);
  }

  async getManagerPositionsSummary(managerId: string): Promise<ManagerPositionSummary[]> {
    return this.getJson(`/managers/${managerId}/positions/summary`);
  }

  async getOraclePrices(oracleId: string, limit = 1): Promise<OraclePriceRecord[]> {
    return this.getJson(`/oracles/${oracleId}/prices`, { limit });
  }

  async getOracleSviLatest(oracleId: string): Promise<OracleSviRecord> {
    return this.getJson(`/oracles/${oracleId}/svi/latest`);
  }

  private async getJson<T>(
    path: string,
    params: Record<string, string | number | undefined> = {},
  ): Promise<T> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      const paramKey =
        key === "oracleId"
          ? "oracle_id"
          : key === "managerId"
            ? "manager_id"
            : key;
      query.set(paramKey, String(value));
    }

    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    const res = await this.fetchImpl(`${this.baseUrl}${path}${suffix}`);
    if (!res.ok) {
      throw new Error(`predict-server ${path} -> ${res.status}`);
    }
    return (await res.json()) as T;
  }
}

export function createPredictServerClient(
  options?: PredictServerClientOptions,
): PredictServerClient {
  return new PredictServerClient(options);
}
