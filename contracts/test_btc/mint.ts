#!/usr/bin/env tsx
/**
 * Mint tBTC to any address on Sui testnet.
 *
 * Usage:
 *   pnpm tsx contracts/test_btc/mint.ts [amount_btc] [recipient]
 *
 * Defaults: 1 BTC to the active sui client address.
 * Max per call: 10 BTC.
 *
 * Requires: MNEMONIC or SUI_PRIVATE_KEY env var, OR uses the active `sui client` keystore.
 */

import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { execSync } from "child_process";
import deployed from "./deployed.json";

const DECIMALS = deployed.decimals; // 8
const MAX_AMOUNT = BigInt(deployed.maxMintPerCall);

async function main() {
  const amountBtc = parseFloat(process.argv[2] ?? "1");
  if (isNaN(amountBtc) || amountBtc <= 0 || amountBtc > 10) {
    console.error("amount must be between 0 and 10 BTC");
    process.exit(1);
  }
  const amountRaw = BigInt(Math.round(amountBtc * 10 ** DECIMALS));
  if (amountRaw > MAX_AMOUNT) {
    console.error(`max per call is 10 BTC (${MAX_AMOUNT} raw units)`);
    process.exit(1);
  }

  // Resolve recipient
  let recipient = process.argv[3];
  if (!recipient) {
    recipient = execSync("sui client active-address", { encoding: "utf8" }).trim();
  }
  console.log(`Minting ${amountBtc} tBTC → ${recipient}`);

  // Build keypair from env or active keystore
  let keypair: Ed25519Keypair;
  const privKey = process.env.SUI_PRIVATE_KEY;
  const mnemonic = process.env.MNEMONIC;
  if (privKey) {
    const { decodeSuiPrivateKey } = await import("@mysten/sui/cryptography");
    const { secretKey } = decodeSuiPrivateKey(privKey);
    keypair = Ed25519Keypair.fromSecretKey(secretKey);
  } else if (mnemonic) {
    keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  } else {
    console.error(
      "Set SUI_PRIVATE_KEY (suiprivkey…) or MNEMONIC, or use `sui client call` directly.\n" +
      "Example with sui CLI:\n" +
      `  sui client call --package ${deployed.packageId} --module test_btc --function mint ` +
      `--args ${deployed.mintCapId} ${amountRaw} <RECIPIENT_ADDRESS> --gas-budget 10000000`,
    );
    process.exit(1);
  }

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const tx = new Transaction();
  tx.moveCall({
    target: `${deployed.packageId}::test_btc::mint`,
    arguments: [
      tx.object(deployed.mintCapId),
      tx.pure.u64(amountRaw),
      tx.pure.address(recipient),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: { showEffects: true },
  });

  if (result.effects?.status.status !== "success") {
    console.error("Transaction failed:", result.effects?.status);
    process.exit(1);
  }

  console.log(`✓ Minted ${amountBtc} tBTC`);
  console.log(`  Digest: ${result.digest}`);
  console.log(`  Explorer: https://testnet.suivision.xyz/txblock/${result.digest}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
