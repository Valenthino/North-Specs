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
        // Ink — neutral graphite scale. Primary buttons, headings, body text.
        // Anchored on the Synapse text tokens: text-primary #111827, text-secondary #4B5563, border #E5E7EB.
        ink: {
          50: "#f7f8f9",
          100: "#eceef1",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#0a0f1a",
        },
        // Frost — the Synapse signal green. CTAs, links, focus rings, highlights.
        // 400 = primary #4ADE80, 200 = accent/surface #BBF7D0.
        frost: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Aurora — emerald used for "verified / in-stock / certified" states.
        aurora: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(17 24 39 / 0.04), 0 8px 24px -14px rgb(17 24 39 / 0.10)",
        "card-hover": "0 2px 4px 0 rgb(17 24 39 / 0.05), 0 18px 44px -18px rgb(17 24 39 / 0.18)",
        header: "0 1px 0 0 rgb(17 24 39 / 0.05), 0 12px 32px -26px rgb(17 24 39 / 0.35)",
        glow: "0 0 0 1px rgb(74 222 128 / 0.35), 0 8px 30px -8px rgb(74 222 128 / 0.35)",
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
