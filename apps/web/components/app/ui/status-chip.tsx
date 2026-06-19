type ChipTone = "active" | "paid" | "expired" | "neutral" | "live" | "offline";

const toneStyles: Record<ChipTone, { color: string; border: string }> = {
  active: { color: "var(--sui-blue-bright)", border: "rgba(92, 169, 255, 0.35)" },
  paid: { color: "#7df752", border: "rgba(125, 247, 82, 0.35)" },
  expired: { color: "var(--sui-steel)", border: "var(--sui-line)" },
  neutral: { color: "var(--sui-steel)", border: "var(--sui-line)" },
  live: { color: "#7df752", border: "rgba(125, 247, 82, 0.35)" },
  offline: { color: "var(--sui-steel-dark)", border: "var(--sui-line)" },
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
