const { COLORS } = require("./src/constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: COLORS.PRIMARY,
        budget: COLORS.BUDGET,
        slate: COLORS.SLATE,
      },
    },
  },
  plugins: [],
};
