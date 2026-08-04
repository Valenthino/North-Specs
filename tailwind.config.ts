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
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        /**
         * `ink` — green-tinted charcoal neutrals. Body copy, borders, and the
         * deep forest surfaces used for the hero, quality band and footer.
         */
        ink: {
          50: "#f6f8f5",
          100: "#eaefe8",
          200: "#d6dfd3",
          300: "#b4c4b0",
          400: "#8aa285",
          500: "#688063",
          600: "#52664e",
          700: "#42523f",
          800: "#374335",
          900: "#2d372c",
          950: "#141f18",
        },
        /**
         * `frost` — the North Specs brand green taken from the vial labels.
         * Drives every primary CTA, link and highlight.
         */
        frost: {
          50: "#eff8f2",
          100: "#d8eee1",
          200: "#b2dcc4",
          300: "#82c29f",
          400: "#51a578",
          500: "#2f8859",
          600: "#216d47",
          700: "#1b573a",
          800: "#194631",
          900: "#163a2a",
          950: "#0a2117",
        },
        /**
         * `bone` — warm cream surfaces and the tan accent used on gauges,
         * markers and editorial panels. Gives the site its premium warmth.
         */
        bone: {
          50: "#fdfcf8",
          100: "#faf5ec",
          200: "#f3ebda",
          300: "#eaddc4",
          400: "#dbc7a6",
          500: "#c9ae85",
          600: "#b3936c",
          700: "#957859",
          800: "#7a634c",
          900: "#655340",
          950: "#372c21",
        },
        /** `aurora` — reserved for verified / in-stock affirmative states. */
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
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(20 31 24 / 0.04), 0 8px 24px -12px rgb(20 31 24 / 0.14)",
        "card-hover": "0 2px 4px 0 rgb(20 31 24 / 0.06), 0 18px 44px -18px rgb(20 31 24 / 0.26)",
        header: "0 1px 0 0 rgb(20 31 24 / 0.06), 0 12px 32px -24px rgb(20 31 24 / 0.4)",
        lift: "0 24px 60px -28px rgb(20 31 24 / 0.38)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right": "slide-in-right 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-down": "slide-down 0.18s ease-out",
        marquee: "marquee 32s linear infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [forms({ strategy: "class" }), typography],
};

export default config;
