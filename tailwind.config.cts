/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        "black-100": "var(--color-black-100)",
        "black-200": "var(--color-black-200)",
        "white-100": "var(--color-white-100)",
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
      },
    },
  },
  plugins: [],
};
