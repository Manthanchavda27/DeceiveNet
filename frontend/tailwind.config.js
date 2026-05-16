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
        ink: '#18232e',
        muted: '#667582',
        line: '#dce5e3',
        teal: {
          DEFAULT: '#118a7e',
          dark: '#0c635b',
        },
        honey: '#d9982f',
        wash: '#eef6f4',
      },
      boxShadow: {
        card: '0 18px 55px rgba(31,52,62,0.09)',
        hero: '0 28px 80px rgba(31,52,62,0.15)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { opacity: '0.25', transform: 'translateX(-10px)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.25', transform: 'translateX(10px)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        scan: 'scan 2.6s linear infinite',
        'scan-delay': 'scan 2.6s linear 1.2s infinite',
      },
    },
  },
  plugins: [],
};
