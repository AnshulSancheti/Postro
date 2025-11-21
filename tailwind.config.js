/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#F4F4F0',
        primary: '#CCFF00',
        secondary: '#0033FF',
        accent: '#FF0099',
        dark: '#0D0D0D',
        surface: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Unbounded"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        hard: '4px 4px 0px 0px #0D0D0D',
        'hard-hover': '8px 8px 0px 0px #0D0D0D',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.1em',
      },
      lineHeight: {
        snugger: '0.9',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
      },
    },
  },
  plugins: [],
}
