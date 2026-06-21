"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      className={cn(
        "inline-flex min-h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-neutral bg-[var(--color-background-inverse-bleedthrough-weak)] text-content-primary transition-[background-color,color,transform] duration-200 ease-out hover:bg-[var(--color-background-inverse-bleedthrough-medium)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[3px] motion-reduce:transition-none",
        className,
      )}
    >
      {isDark ? (
        <Sun size={17} strokeWidth={2} aria-hidden className="text-content-primary" />
      ) : (
        <Moon size={17} strokeWidth={2} aria-hidden className="text-content-primary" />
      )}
    </button>
  );
}
