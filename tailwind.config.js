/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F86B8',
          50:  '#EDF4FB',
          100: '#D6E8F5',
          200: '#ADD1EB',
          300: '#84BAE1',
          400: '#5B9FD4',
          500: '#4F86B8',
          600: '#3A6E9F',
          700: '#2C5580',
          800: '#1E3D62',
          900: '#102644',
        },
        secondary: '#B6E1F2',
        accent: {
          DEFAULT: '#E8C547',
          warm:    '#F2A84B',
          dark:    '#C9A227',
        },
        surface: '#FFFFFF',
        background: '#F2F8FD',
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        serif:   ['"Scheherazade New"', '"Amiri"', 'serif'],
        arabic:  ['"Scheherazade New"', '"Amiri"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      borderRadius: {
        card: '1.5rem',
        btn:  '0.875rem',
      },
      boxShadow: {
        glow:    '0 0 24px rgba(79,134,184,0.25)',
        'glow-lg':'0 0 40px rgba(79,134,184,0.35)',
        card:    '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease both',
        'slide-up':    'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-down':  'slideDown 0.3s ease both',
        'scale-in':    'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':   'spin 8s linear infinite',
        shimmer:       'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
      },
    },
  },
  plugins: [],
};
