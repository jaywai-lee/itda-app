const { COLORS } = require("./src/constants/colors.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: COLORS.primary,
        budget: COLORS.budget,
        slate: COLORS.slate,
        canvas: COLORS.canvas,
        surface: COLORS.surface,
        fill: COLORS.fill,
        "fill-strong": COLORS.fillStrong,
        line: COLORS.line,
        ink: COLORS.ink,
        "danger-soft": COLORS.dangerSoft,
      },
      borderRadius: {
        chip: "12px",
        panel: "16px",
        card: "24px",
        sheet: "28px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
