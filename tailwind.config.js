/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6600',
        secondary: '#FFF9DF',
        textGray: '#969696',
        bgGray: '#F5F4F2',
        black: '#141414',
        border: '#FEDE59',
        yellow: '#FEDE59',
      },
      fontSize: {
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px
        'base': '1rem',      // 16px
        'lg': '1.25rem',     // 20px
        'xl': '1.5rem',      // 24px
        '2xl': '2.25rem',    // 36px
      },
      fontFamily: {
        sans: ['Gilroy', 'sans-serif'],
      },
      container: {
        center: true, // Центрирование контейнера по умолчанию
        padding: '1rem', // Внутренние отступы контейнера
        screens: {
          sm: '100%',       // 100% на маленьких экранах
          md: '720px',      // 720px на средних экранах
          lg: '960px',      // 960px на больших экранах
          xl: '1140px',     // 1140px на экранах XL
          '2xl': '1320px',  // 1320px на экранах 2XL
          '3xl': '1640px',  // 1640px на экранах 3XL
        },
      },
      screens: {
        '3xl': '1640px', // Новый брейкпоинт для контейнера с шириной 1640px
      },
    },
  },
  plugins: [],
}