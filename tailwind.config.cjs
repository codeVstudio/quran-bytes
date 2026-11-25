/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#f6f1e7',
        ink: '#0d1411',
        emerald: {
          deep: '#0f3d2e',
          darker: '#0a2d22',
        },
        gold: {
          DEFAULT: '#c2a15a',
          text: '#80632b',
        },
        muted: '#626b58',
        hairline: '#d7d4c8',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Arial', 'sans-serif'],
        arabic: ['Amiri', '"Traditional Arabic"', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
