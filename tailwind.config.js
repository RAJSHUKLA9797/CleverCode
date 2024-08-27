/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Raleway:["Raleway","sans-serif"]
      },
      colors: {
        customGreen: "#24c5a1",
        customYellow: "#FAD359",
        customBlue: "#0991D1",
        customRed: "#B91C1D",
      },
    },
  },
  plugins: [],
};
