/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#050816",
          light: "#ffffff",
        },
        secondary: {
          DEFAULT: "#aaa6c3",
          light: "#4b5563",
        },
        tertiary: {
          DEFAULT: "#151030",
          light: "#f3f4f6",
        },
        "black-100": {
          DEFAULT: "#100d25",
          light: "#f9fafb",
        },
        "black-200": {
          DEFAULT: "#090325",
          light: "#f3f4f6",
        },
        "white-100": {
          DEFAULT: "#f3f3f3",
          light: "#1f2937",
        },
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        "card-light": "0px 35px 120px -15px rgba(0, 0, 0, 0.1)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/images/Plexus.png')",
        "hero-pattern-light": "url('/images/Plexus.png')",
      },
    },
  },
  plugins: [],
};
