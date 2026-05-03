/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff6b35',
          hover: '#e55a2b',
          soft: '#fff5f0',
          border: '#ffcbb8',
          foreground: '#c2410c',
        },
        accent: {
          DEFAULT: '#00d4ff',
        },
      },
    },
  },
  plugins: [],
};
