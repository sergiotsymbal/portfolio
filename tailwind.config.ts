import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#FFF0B3",
          DEFAULT: "#E5C158",
          dark: "#B8860B",
          amber: "#D4AF37",
          copper: "#C58F3A",
        },
        gaudi: {
          dark: "#0B0A0D",
          card: "#141218",
          elevated: "#1C1924",
          border: "#3A3225",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
        // Literal family name (not the next/font var) so Cyrillic falls back to an unscaled system serif, as in the original.
        cinzel: ["Cinzel", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
