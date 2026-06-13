import { config } from "./config.js";
import { OracleSettledWatcher } from "./events.js";
import { healthCheck, redeemOracleSettlement } from "./redeem.js";
import { loadKeeperKeypair } from "./ptb.js";
import { suiClient } from "./sui.js";

async function tick(watcher: OracleSettledWatcher): Promise<void> {
  const settlements = await watcher.poll();
  if (settlements.length === 0) return;

  const keypair = loadKeeperKeypair();
  for (const settlement of settlements) {
    console.log(
      `[keeper] OracleSettled ${settlement.oracleId} @ ${settlement.settlementPrice}`,
    );
    await redeemOracleSettlement(
      suiClient,
      keypair,
      settlement.oracleId,
      settlement.settlementPrice,
    );
  }
}

async function main(): Promise<void> {
  console.log(`[keeper] starting on ${config.network}`);
  console.log(`[keeper] predict package ${config.predictPackageId}`);
  console.log(`[keeper] poll interval ${config.pollIntervalMs}ms`);

  const keypair = loadKeeperKeypair();
  if (!keypair) {
    console.warn("[keeper] KEEPER_PRIVATE_KEY not set — running in dry-run mode");
  } else {
    console.log(`[keeper] executor ${keypair.toSuiAddress()}`);
  }

  await healthCheck();

  const watcher = new OracleSettledWatcher(suiClient);
  const bootstrap = await watcher.bootstrap(config.bootstrapSettlements);
  console.log(`[keeper] bootstrapped ${bootstrap.length} recent settlement(s)`);

  for (const settlement of bootstrap) {
    await redeemOracleSettlement(
      suiClient,
      keypair,
      settlement.oracleId,
      settlement.settlementPrice,
    );
  }

  for (;;) {
    try {
      await tick(watcher);
      await healthCheck();
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
