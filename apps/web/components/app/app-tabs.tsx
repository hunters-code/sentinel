"use client";

export type AppNavId = "home" | "cover" | "history" | "wallet";

/** Tabs with dedicated panel content */
export type AppTab = "cover" | "history" | "wallet";

export const APP_NAV_IDS: AppNavId[] = ["home", "cover", "history", "wallet"];

export function isAppNavId(value: string | null): value is AppNavId {
  return value != null && (APP_NAV_IDS as string[]).includes(value);
}
