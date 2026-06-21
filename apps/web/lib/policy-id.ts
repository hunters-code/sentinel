import { usdToOraclePrice } from "@sentinel/shared";

export function buildPolicyReceiptId(oracleId: string, strikeUsd: number): string {
  return `${oracleId}:${usdToOraclePrice(strikeUsd)}`;
}

export function parsePolicyReceiptId(id: string): { oracleId: string; strikeRaw: number } | null {
  const splitAt = id.lastIndexOf(":");
  if (splitAt <= 0) return null;
  const strikeRaw = Number(id.slice(splitAt + 1));
  if (!Number.isFinite(strikeRaw)) return null;
  return { oracleId: id.slice(0, splitAt), strikeRaw };
}

export function shortPolicyRef(id: string): string {
  if (id.length <= 16) return id;
  return `${id.slice(0, 8)}…${id.slice(-6)}`;
}
