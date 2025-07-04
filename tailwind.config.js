/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-plot": "#01818d",
        "secondary-plot": "#64748B",
        "success-plot": "#16A34A",
        "warning-plot": "#EAB308",
        "danger-plot": "#DC2626",
        "info-plot": "#4F46E5",
        "background-plot": "#F9FAFB",

        primary: {
          100: "#e6f3f4",
          200: "#bfe0e3",
          300: "#8ccbd0",
          400: "#59b5bd",
          500: "#01818d",
          600: "#016a74",
          700: "#01535c",
          800: "#003c43",
          900: "#00262b",
        },
        //secondary color should be amber based
        secondary: {
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
        },
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
