import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        buddy: {
          purple: "#6E56CF",
          "purple-light": "#9E8CFC",
          "purple-dark": "#4A37A5",
          blue: "#4F94FC",
          "blue-light": "#7FB2FF",
          "blue-dark": "#2D6BCA",
          green: "#4CC38A",
          "green-light": "#7EDAA6",
          "green-dark": "#2A9A69",
          orange: "#FF8A65",
          "orange-light": "#FFA78B",
          "orange-dark": "#E5623F",
          gray: "#F8F9FC",
          "gray-100": "#F1F3F9",
          "gray-200": "#E2E6EF",
          "gray-300": "#CDD3E1",
          "gray-400": "#9AA1B2",
          "gray-500": "#717891",
          "gray-600": "#4D546D",
          "gray-700": "#33394B",
          "gray-800": "#1D212E",
          "gray-900": "#0E111B"
        },
        pastel: {
          green: "#F2FCE2",
          yellow: "#FEF7CD",
          orange: "#FEC6A1",
          purple: "#E5DEFF",
          pink: "#FFDEE2",
          peach: "#FDE1D3",
          blue: "#D3E4FD",
          gray: "#F1F0FB"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["SF Pro Display", "Inter", "sans-serif"]
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'elevation': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(110, 86, 207, 0.15)'
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(8px)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.97)" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      textShadow: {
        'default': '0px 1px 2px rgba(0, 0, 0, 0.3)',
        'sm': '0px 1px 1px rgba(0, 0, 0, 0.2)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
