import { TEST_BTC_TYPE, TEST_ETH_TYPE, TEST_SUI_TYPE } from "@sentinel/shared";

export type AssetId = "btc" | "eth" | "sui";

export type Asset = {
  id: AssetId;
  /** Ticker shown in the UI, e.g. "BTC" */
  symbol: string;
  /** Full name, e.g. "Bitcoin" */
  name: string;
  /** Brand tint for the asset mark */
  tint: string;
  /** On-chain coin type of the (testnet) asset the user holds */
  coinType: string;
  /**
   * True when the asset can be quoted and covered. All three share the BTC
   * settlement oracle on testnet today; flip to `false` to park an asset in the
   * "coming soon" state until it gets its own oracle.
   */
  live: boolean;
};

export const ASSETS: Asset[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", tint: "#f7931a", coinType: TEST_BTC_TYPE, live: true },
  { id: "eth", symbol: "ETH", name: "Ethereum", tint: "#627eea", coinType: TEST_ETH_TYPE, live: false },
  { id: "sui", symbol: "SUI", name: "Sui", tint: "#4da2ff", coinType: TEST_SUI_TYPE, live: false },
];

export const DEFAULT_ASSET = ASSETS[0]!;

export function getAsset(id: AssetId): Asset {
  return ASSETS.find((a) => a.id === id) ?? DEFAULT_ASSET;
}
