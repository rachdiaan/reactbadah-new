/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B8FB9', // Soft Calm Blue
        secondary: '#B6E1F2', // Pastel Light Blue
        accent: '#F2D57E', // Pastel Gold
        surface: '#FFFFFF',
        background: '#F4F9FD', // Very Pale Blue White
        text: {
          DEFAULT: '#203A4E', // Dark Blue-Grey
          muted: '#6B7280',
          light: '#F9FAFB'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Amiri"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
};
