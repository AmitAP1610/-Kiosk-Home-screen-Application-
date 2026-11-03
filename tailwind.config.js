/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Industrial AMR White Control Dashboard Palette
        amr: {
          bg: '#F2F2EF',        // Main background
          primary: '#30343B',   // Sidebar and primary elements
          secondary: '#B0B4B8', // Secondary elements
          dark: '#202124',      // Dark components
          accent: '#D49A36',    // Warning/accent (Industrial Amber)
          accentHover: '#C0882B',
          card: '#FFFFFF',      // Cards
          text: '#30343B',      // Primary readable text
          textMuted: '#5F666D', // Secondary text
        },
        chaos: {
          bg: '#F2F2EF',        // Main background
          charcoal: '#30343B',  // Sidebar & primary elements
          charcoalDark: '#23272D',
          charcoalLight: '#3A3F47',
          maroon: '#D49A36',    // Warning/accent (Industrial Amber)
          maroonHover: '#C0882B',
          maroonLight: '#E0AC54',
          display: '#202124',   // Dark components / displays
          white: '#FFFFFF',     // Primary text
          silver: '#B0B4B8',    // Secondary elements / borders
          rubber: '#202124',    // Dark components
          card: '#FFFFFF',      // Cards
        },
        robot: {
          bg: '#202124',
          cyan: '#D49A36',
          cyanDim: '#B88328',
          cyanGlow: '#D49A36',
          cyanDark: '#202124',
          bezel: '#30343B',
          bezelBorder: '#B0B4B8',
          whiteChassis: '#F2F2EF',
        },
        ssu: {
          maroon: '#D49A36',
          maroonDark: '#B88328',
          maroonLight: '#E0AC54',
          maroonMuted: 'rgba(212, 154, 54, 0.2)',
          gold: '#D49A36',
          goldLight: '#E0AC54',
          goldDark: '#B88328',
          goldMuted: 'rgba(212, 154, 54, 0.2)',
          black: '#202124',
          white: '#FFFFFF',
          surface: '#30343B',
          card: '#FFFFFF',
          border: '#B0B4B8',
          borderGold: '#D49A36',
        }
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.20)',
      }
    },
  },
  plugins: [],
}
