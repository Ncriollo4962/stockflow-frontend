/** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: ["selector", '[class="my-app-dark"]'],
//   content: ["./src/**/*.{html,ts}", "./node_modules/primeng/**/*.{html,js}"],
//   theme: {
//     extend: {
//       keyframes: {
//         slidedown: {
//           from: { maxHeight: "0" },
//           to: { maxHeight: "1000px" },
//         },
//         slideup: {
//           from: { maxHeight: "1000px" },
//           to: { maxHeight: "0" },
//         },
//       },
//       animation: {
//         slidedown: "slidedown 0.2s ease-out",
//         slideup: "slideup 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-primeui")],
// };
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
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1920px",
    },
  },
};
