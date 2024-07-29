/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        danger: "#FF3000",
        black: "#344150",
        primary: "#00AAAB",
        secondary: "#002A52",
        "light-gray": "#00416B27",
      },
    },
  },
  plugins: [],
};
