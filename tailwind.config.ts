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
        gold: { DEFAULT: "#d4af37", light: "#e8c96a" },
        cream: "#faf6ef",
        terracotta: "#c1502e",
        indigo: "#2c3e70",
      },
      fontFamily: {
        amiri: ["Amiri", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;