import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      boxShadow: {
        inner:
          "inset 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "top-sm": "0 -5px 2px -5px rgba(0, 0, 0, 0.05)",
        "top-md": "0 -5px 4px -5px rgba(0, 0, 0, 0.05)",
        "top-lg": "0 -5px 8px -5px rgba(0, 0, 0, 0.05)",
        "top-xl": "0 -5px 16px -5px rgba(0, 0, 0, 0.05)",
        "right-sm": "1px 0 2px 0 rgba(0, 0, 0, 0.05)",
        "right-md": "1px 0 4px 0 rgba(0, 0, 0, 0.05)",
        "right-lg": "1px 0 8px 0 rgba(0, 0, 0, 0.05)",
        "right-xl": "1px 0 16px 0 rgba(0, 0, 0, 0.05)",
        "bottom-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "bottom-md": "0 1px 4px 0 rgba(0, 0, 0, 0.05)",
        "bottom-lg": "0 1px 8px 0 rgba(0, 0, 0, 0.05)",
        "bottom-xl": "0 1px 16px 0 rgba(0, 0, 0, 0.05)",
        "left-sm": "-1px 0 2px 0 rgba(0, 0, 0, 0.05)",
        "left-md": "-1px 0 4px 0 rgba(0, 0, 0, 0.05)",
        "left-lg": "-1px 0 8px 0 rgba(0, 0, 0, 0.05)",
        "left-xl": "-1px 0 16px 0 rgba(0, 0, 0, 0.05)",
        "inner-right-lg": "inset -8px 0 8px -8px rgba(0, 0, 0, 0.05)",
        "inner-right-xl": "inset -16px 0 16px -16px rgba(0, 0, 0, 0.05)",
        "inner-left-lg": "inset 8px 0 8px -8px rgba(0, 0, 0, 0.05)",
        "inner-left-xl": "inset 16px 0 16px -16px rgba(0, 0, 0, 0.05)",
      },
      colors: {
        primary: {
          DEFAULT: "#0055A4",
          main: "#0055A4",
          light: "#3377B6",
          dark: "#003B72",
        },
        inactive: {
          DEFAULT: "#F8BC44",
        },
        active: {
          DEFAULT: "#0055A4",
        },
        frozen: {
          DEFAULT: "#FF5252",
        },
        error: {
          DEFAULT: "#FF5252",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        xs: ["14px", "16px"],
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
