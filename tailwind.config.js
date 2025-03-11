module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#ff6b6b', // Vibrant Red
        'primary-light': '#ff8787',
        'primary-dark': '#e63946',
        secondary: '#fca311', // Vibrant Orange
        accent: '#00b4d8', // Vibrant Blue
        'bg-light': '#f1faee',
        'bg-dark': '#1d3557',
        'text-light': '#1d3557',
        'text-dark': '#f1faee',
        'card-light': '#ffffff',
        'card-dark': '#457b9d',
        'border-light': '#a8dadc',
        'border-dark': '#1d3557',
        success: '#06d6a0',
        error: '#ef476f',
        warning: '#ffd166',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};