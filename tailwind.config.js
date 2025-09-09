/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        "avenir-black": ["Avenir-Black", "sans-serif"],
        "avenir-light": ["Avenir-Light", "sans-serif"],
        "avenir-medium": ["Avenir-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
