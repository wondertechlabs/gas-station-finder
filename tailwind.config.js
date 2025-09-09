/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a5b8ff',
          400: '#8190ff',
          500: '#142968',
          600: '#0f1f52',
          700: '#0c1a42',
          800: '#091535',
          900: '#061028',
        },
      },
      fontFamily: {
        "avenir-black": ["Avenir-Black", "sans-serif"],
        "avenir-light": ["Avenir-Light", "sans-serif"],
        "avenir-medium": ["Avenir-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
