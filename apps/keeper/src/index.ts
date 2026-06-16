import { config } from "./config.js";
import { OracleSettledWatcher } from "./events.js";
import { healthCheck, redeemOracleSettlement } from "./redeem.js";
import { loadKeeperKeypair } from "./ptb.js";
import { startApiServer, type KeeperStats } from "./server.js";
import { suiClient } from "./sui.js";

async function tick(watcher: OracleSettledWatcher, stats: KeeperStats): Promise<void> {
  stats.lastPollAt = Date.now();
  const settlements = await watcher.poll();
  if (settlements.length === 0) return;

  const keypair = loadKeeperKeypair();
  for (const settlement of settlements) {
    console.log(
      `[keeper] OracleSettled ${settlement.oracleId} @ ${settlement.settlementPrice}`,
    );
    const claimed = await redeemOracleSettlement(
      suiClient,
      keypair,
      settlement.oracleId,
      settlement.settlementPrice,
    );
    stats.settlementsProcessed += 1;
    stats.claimsSubmitted += claimed;
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

  const stats: KeeperStats = {
    startedAt: Date.now(),
    executor: keypair?.toSuiAddress() ?? null,
    dryRun: !keypair,
    lastPollAt: null,
    settlementsProcessed: 0,
    claimsSubmitted: 0,
  };

  startApiServer(stats);

  const watcher = new OracleSettledWatcher(suiClient);
  try {
    await healthCheck();
    const bootstrap = await watcher.bootstrap(config.bootstrapSettlements);
    console.log(`[keeper] bootstrapped ${bootstrap.length} recent settlement(s)`);

    for (const settlement of bootstrap) {
      const claimed = await redeemOracleSettlement(
        suiClient,
        keypair,
        settlement.oracleId,
        settlement.settlementPrice,
      );
      stats.settlementsProcessed += 1;
      stats.claimsSubmitted += claimed;
    }
  } catch (err) {
    console.error("[keeper] bootstrap failed — API stays up, will retry", err);
  }

  for (;;) {
    try {
      await tick(watcher, stats);
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
