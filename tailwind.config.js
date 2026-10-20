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
      fontSize: {
        "large-title": [
          "34px",
          { lineHeight: "41px", fontWeight: "700", letterSpacing: "-0.5px" },
        ],
        title: ["22px", { lineHeight: "28px", fontWeight: "700" }],
        headline: ["18px", { lineHeight: "24px", fontWeight: "700" }],
        body: ["15px", { lineHeight: "22px", fontWeight: "500" }],
        subhead: ["13px", { lineHeight: "18px", fontWeight: "500" }],
        caption: ["11px", { lineHeight: "14px", fontWeight: "700" }],
        button: ["16px", { lineHeight: "20px", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};
