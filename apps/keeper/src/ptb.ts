import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import type { ClaimablePosition } from "./positions.js";
import { config } from "./config.js";
import { SUI_CLOCK_OBJECT_ID } from "./sui.js";

export function loadKeeperKeypair(): Ed25519Keypair | null {
  if (!config.keeperPrivateKey) return null;
  const { secretKey } = decodeSuiPrivateKey(config.keeperPrivateKey);
  return Ed25519Keypair.fromSecretKey(secretKey);
}

export function buildRedeemPtb(positions: ClaimablePosition[]): Transaction {
  const tx = new Transaction();

  for (const position of positions) {
    const marketKey = tx.moveCall({
      target: `${config.predictPackageId}::market_key::down`,
      arguments: [
        tx.pure.id(position.oracleId),
        tx.pure.u64(position.expiry),
        tx.pure.u64(position.strike),
      ],
    });

    tx.moveCall({
      target: `${config.predictPackageId}::predict::redeem_permissionless`,
      typeArguments: [config.dusdcType],
      arguments: [
        tx.object(config.predictObjectId),
        tx.object(position.managerId),
        tx.object(position.oracleId),
        marketKey,
        tx.pure.u64(position.quantity),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });
  }

  return tx;
}
