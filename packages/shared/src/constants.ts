export const PREDICT_PACKAGE_ID =
  "0xf5ea2b3749c65d6e56507cc35388719aadb28f9cab873696a2f8687f5c785138";

export const PREDICT_OBJECT_ID =
  "0xc8736204d12f0a7277c86388a68bf8a194b0a14c5538ad13f22cbd8e2a38028a";

export const DUSDC_TYPE =
  "0xe95040085976bfd54a1a07225cd46c8a2b4e8e2b6732f140a0fc49850ba73e1a::dusdc::DUSDC";

export const PREDICT_SERVER_URL =
  "https://predict-server.testnet.mystenlabs.com";

// Testnet-only mock assets for UI testing (price still comes from the BTC oracle)
export const TEST_BTC_PACKAGE_ID =
  "0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85";
export const TEST_BTC_MINT_CAP_ID =
  "0x1ad2fccc19865ffca1d494f9a10fd699fed1d342c6cbb95cae5558e2c8809c89";
export const TEST_BTC_TYPE =
  "0xb9f705396940e54977b3fcac26e44bf8852e93c1c1a11a9c5beb4c4a39939e85::test_btc::TEST_BTC";

export const TEST_ETH_PACKAGE_ID =
  "0x1873fce9ebfa91d0f56ba89378250fa7d748f02e9e2fee8adf0dceb495688b9f";
export const TEST_ETH_MINT_CAP_ID =
  "0x1b0d7b5e66824d157e1303a2fc550f8f391a7df50bcd7b09d161808ef08619c4";
export const TEST_ETH_TYPE =
  "0x1873fce9ebfa91d0f56ba89378250fa7d748f02e9e2fee8adf0dceb495688b9f::test_eth::TEST_ETH";

export const TEST_SUI_PACKAGE_ID =
  "0xeed1d11ec44e284eacb8ce840f3898d0240f3b4cb0c614822446a9edabee496c";
export const TEST_SUI_MINT_CAP_ID =
  "0xd6aa5509b091ff2441bc5a78e372763c3e066e923804ddea8bff71e905eddc3e";
export const TEST_SUI_TYPE =
  "0xeed1d11ec44e284eacb8ce840f3898d0240f3b4cb0c614822446a9edabee496c::test_sui::TEST_SUI";

export const DUSDC_DECIMALS = 6;
export const DUSDC_UNIT = 1_000_000;

export const DEFAULT_TRIGGER_PCT = 0.02;
export const MIN_EXPIRY_LEAD_MS = 15 * 60 * 1000;
export const QUOTE_FRESHNESS_MS = 15 * 1000;
export const MAX_SLIPPAGE_PCT = 0.05;

export const PROTOCOL_MIN_ASK_CENTS = 1;
export const MAX_DEEP_OTM_ASK_CENTS = 10;

export const BASE_SPREAD = 0.02;
export const MIN_SPREAD = 0.005;
