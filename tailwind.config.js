/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2c679e',
          50: '#f0f6fc',
          100: '#dcebf7',
          200: '#c0dbf0',
          300: '#93c3e5',
          400: '#5fa2d5',
          500: '#3c82c2',
          600: '#2c679e',
          700: '#255485',
          800: '#11417c',
          900: '#0f3563',
          950: '#0a2242',
        },
        navy: {
          DEFAULT: '#11417c',
          dark: '#0f1a2e',
          900: '#0f1a2e',
        },
        accent: {
          DEFAULT: '#10B981',
          green: '#10B981',
          emerald: '#059669',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        surface: {
          light: '#f8fafc',
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(15, 26, 46, 0.07), 0 10px 20px -2px rgba(15, 26, 46, 0.04)',
        card: '0 4px 24px -6px rgba(17, 65, 124, 0.12)',
        'card-hover': '0 20px 40px -12px rgba(17, 65, 124, 0.25)',
        glow: '0 0 40px -8px rgba(44, 103, 158, 0.45)',
        'gold-glow': '0 0 30px -6px rgba(245, 158, 11, 0.5)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #f0f6fc 0%, #dcebf7 45%, #ffffff 100%)',
        'navy-gradient': 'linear-gradient(135deg, #11417c 0%, #0f1a2e 100%)',
        'primary-gradient': 'linear-gradient(135deg, #2c679e 0%, #11417c 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
