export type AssetId = "btc" | "eth" | "sui";

export type Asset = {
  id: AssetId;
  /** Ticker shown in the UI, e.g. "BTC" */
  symbol: string;
  /** Full name, e.g. "Bitcoin" */
  name: string;
  /** Brand tint for the asset mark */
  tint: string;
  /**
   * True when a live testnet oracle prices this asset. Only `live` assets can
   * be quoted; the others render a "coming soon" state so the UI never offers
   * cover it can't actually sell.
   */
  live: boolean;
};

export const ASSETS: Asset[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", tint: "#f7931a", live: true },
  { id: "eth", symbol: "ETH", name: "Ethereum", tint: "#627eea", live: false },
  { id: "sui", symbol: "SUI", name: "Sui", tint: "#4da2ff", live: false },
];

export const DEFAULT_ASSET = ASSETS[0]!;

export function getAsset(id: AssetId): Asset {
  return ASSETS.find((a) => a.id === id) ?? DEFAULT_ASSET;
}
