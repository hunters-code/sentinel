export interface SettledPosition {
  managerId: string;
  oracleId: string;
  strike: number;
}

export async function findSettledPositions(): Promise<SettledPosition[]> {
  return [];
}

export async function redeemSettled(position: SettledPosition): Promise<void> {
  console.log(`[keeper] redeem stub for manager ${position.managerId}`);
}
