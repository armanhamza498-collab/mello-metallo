import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ──────────────────────────────────
        ivory: {
          DEFAULT: "#F8F5EF",
          50: "#FDFCFA",
          100: "#F8F5EF",
          200: "#EDE8DF",
          300: "#DDD6C9",
          400: "#C8BFB0",
        },
        cream: {
          DEFAULT: "#EDE8DF",
          dark: "#D4CFC5",
        },
        sand: "#D4CFC5",
        charcoal: {
          DEFAULT: "#2C2A27",
          light: "#3D3A36",
          dark: "#1A1714",
        },
        espresso: "#1A1714",
        brass: {
          DEFAULT: "#8B7355",
          light: "#A89070",
          lighter: "#C4AB8A",
          dark: "#6B5640",
          darker: "#4A3A2B",
          muted: "#9B8566",
        },
        copper: {
          DEFAULT: "#8B4513",
          warm: "#A0522D",
          light: "#B5651D",
          dark: "#6B3410",
        },
        muted: {
          DEFAULT: "#9B9590",
          light: "#B5B0AA",
          dark: "#6B6660",
        },
        // ── Semantic ───────────────────────────────────────
        surface: {
          DEFAULT: "#F8F5EF",
          secondary: "#EDE8DF",
          tertiary: "#D4CFC5",
        },
        border: {
          DEFAULT: "#D4CFC5",
          light: "#E8E3DA",
          dark: "#9B9590",
        },
        text: {
          primary: "#2C2A27",
          secondary: "#6B6660",
          muted: "#9B9590",
          inverse: "#F8F5EF",
        },
        // ── Status ─────────────────────────────────────────
        success: "#4A7C59",
        warning: "#C4871A",
        error: "#B54040",
        info: "#3B6EA0",
      },
      fontFamily: {
        serif: [
          "Cormorant Garamond",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
        sans: [
          "Inter",
          "Manrope",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-xs": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "50": "12.5rem",
        "54": "13.5rem",
        "58": "14.5rem",
        "62": "15.5rem",
        "66": "16.5rem",
        "70": "17.5rem",
      },
      maxWidth: {
        site: "1400px",
        content: "1200px",
        narrow: "900px",
        "xs": "20rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "luxury": "0 4px 24px rgba(44, 42, 39, 0.06), 0 1px 4px rgba(44, 42, 39, 0.04)",
        "luxury-md": "0 8px 40px rgba(44, 42, 39, 0.10), 0 2px 8px rgba(44, 42, 39, 0.06)",
        "luxury-lg": "0 16px 60px rgba(44, 42, 39, 0.12), 0 4px 16px rgba(44, 42, 39, 0.08)",
        "brass": "0 4px 24px rgba(139, 115, 85, 0.15)",
        "inner-luxury": "inset 0 1px 3px rgba(44, 42, 39, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-down": "fadeDown 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "shimmer": "shimmer 1.8s infinite linear",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "luxury-in": "cubic-bezier(0.4, 0, 1, 1)",
        "luxury-out": "cubic-bezier(0, 0, 0.2, 1)",
        "luxury-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      gridTemplateColumns: {
        "product-2": "repeat(2, minmax(0, 1fr))",
        "product-3": "repeat(3, minmax(0, 1fr))",
        "product-4": "repeat(4, minmax(0, 1fr))",
      },
      aspectRatio: {
        "product": "3 / 4",
        "hero": "16 / 9",
        "square": "1 / 1",
        "portrait": "2 / 3",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
