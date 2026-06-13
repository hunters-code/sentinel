import { config } from "./config.js";
import { findSettledPositions, redeemSettled } from "./redeem.js";

async function tick(): Promise<void> {
  const settled = await findSettledPositions();
  for (const position of settled) {
    await redeemSettled(position);
  }
}

async function main(): Promise<void> {
  console.log(`[keeper] starting on ${config.network}`);
  console.log(`[keeper] predict package ${config.predictPackageId}`);

  for (;;) {
    try {
      await tick();
    } catch (err) {
      console.error("[keeper] tick failed", err);
    }
    await new Promise((resolve) => setTimeout(resolve, config.pollIntervalMs));
  }
}

main().catch((err) => {
  console.error("[keeper] fatal", err);
  process.exit(1);
});
