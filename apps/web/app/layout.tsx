import type { Metadata } from "next";
import Script from "next/script";
import { Geologica, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme-init-script";
import { suiDmMono, suiInter } from "@/lib/sui-fonts";

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-geologica",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sentinel — Crash insurance for your crypto",
  description:
    "Quote short-term crash cover for your crypto. BTC live on testnet — honest premium, one signature, automatic payout at oracle settlement. Built on DeepBook Predict · Sui.",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${geologica.variable} ${manrope.variable} ${suiInter.variable} ${suiDmMono.variable}`}
    >
      <body suppressHydrationWarning>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Providers>{children}</Providers>
        {/* impeccable-live-start */}
        <Script src="http://localhost:8400/live.js" strategy="afterInteractive" />
        {/* impeccable-live-end */}
      </body>
    </html>
  );
}
