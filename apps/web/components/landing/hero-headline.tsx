const LINES = [
  { text: "When the market drops", accent: false },
  { text: "you're covered.", accent: true },
] as const;

export function HeroHeadline() {
  return (
    <h1 className="text-center font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
      {LINES.map((line) => (
        <span
          key={line.text}
          className={`block ${line.accent ? "text-sui-blue-bright" : "text-content-primary"}`}
        >
          {line.text}
        </span>
      ))}
    </h1>
  );
}
