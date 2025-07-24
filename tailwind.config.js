/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'mpesa': {
          'green': {
            DEFAULT: '#43b02a', // Primary Safaricom/M-Pesa green
            'light': '#8dd176',
            'dark': '#348e21',
          },
          'red': {
            DEFAULT: '#e1001a', // Secondary Safaricom/M-Pesa red
            'light': '#ff4d4d',
            'dark': '#b30015',
          },
          'gray': {
            DEFAULT: '#4a4a4a',
            'light': '#7a7a7a',
            'dark': '#2a2a2a',
          }
        }
      }
    },
  },
  plugins: [],
}