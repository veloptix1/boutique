import type { Config } from "tailwindcss";

const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: v("emerald"), dark: "#083d31", light: "#1a7a63" },
        // "deep" : or foncé lisible comme texte sur fond crème (contraste AA)
        gold: { DEFAULT: "#d4af37", light: "#e8c96a", deep: v("gold-deep") },
        cream: v("cream"),
        surface: v("surface"),
        heading: v("heading"),
        link: v("link"),
        terracotta: { DEFAULT: "#c1502e", deep: "#a63d1f" },
        indigo: "#2c3e70",
        ink: v("ink"),
        muted: v("muted"),
        line: "rgb(var(--line) / 0.14)",
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "Amiri", "serif"],
        poppins: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "12px", "2xl": "16px" },
    },
  },
  plugins: [],
};
export default config;
