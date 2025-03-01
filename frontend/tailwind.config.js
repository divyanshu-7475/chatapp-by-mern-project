/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        brush: ['"Brush Script MT"', 'cursive'], // Add fallback cursive font
      },
    },
  },
  plugins: [],
}

