import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "hsl(128 30% 12%)",
          900: "hsl(126 34% 21%)",
          800: "hsl(124 33% 25%)"
        },
        sage: {
          100: "hsl(100 10% 91%)",
          200: "hsl(100 12% 84%)"
        },
        mint: "hsl(160 40% 90%)",
        cream: "hsl(60 14% 95%)"
      },
      boxShadow: {
        soft: "0 18px 50px -28px rgba(23,48,31,.38)",
        card: "0 10px 30px -24px rgba(23,48,31,.28)",
        elevated: "0 24px 70px -42px rgba(23,48,31,.42)"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Be Vietnam Pro", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
