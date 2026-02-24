/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // InklusiJobs brand colors from Figma
        brand: {
          black:   "#000000",
          blue:    "#0023FF",
          forest:  "#01322C",
          navy:    "#1E293B",
          indigo:  "#232F74",
          cream:   "#F7F6F4",
          offwhite:"#FAF9F8",
          white:   "#FFFFFF",
        },
      },
      fontFamily: {
        lexend: ["var(--font-lexend)", "Lexend", "sans-serif"],
        roboto: ["var(--font-roboto)", "Roboto", "sans-serif"],
      },
      fontSize: {
        "8xl": ["6rem", { lineHeight: "100px" }],
        "7xl": ["4.5rem", { lineHeight: "1.05" }],
        "6xl": ["3.75rem", { lineHeight: "80px" }],
        "5xl": ["3rem", { lineHeight: "80px" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};