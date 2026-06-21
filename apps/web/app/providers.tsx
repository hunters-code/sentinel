"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { useState } from "react";
import "@mysten/dapp-kit/dist/index.css";
import { sentinelDappKitTheme } from "@/lib/dapp-kit-theme";
import { ThemeProvider } from "@/components/theme-provider";

const networks = {
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect theme={sentinelDappKitTheme}>
          <ThemeProvider>{children}</ThemeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
