import type { Theme } from "@mysten/dapp-kit";

/** dapp-kit theme aligned with Sentinel / Sui landing tokens */
export const sentinelDappKitTheme: Theme = {
  blurs: {
    modalOverlay: "blur(8px)",
  },
  backgroundColors: {
    primaryButton: "#298dff",
    primaryButtonHover: "#5ca9ff",
    outlineButtonHover: "rgba(255, 255, 255, 0.08)",
    modalOverlay: "rgba(0, 0, 0, 0.72)",
    modalPrimary: "#0a0a0a",
    modalSecondary: "#002e6a",
    iconButton: "rgba(255, 255, 255, 0.08)",
    iconButtonHover: "rgba(255, 255, 255, 0.14)",
    dropdownMenu: "#111111",
    dropdownMenuSeparator: "rgba(255, 255, 255, 0.12)",
    walletItemSelected: "rgba(41, 141, 255, 0.18)",
    walletItemHover: "rgba(255, 255, 255, 0.06)",
  },
  borderColors: {
    outlineButton: "rgba(255, 255, 255, 0.12)",
  },
  colors: {
    primaryButton: "#000000",
    outlineButton: "#ffffff",
    iconButton: "#ffffff",
    body: "#ffffff",
    bodyMuted: "#89919f",
    bodyDanger: "#fa8543",
  },
  radii: {
    small: "6px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
  },
  shadows: {
    primaryButton: "none",
    walletItemSelected: "none",
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    bold: "600",
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px",
    xlarge: "20px",
  },
  typography: {
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
    fontStyle: "normal",
    lineHeight: "1.5",
    letterSpacing: "0",
  },
};
