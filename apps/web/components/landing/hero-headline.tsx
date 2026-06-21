const LINES = [
  { text: "When the market drops", accent: false },
  { text: "you're covered.", accent: true },
] as const;

export function HeroHeadline() {
  return (
    <h1 className="landing-sui-type-h1 text-center font-display font-normal text-balance">
      {LINES.map((line) => (
        <span
          key={line.text}
          className={`block ${line.accent ? "text-sui-blue" : "text-content-primary"}`}
        >
          {line.text}
        </span>
      ))}
    </h1>
  );
}
