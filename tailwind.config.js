/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"], // Add the Lato font here
      },
      colors: {
        customGreen: "#24c5a1",
      },
    },
  },
  plugins: [],
};
