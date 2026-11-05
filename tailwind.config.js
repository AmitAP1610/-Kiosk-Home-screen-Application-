/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official KIOSK Minimal Graphic Design System Palette
        kiosk: {
          white: '#FFFFFF',
          navy: '#263746',
          navyHover: '#1D2B37',
          softGrey: '#E9EDF2',
          gold: '#C49A45',
          goldLight: '#E8B85D',
          charcoal: '#30343B',
          charcoalDark: '#202124',
          dark: '#202124',
          border: '#E9EDF2',
          borderSubtle: '#D8DFE8',
          text: '#30343B',
          textSecondary: '#606B76',
          textMuted: '#85909B',
          warning: '#C49A45',
          error: '#B42318',
        },
        amr: {
          bg: '#E9EDF2',        // Main soft grey background
          primary: '#263746',   // Navy Blue primary elements
          secondary: '#606B76', // Supporting text
          border: '#E9EDF2',    // Subtle border
          dark: '#202124',      // Dark components
          accent: '#263746',    // Navy Blue accent
          accentHover: '#1D2B37',
          highlight: '#C49A45', // Gold highlight
          card: '#FFFFFF',      // White cards
          text: '#30343B',      // Primary readable text
          textMuted: '#606B76', // Secondary text
          warning: '#C49A45',
          error: '#B42318',
        },
        chaos: {
          bg: '#E9EDF2',
          charcoal: '#30343B',
          charcoalDark: '#202124',
          charcoalLight: '#3D444C',
          maroon: '#263746',
          maroonHover: '#1D2B37',
          display: '#202124',
          white: '#FFFFFF',
          silver: '#E9EDF2',
          rubber: '#202124',
          card: '#FFFFFF',
        },
        robot: {
          bg: '#202124',
          cyan: '#263746',
          cyanDim: '#1D2B37',
          cyanGlow: '#C49A45',
          cyanDark: '#202124',
          bezel: '#30343B',
          bezelBorder: '#E9EDF2',
          whiteChassis: '#FFFFFF',
        },
        ssu: {
          navy: '#263746',
          navyDark: '#1D2B37',
          navyLight: '#32485C',
          gold: '#C49A45',
          goldLight: '#E8B85D',
          goldMuted: 'rgba(196, 154, 69, 0.15)',
          charcoal: '#30343B',
          black: '#202124',
          white: '#FFFFFF',
          softGrey: '#E9EDF2',
          surface: '#30343B',
          card: '#FFFFFF',
          border: '#E9EDF2',
          borderGold: '#C49A45',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(38, 55, 70, 0.05)',
        'card': '0 1px 4px rgba(38, 55, 70, 0.06)',
      }
    },
  },
  plugins: [],
}
