/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      container: {
        center: 'true',
      },
      fontFamily: {
        stix: ['STIX Two Math', 'serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
  safelist: ['[&::-webkit-scrollbar]:hidden'],
}
