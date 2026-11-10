/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F5F7',
        card: '#FFFFFF',
        sand: {
          50: '#FBF9F7',
          100: '#F6EFE9',
          200: '#ECE3D7',
          300: '#DFD2C3',
          400: '#CBBBA8',
          500: '#B29F8B',
        },
        coral: {
          50: '#FDF4F3',
          100: '#FCE7E6',
          200: '#F9D1CF',
          300: '#F4AEA9',
          400: '#EC7A72',
          500: '#E2554C',
          600: '#CF3B32',
        },
        clinicBlue: {
          50: '#F0F6FE',
          100: '#DBEAFA',
          200: '#BDDBF7',
          300: '#8EBEF0',
          400: '#5A9EE6',
          500: '#3480D9',
        },
        amberGold: {
          50: '#FEF9F0',
          100: '#FDF2DE',
          200: '#FBE2B7',
          300: '#F7CB85',
          400: '#F1AC48',
          500: '#E28C22',
        }
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px'
      },
      boxShadow: {
        'soft-clay': '0 12px 35px -8px rgba(0, 0, 0, 0.06), 0 2px 8px -1px rgba(0, 0, 0, 0.02)',
        'soft-clay-sm': '0 6px 18px -4px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)',
        'soft-clay-hover': '0 20px 45px -12px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
