export type PolicyStatus = "ACTIVE" | "EXPIRED_NO_CLAIM" | "PAID";

export interface OracleRef {
  oracleId: string;
  predictId: string;
  expiryMs: number;
  minStrike: number;
  tickSize: number;
}

export interface SviParams {
  oracleId: string;
  updatedAtMs: number;
  a: number;
  b: number;
  rho: number;
  m: number;
  sigma: number;
}

export interface Quote {
  oracleId: string;
  expiryMs: number;
  spot: number;
  strike: number;
  btcHeld: number;
  coverage: number;
  fairPrice: number;
  spread: number;
  ask: number;
  premium: number;
  effectiveRate: number;
  floorBinds: boolean;
  createdAtMs: number;
}

export interface Policy {
  id: string;
  managerId: string;
  oracleId: string;
  expiryMs: number;
  strike: number;
  coverage: number;
  premium: number;
  status: PolicyStatus;
  createdAtMs: number;
}
