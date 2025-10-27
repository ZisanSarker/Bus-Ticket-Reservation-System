/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E60000',
          hover: '#CC0000',
          light: '#FF1A1A',
        },
        text: {
          primary: '#333333',
          secondary: '#888888',
          light: '#AAAAAA',
        },
        background: {
          main: '#FFFFFF',
          page: '#F5F5F5',
          card: '#FFFFFF',
        },
        accent: {
          success: '#28A745',
          'success-light': '#D4EDDA',
          'success-border': '#28A745',
          muted: '#F0F0F5',
          'muted-dark': '#666666',
        },
        seat: {
          'booked-male': '#9B59B6',
          'booked-female': '#E91E63',
          'blocked': '#4A4A4A',
          'available': '#E0E0E0',
          'selected': '#28A745',
          'sold-male': '#FFB3BA',
          'sold-female': '#FFD1DC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Lato', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'input': '4px',
        'tag': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

