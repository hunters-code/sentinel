import {
  BASE_SPREAD,
  DEFAULT_TRIGGER_PCT,
  MIN_SPREAD,
  PROTOCOL_MIN_ASK_CENTS,
} from "./constants";

export function floorToTick(value: number, minStrike: number, tick: number): number {
  const steps = Math.floor((value - minStrike) / tick);
  return minStrike + steps * tick;
}

export function triggerStrike(
  spot: number,
  minStrike: number,
  tick: number,
  triggerPct: number = DEFAULT_TRIGGER_PCT,
): number {
  return floorToTick(spot * (1 - triggerPct), minStrike, tick);
}

export function coverage(btcHeld: number, spot: number, strike: number): number {
  return btcHeld * (spot - strike);
}

export function spread(fairPrice: number, utilizationTerm = 1): number {
  const variance = Math.sqrt(fairPrice * (1 - fairPrice));
  return Math.max(MIN_SPREAD, BASE_SPREAD * variance * utilizationTerm);
}

export function applyAskFloor(ask: number): { ask: number; floorBinds: boolean } {
  const floor = PROTOCOL_MIN_ASK_CENTS / 100;
  if (ask < floor) {
    return { ask: floor, floorBinds: true };
  }
  return { ask, floorBinds: false };
}

export function premium(ask: number, coverageAmount: number): number {
  return ask * coverageAmount;
}

export function effectiveRate(premiumAmount: number, coverageAmount: number): number {
  if (coverageAmount === 0) return 0;
  return premiumAmount / coverageAmount;
}
