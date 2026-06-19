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
    "Protect your crypto before the next drop. Cover BTC, ETH, or SUI with one honest price, one tap, paid automatically if the price crashes. Built on DeepBook Predict · Sui.",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geologica.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
