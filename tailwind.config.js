/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': {
          50: '#f0f5ff',
          100: '#e6eeff',
          200: '#c4dbff',
          300: '#a2c1ff',
          400: '#5e94ff',
          500: '#1a67ff',
          600: '#0050e6',
          700: '#003acc',
          800: '#0030b3',
          900: '#002299'
        }
      }
    },
  },
  plugins: [],
}
