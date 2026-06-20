const LINES = [
  { text: "When the market drops", accent: false },
  { text: "you're covered.", accent: true },
] as const;

export function HeroHeadline() {
  return (
    <h1
      className="text-center font-[var(--font-display)] text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.03em]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {LINES.map((line, i) => (
        <span
          key={line.text}
          className="block animate-[sentinel-rise_760ms_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{
            animationDelay: `${0.12 + i * 0.14}s`,
            color: line.accent ? "var(--sui-blue-bright)" : undefined,
          }}
        >
          {line.text}
        </span>
      ))}
    </h1>
  );
}
