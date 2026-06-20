import type { Metadata } from "next";
import { Geologica, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  themeColor: "#082d57",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geologica.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
