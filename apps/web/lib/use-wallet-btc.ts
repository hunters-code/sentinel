"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

const DEMO_FALLBACK: Record<string, number> = {
  btc: 0.5,
  eth: 2,
  sui: 100,
};

function fallbackFor(coinType: string): number {
  const t = coinType.toLowerCase();
  if (t.includes("eth")) return DEMO_FALLBACK.eth!;
  if (t.includes("sui")) return DEMO_FALLBACK.sui!;
  return DEMO_FALLBACK.btc!;
}

/**
 * Reads the connected wallet's balance of a specific (testnet) coin type.
 * Falls back to a sensible demo amount when the wallet holds none, so the
 * quote flow is explorable without first minting test tokens.
 */
export function useWalletAsset(coinType: string) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const address = account?.address;

  const query = useQuery({
    queryKey: ["wallet-asset", address, coinType],
    enabled: Boolean(address),
    staleTime: 30_000,
    queryFn: async () => {
      const balance = await client.getBalance({ owner: address!, coinType });

      if (!balance || balance.totalBalance === "0") {
        return { amount: fallbackFor(coinType), fromWallet: false as const };
      }

      const meta = await client.getCoinMetadata({ coinType });
      const decimals = meta?.decimals ?? 8;
      const amount = Number(balance.totalBalance) / 10 ** decimals;

      return { amount, fromWallet: true as const };
    },
  });

  return {
    amount: query.data?.amount ?? null,
    fromWallet: query.data?.fromWallet ?? false,
    loading: query.isLoading,
    error: query.isError,
  };
}
