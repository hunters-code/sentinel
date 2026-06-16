import {
  DUSDC_TYPE,
  PREDICT_OBJECT_ID,
  PREDICT_PACKAGE_ID,
  PREDICT_SERVER_URL,
} from "@sentinel/shared";

export const config = {
  network: process.env.SUI_NETWORK ?? "testnet",
  rpcUrl: process.env.SUI_RPC_URL ?? "https://fullnode.testnet.sui.io:443",
  predictPackageId: process.env.PREDICT_PACKAGE_ID ?? PREDICT_PACKAGE_ID,
  predictObjectId: process.env.PREDICT_OBJECT_ID ?? PREDICT_OBJECT_ID,
  dusdcType: process.env.DUSDC_TYPE ?? DUSDC_TYPE,
  predictServerUrl: process.env.PREDICT_SERVER_URL ?? PREDICT_SERVER_URL,
  keeperPrivateKey: process.env.KEEPER_PRIVATE_KEY ?? "",
  pollIntervalMs: Number(process.env.KEEPER_POLL_INTERVAL_MS ?? 5000),
  eventPollLimit: Number(process.env.KEEPER_EVENT_POLL_LIMIT ?? 50),
  bootstrapSettlements: Number(process.env.KEEPER_BOOTSTRAP_SETTLEMENTS ?? 100),
  apiPort: Number(process.env.KEEPER_API_PORT ?? 8787),
};
