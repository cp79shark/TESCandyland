/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        candy: ['"Comic Sans MS"', 'cursive', 'sans-serif'],
      },
      colors: {
        candy: {
          red: '#FF4444',
          purple: '#9B59B6',
          yellow: '#F1C40F',
          blue: '#3498DB',
          orange: '#E67E22',
          green: '#2ECC71',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        spin_slow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        candyfall: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        spin_slow: 'spin_slow 8s linear infinite',
        candyfall: 'candyfall linear forwards',
      },
    },
  },
  plugins: [],
}
