type ChipTone = "active" | "paid" | "expired" | "neutral" | "live" | "offline";

const toneStyles: Record<ChipTone, { color: string; border: string }> = {
  active: { color: "var(--color-background-accent, var(--sui-blue-bright))", border: "var(--color-border-neutral)" },
  paid: { color: "var(--color-content-positive, #7df752)", border: "var(--color-border-positive-weak)" },
  expired: { color: "var(--color-content-secondary, var(--sui-steel))", border: "var(--sui-line)" },
  neutral: { color: "var(--color-content-secondary, var(--sui-steel))", border: "var(--sui-line)" },
  live: { color: "var(--color-content-positive, #7df752)", border: "var(--color-border-positive-weak)" },
  offline: { color: "var(--color-content-tertiary, var(--sui-steel-dark))", border: "var(--sui-line)" },
};

export function StatusChip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: ChipTone;
}) {
  const colors = toneStyles[tone];

  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
      style={{ color: colors.color, borderColor: colors.border }}
    >
      {children}
    </span>
  );
}
