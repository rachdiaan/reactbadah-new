/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2F5233', // Deep Islamic Green
        secondary: '#1A3C2B', // Darker Green
        accent: '#D4AF37', // Muted Gold
        surface: '#FFFFFF',
        background: '#F7F7F2', // Soft Sand/Off-White
        text: {
          DEFAULT: '#1F2937', // Charcoal
          muted: '#6B7280',
          light: '#F9FAFB'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Amiri"', 'serif'],
      }
    },
  },
  plugins: [],
};
