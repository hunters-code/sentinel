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
        background: "var(--background)",
        "secondary-background": "var(--secondary-background)",
        foreground: "var(--foreground)",
        "main-foreground": "var(--main-foreground)",
        main: "var(--main)",
        border: "var(--border)",
        ring: "var(--ring)",
        violet: {
          100: "#A5B4FB",
          200: "#A8A6FF",
          300: "#918efa",
          400: "#807dfa",
        },
        pink: {
          200: "#FFA6F6",
          300: "#fa8cef",
          400: "#fa7fee",
        },
        red: {
          200: "#FF9F9F",
          300: "#fa7a7a",
          400: "#f76363",
        },
        orange: {
          200: "#FFC29F",
          300: "#FF965B",
          400: "#fa8543",
        },
        yellow: {
          200: "#FFF59F",
          300: "#FFF066",
          400: "#FFE500",
        },
        lime: {
          100: "#c6fab4",
          200: "#B8FF9F",
          300: "#9dfc7c",
          400: "#7df752",
        },
        cyan: {
          200: "#A6FAFF",
          300: "#79F7FF",
          400: "#53f2fc",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        surface: {
          lime: "var(--surface-lime)",
          yellow: "var(--surface-yellow)",
          cyan: "var(--surface-cyan)",
          pink: "var(--surface-pink)",
        },
      },
      fontFamily: {
        base: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontWeight: {
        base: "var(--base-font-weight)",
        heading: "var(--heading-font-weight)",
      },
      borderRadius: {
        base: "var(--border-radius)",
      },
      boxShadow: {
        shadow: "var(--shadow)",
        nav: "4px 4px 0px rgba(0,0,0,1)",
        brutal: "4px 4px 0px rgba(0,0,0,1)",
        "brutal-hover": "8px 8px 0px rgba(0,0,0,1)",
        "brutal-btn": "2px 2px 0px rgba(0,0,0,1)",
      },
      spacing: {
        boxShadowX: "var(--box-shadow-x)",
        boxShadowY: "var(--box-shadow-y)",
        reverseBoxShadowX: "var(--reverse-box-shadow-x)",
        reverseBoxShadowY: "var(--reverse-box-shadow-y)",
      },
      maxWidth: {
        container: "1140px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
      },
    },
  },
  plugins: [],
};
