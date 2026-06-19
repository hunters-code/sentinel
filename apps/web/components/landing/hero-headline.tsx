const LINES = [
  { text: "Protect your", accent: false },
  { text: "crypto before", accent: false },
  { text: "the next drop.", accent: true },
] as const;

/**
 * Hero headline. The entrance is pure CSS (see `.hero-line` /
 * `@keyframes sentinel-rise` in globals.css) so the text is fully visible even
 * if JavaScript never hydrates — the animation only runs as an enhancement.
 */
export function HeroHeadline() {
  return (
    <h1
      className="text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {LINES.map((line, i) => (
        <span
          key={line.text}
          className="hero-line"
          style={{
            animationDelay: `${0.05 + i * 0.09}s`,
            color: line.accent ? "var(--sui-blue-bright)" : undefined,
          }}
        >
          {line.text}
        </span>
      ))}
    </h1>
  );
}
