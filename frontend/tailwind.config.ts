import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '15': '15vh'
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        fadeIn:  'fadeIn 1s forwards',
        fadeOut: 'fadeOut 1s forwards'
      },
      fontFamily: {
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["fantasy", "dark", "valentine"],
  },
}

export default config
