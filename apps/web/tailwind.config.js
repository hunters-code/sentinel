/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sui: {
          blue: "#298dff",
          "blue-bright": "#5ca9ff",
          "blue-light": "#ddf2ff",
          "blue-dark": "#1759c4",
          "blue-darker": "#002e6a",
          root: "#041e3a",
          black: "#000000",
          steel: "#89919f",
          "steel-dark": "#6c7584",
          white: "#ffffff",
          line: "rgba(255, 255, 255, 0.12)",
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
        display: ["var(--font-geologica)", "system-ui", "sans-serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
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
      },
    },
  },
  plugins: [],
};
