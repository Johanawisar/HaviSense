import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        hey: {
          bg:       "#ffffff",
          surface1: "#ececec",
          surface2: "#d5d5d5",
          celeste:  "#7ebef7",
          text1:    "#141223",
          text2:    "#282828",
          muted:    "#9f9f9f",
          muted2:   "#a5a5a5",
          green:    "#00bf63",
          greenV:   "#b9f148",
          violet:   "#5e17eb",
          pink:     "#f966f1",
          yellow:   "#fae244",
          orange:   "#ff7403",
          red:      "#d01818",
          redL:     "#e1cbcb",
          // aliases para compatibilidad con código existente
          dark:     "#141223",
          card:     "#ececec",
          border:   "#d5d5d5",
          muted_:   "#9f9f9f",
        },
      },
      fontFamily: {
        sans:    ["var(--font-sora)", "sans-serif"],
        display: ["var(--font-sora)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;