import { SuiClient } from "@mysten/sui/client";
import { config } from "./config.js";

export const suiClient = new SuiClient({ url: config.rpcUrl });

export const SUI_CLOCK_OBJECT_ID = "0x6";

export const ORACLE_SETTLED_EVENT = `${config.predictPackageId}::oracle::OracleSettled`;
