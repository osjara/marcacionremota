const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      borderRadius: {
        lg: "var(0.5rem)",
        md: "calc(var(0.5rem) - 2px)",
        sm: "calc(var(0.5rem) - 4px)",
      },
      colors: {
        border: "#fafafa",
        input: "#fafafa",
        ring: "#fafafa",
        background: "#0d324f",
        foreground: "#9ba5b3",
        primary:{
          DEFAULT: '#0070f0',
          focus: "#F31260",
        },
        secondary:{
          DEFAULT: '#8752c6'
        },
        destructive: {
          DEFAULT: '#0070f0',
          foreground: '#0070f0',
        },
        muted: {
          DEFAULT: '#fafafa',
          foreground: '#0070f0',
        },
        accent: {
          DEFAULT: '#0070f0',
          foreground: '#0070f0',
        },
        popover: {
          DEFAULT: '#0070f0',
          foreground: '#0070f0',
        },
        card: {
          DEFAULT: '#0070f0',
          foreground: '#0070f0',
        },
        
        focus: "#e64a19",
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes:{
        dark:{
          colors:{
            background: '#0d324f',
            default: '#fafafa',
            primary:{
              DEFAULT: '#0070f0',
              focus: "#F31260",
            },
            secondary:{
              DEFAULT: '#8752c6'
            },
          }
        },
        light:{
          colors:{
            background: '#fafafa',
            default: '#fafafa',
            primary:{
              DEFAULT: '#e64a19'
            },
            secondary:{
              DEFAULT: '#8752c6'
            },
            focus: "#e64a19",
          },
        }
      }
    }),
],
}