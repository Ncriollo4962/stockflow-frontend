/** @type {import('tailwindcss').Config} */
import PrimeUI from "tailwindcss-primeui";

export default {
  darkMode: ["selector", '[class="my-app-dark"]'],
  content: ["./src/**/*.{html,ts}", "./node_modules/primeng/**/*.{html,js}"],
  plugins: [PrimeUI],
  theme: {
    extend: {
      keyframes: {
        slidedown: {
          from: { maxHeight: "0" },
          to: { maxHeight: "1000px" },
        },
        slideup: {
          from: { maxHeight: "1000px" },
          to: { maxHeight: "0" },
        },
      },
      animation: {
        slidedown: "slidedown 0.2s ease-out",
        slideup: "slideup 0.2s ease-out",
      },
      colors: {
        // Colores semánticos que se adaptan al tema automáticamente
        "text-main": "var(--text-color)",
        "text-body": "var(--body-text-color)",
        "bg-body": "var(--body-bg)",
        "bg-card": "var(--card-bg)",
        "border-main": "var(--border-color)",
      },
    },
    screens: {
      sm: "576px", // móvil grande
      md: "768px", // tablet
      lg: "992px", // laptop pequeña
      xl: "1200px", // laptop estándar
      "2xl": "1366px", // laptop grande (ej: 1366x768)
      "3xl": "1536px", // laptop alta resolución
      "4xl": "1920px", // monitor Full HD
      "5xl": "2560px", // monitor 2K/4K
    },
  },
};
