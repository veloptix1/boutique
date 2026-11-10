import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: "#0d5c4a", dark: "#083d31", light: "#1a7a63" },
        // "deep" : or foncé lisible comme texte sur fond crème (contraste AA)
        gold: { DEFAULT: "#d4af37", light: "#e8c96a", deep: "#7a5f0c" },
        cream: "#faf6ef",
        terracotta: { DEFAULT: "#c1502e", deep: "#a63d1f" },
        indigo: "#2c3e70",
        ink: "#1d2926",
        muted: "#5b6a65",
        line: "rgba(8, 61, 49, 0.12)",
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
