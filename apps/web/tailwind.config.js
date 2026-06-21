const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "landing-h1": ["clamp(2.5rem, 6vw, 3.375rem)", { lineHeight: "0.96", letterSpacing: "-0.037em" }],
        "landing-h2": ["clamp(1.5rem, 3.5vw, 1.6875rem)", { lineHeight: "1.037", letterSpacing: "-0.022em" }],
        "landing-lead": ["clamp(1rem, 1.6vw, 1.25rem)", { lineHeight: "1.45", letterSpacing: "-0.02em" }],
        "landing-body": ["0.9375rem", { lineHeight: "1.45", letterSpacing: "-0.011em" }],
        "landing-label": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.04em" }],
      },
      backgroundImage: {
        "landing-hero-vignette":
          "radial-gradient(ellipse 85% 60% at 50% 42%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.06) 40%, rgba(0, 0, 0, 0) 64%, rgba(0, 0, 0, 0.14) 100%)",
        "landing-hero-mesh-base":
          "radial-gradient(ellipse 120% 88% at 50% 108%, #042848 0%, #001428 36%, #000000 72%)",
        "landing-hero-mesh-tint":
          "linear-gradient(165deg, rgba(0, 0, 0, 0.35) 0%, transparent 38%, rgba(0, 20, 40, 0.45) 100%)",
        "landing-hero-copy-scrim":
          "radial-gradient(ellipse 92% 78% at 50% 46%, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.32) 38%, transparent 72%)",
        "landing-sui-hero-overlay":
          "radial-gradient(ellipse 85% 55% at 50% 38%, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.55) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.04) 42%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 0.28) 100%)",
        "landing-sui-panel-overlay":
          "linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.82) 52%, rgba(0, 0, 0, 0.94) 100%), radial-gradient(ellipse 90% 80% at 100% 0%, rgba(41, 141, 255, 0.12) 0%, transparent 55%)",
        "landing-sui-section-overlay":
          "linear-gradient(180deg, rgba(0, 46, 106, 0.78) 0%, rgba(0, 17, 42, 0.88) 100%), radial-gradient(ellipse 70% 50% at 50% 0%, rgba(41, 141, 255, 0.18) 0%, transparent 62%)",
      },
      colors: {
        sui: {
          blue: "#298dff",
          "blue-bright": "var(--sui-blue-bright, #5ca9ff)",
          "blue-light": "#ddf2ff",
          "blue-dark": "#1759c4",
          "blue-darker": "#002e6a",
          root: "var(--sui-root, #041e3a)",
          black: "var(--sui-black, #000000)",
          steel: "var(--sui-steel, #89919f)",
          "steel-dark": "var(--sui-steel-dark, #6c7584)",
          white: "var(--sui-white, #ffffff)",
          line: "var(--sui-line, rgba(255, 255, 255, 0.12))",
          separator: "rgba(255, 255, 255, 0.22)",
          navy: "#001428",
          "mesh-navy": "#042848",
        },
        content: {
          primary: "var(--color-content-primary)",
          secondary: "var(--color-content-secondary)",
          tertiary: "var(--color-content-tertiary)",
          positive: "var(--color-content-positive)",
          warning: "var(--color-content-warning)",
          negative: "var(--color-content-negative)",
          "persistent-white": "var(--color-content-persistent-white)",
          "persistent-black": "var(--color-content-persistent-black)",
        },
        bg: {
          primary: "var(--color-background-primary)",
          accent: "var(--color-background-accent)",
          "secondary-selected": "var(--color-background-secondary-selected)",
        },
        action: {
          primary: "var(--color-action-primary)",
          "secondary-selected": "var(--color-action-secondary-selected)",
        },
        page: {
          fill: "var(--color-page-fill)",
          "tab-bar": "var(--color-page-tab-bar)",
        },
        card: {
          fill: "var(--color-card-fill)",
          border: "var(--color-card-border)",
          accent: "var(--color-card-accent)",
        },
        separator: "var(--color-separator)",
        "border-neutral": "var(--color-border-neutral)",
        signal: {
          lime: "#7df752",
          orange: "#fa8543",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        "sui-inter": ["var(--font-sui-inter)", "Inter", "system-ui", "sans-serif"],
        "sui-mono": ["var(--font-sui-mono)", "DM Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1140px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "sentinel-rise": {
          from: { opacity: "1", transform: "translateY(1.25rem)", filter: "blur(8px)" },
          to: { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "hero-mesh-a": {
          from: { transform: "translate(0, 0) scale(1)" },
          to: { transform: "translate(10%, 8%) scale(1.1)" },
        },
        "hero-mesh-b": {
          from: { transform: "translate(0, 0) scale(1)" },
          to: { transform: "translate(-12%, 14%) scale(1.08)" },
        },
        "hero-mesh-c": {
          from: { transform: "translate(0, 0) scale(1)" },
          to: { transform: "translate(8%, -10%) scale(1.12)" },
        },
        "hero-mesh-d": {
          from: { transform: "translate(0, 0) scale(1)" },
          to: { transform: "translate(-8%, -12%) scale(1.06)" },
        },
        "hero-mesh-e": {
          from: { transform: "translate(0, 0) scale(1)" },
          to: { transform: "translate(-6%, 6%) scale(1.15)" },
        },
        "settlement-bar": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(280%)" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        "landing-gradient-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(-1.25%, -1%, 0)" },
        },
        "landing-coin-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-22px)" },
        },
        "landing-coin-float-center": {
          "0%, 100%": { transform: "translate(-50%, 0)" },
          "50%": { transform: "translate(-50%, -22px)" },
        },
        "landing-shimmer-line": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        "sentinel-rise": "sentinel-rise 760ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-mesh-a": "hero-mesh-a 24s ease-in-out infinite alternate",
        "hero-mesh-b": "hero-mesh-b 28s ease-in-out infinite alternate",
        "hero-mesh-c": "hero-mesh-c 32s ease-in-out infinite alternate",
        "hero-mesh-d": "hero-mesh-d 26s ease-in-out infinite alternate",
        "hero-mesh-e": "hero-mesh-e 20s ease-in-out infinite alternate",
        "settlement-bar": "settlement-bar 1.4s ease-in-out infinite",
        "skeleton-pulse": "skeleton-pulse 1.6s ease-in-out infinite",
        "landing-gradient-drift": "landing-gradient-drift 26s ease-in-out infinite",
        "landing-coin-float": "landing-coin-float 4.4s ease-in-out infinite",
        "landing-coin-float-sui": "landing-coin-float 5.2s ease-in-out 0.55s infinite",
        "landing-coin-float-usdc": "landing-coin-float 4.8s ease-in-out 1.05s infinite",
        "landing-coin-float-center": "landing-coin-float-center 4.6s ease-in-out 0.25s infinite",
        "landing-shimmer-line": "landing-shimmer-line 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        ".landing-sui": {
          "--font-display": "var(--font-sui-inter), Inter, system-ui, sans-serif",
          "--font-body": "var(--font-sui-inter), Inter, system-ui, sans-serif",
          "--font-mono": 'var(--font-sui-mono), "DM Mono", ui-monospace, monospace',
          "--color-content-primary": "#ffffff",
          "--color-content-secondary": "#89919f",
          "--color-content-tertiary": "#6c7584",
          "--color-background-accent": "#298dff",
          "--color-background-secondary-selected": "#5ca9ff",
          "--color-chrome-border": "rgba(255, 255, 255, 0.08)",
          "--color-border-neutral": "rgba(255, 255, 255, 0.12)",
          "--sui-blue": "#298dff",
          "--sui-blue-bright": "#5ca9ff",
          "--sui-steel": "#89919f",
          "--sui-steel-dark": "#6c7584",
          "--sui-line": "rgba(255, 255, 255, 0.12)",
        },
      });
    }),
  ],
};
