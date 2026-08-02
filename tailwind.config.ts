import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/config/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Deep northern navy — the primary brand color (scientific, trustworthy).
        ink: {
          50: "#eef4fb",
          100: "#d7e6f5",
          200: "#b3cdea",
          300: "#83abda",
          400: "#4f83c6",
          500: "#2f63af",
          600: "#224d93",
          700: "#1d3f77",
          800: "#1b3763",
          900: "#0f2749",
          950: "#0a1b34",
        },
        // Frost — the bright teal/cyan accent used for CTAs and highlights.
        frost: {
          50: "#ecfeff",
          100: "#cff9fb",
          200: "#a4f1f6",
          300: "#67e3ee",
          400: "#22ccdd",
          500: "#08adc3",
          600: "#0a8ba4",
          700: "#106f85",
          800: "#165a6d",
          900: "#164b5c",
          950: "#08313f",
        },
        // Aurora — a subtle green used sparingly for "verified / in-stock" states.
        aurora: {
          50: "#effef4",
          100: "#d9ffe6",
          200: "#b5fccf",
          300: "#7cf7ab",
          400: "#3ce87f",
          500: "#13cf5f",
          600: "#08aa4b",
          700: "#0a853e",
          800: "#0d6934",
          900: "#0c562d",
          950: "#003017",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(10 27 52 / 0.04), 0 8px 24px -12px rgb(10 27 52 / 0.12)",
        "card-hover": "0 2px 4px 0 rgb(10 27 52 / 0.06), 0 16px 40px -16px rgb(10 27 52 / 0.22)",
        header: "0 1px 0 0 rgb(15 39 99 / 0.06), 0 12px 32px -24px rgb(10 27 52 / 0.4)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-down": "slide-down 0.18s ease-out",
      },
    },
  },
  plugins: [forms({ strategy: "class" }), typography],
};

export default config;
