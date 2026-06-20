"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

/** Scans wallet for a coin type containing "btc". */
export function useWalletBtc() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const address = account?.address;

  const query = useQuery({
    queryKey: ["wallet-btc", address],
    enabled: Boolean(address),
    staleTime: 30_000,
    queryFn: async () => {
      const balances = await client.getAllBalances({ owner: address! });
      const btcCoin = balances.find((b) => b.coinType.toLowerCase().includes("btc"));

      if (!btcCoin || btcCoin.totalBalance === "0") {
        return { amount: 0, fromWallet: false as const };
      }

      const meta = await client.getCoinMetadata({ coinType: btcCoin.coinType });
      const decimals = meta?.decimals ?? 8;
      const amount = Number(btcCoin.totalBalance) / 10 ** decimals;

      return { amount, fromWallet: true as const };
    },
  });

  return {
    btc: query.data?.amount ?? null,
    fromWallet: query.data?.fromWallet ?? false,
    loading: query.isLoading,
    error: query.isError,
  };
}
