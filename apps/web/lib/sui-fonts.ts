import localFont from "next/font/local";

/** Sui Typography Alternates — Inter when TWK Everett is unavailable (media kit). */
export const suiInter = localFont({
  src: [
    {
      path: "../assets/fonts/sui/inter-var-latin.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/sui/inter-italic-var-latin.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sui-inter",
  display: "swap",
});

/** Sui Typography Alternates — DM Mono for tags and supporting labels. */
export const suiDmMono = localFont({
  src: [
    {
      path: "../assets/fonts/sui/dm-mono-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/sui/dm-mono-medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sui-mono",
  display: "swap",
});
