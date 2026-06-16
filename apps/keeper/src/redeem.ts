import type { SuiClient } from "@mysten/sui/client";
import type { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { config } from "./config.js";
import { findClaimablePositions, groupByManager } from "./positions.js";
import { buildRedeemPtb } from "./ptb.js";

export async function redeemOracleSettlement(
  client: SuiClient,
  keypair: Ed25519Keypair | null,
  oracleId: string,
  settlementPrice: number,
): Promise<number> {
  const claimable = await findClaimablePositions(oracleId, settlementPrice);
  if (claimable.length === 0) {
    console.log(`[keeper] oracle ${oracleId} — no claimable DOWN positions`);
    return 0;
  }

  const groups = await groupByManager(claimable);
  console.log(
    `[keeper] oracle ${oracleId} — ${claimable.length} claimable position(s) across ${groups.size} manager(s)`,
  );

  let claimed = 0;
  for (const [managerId, positions] of groups) {
    claimed += await redeemManagerPositions(client, keypair, managerId, positions);
  }
  return claimed;
}

async function redeemManagerPositions(
  client: SuiClient,
  keypair: Ed25519Keypair | null,
  managerId: string,
  positions: Awaited<ReturnType<typeof findClaimablePositions>>,
): Promise<number> {
  const tx = buildRedeemPtb(positions);

  if (!keypair) {
    console.log(
      `[keeper] dry-run: would redeem ${positions.length} position(s) for manager ${managerId}`,
    );
    return 0;
  }

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showEffects: true },
  });

  const status = result.effects?.status.status;
  if (status === "success") {
    console.log(
      `[keeper] redeemed ${positions.length} position(s) for manager ${managerId} — digest ${result.digest}`,
    );
    return positions.length;
  }

  const error = result.effects?.status.error ?? "unknown error";
  console.error(
    `[keeper] redeem failed for manager ${managerId} — ${error} (digest ${result.digest})`,
  );
  return 0;
}

export async function healthCheck(): Promise<void> {
  const res = await fetch(`${config.predictServerUrl}/status`);
  if (!res.ok) {
    throw new Error(`predict-server unhealthy: ${res.status}`);
  }
}
