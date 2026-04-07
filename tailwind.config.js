/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6fd',
          500: '#3b5bdb',
          600: '#2f4ac4',
          700: '#2340a8',
          800: '#1a3180',
          900: '#122260',
        },
      },
    },
  },
  plugins: [],
}
