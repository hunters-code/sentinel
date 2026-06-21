import { cn } from "@/lib/cn";

type ChipTone = "active" | "paid" | "expired" | "neutral" | "live" | "offline";

const toneClasses: Record<ChipTone, string> = {
  active: "text-bg-accent border-border-neutral",
  paid: "text-bg-secondary-selected border-[rgba(77,162,255,0.35)]",
  expired: "text-content-secondary border-border-neutral",
  neutral: "text-content-secondary border-border-neutral",
  live: "text-bg-secondary-selected border-[rgba(77,162,255,0.35)]",
  offline: "text-content-tertiary border-border-neutral",
};

export function StatusChip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: ChipTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
