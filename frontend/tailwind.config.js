/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nouvelle palette - Design moderne et épuré
        'primary': {
          50: '#E8F4F8',
          100: '#D1E9F1',
          200: '#A3D3E3',
          300: '#75BDD5',
          400: '#3A9AC0',
          500: '#206080', // Bleu pétrole - Couleur principale
          600: '#1A4D66',
          700: '#143A4D',
          800: '#0E2733',
          900: '#07141A',
        },
        'teal': {
          50: '#E6F5F5',
          100: '#CCEBEB',
          200: '#99D7D7',
          300: '#66C3C3',
          400: '#33AFAF',
          500: '#208080', // Bleu-vert (teal)
          600: '#1A6666',
          700: '#134D4D',
          800: '#0D3333',
          900: '#061A1A',
        },
        'accent': {
          50: '#E6F7F2',
          100: '#CCEFE5',
          200: '#99DFCB',
          300: '#66CFB1',
          400: '#33BF97',
          500: '#20A080', // Vert turquoise - Accent/CTA
          600: '#1A8066',
          700: '#13604D',
          800: '#0D4033',
          900: '#06201A',
        },
        'deep': {
          50: '#E8EEF4',
          100: '#D1DDE9',
          200: '#A3BBD3',
          300: '#7599BD',
          400: '#4777A7',
          500: '#204080', // Bleu profond
          600: '#1A3366',
          700: '#13264D',
          800: '#0D1A33',
          900: '#060D1A',
        },
        'success': {
          50: '#E6F2EC',
          100: '#CCE5D9',
          200: '#99CBB3',
          300: '#66B18D',
          400: '#339767',
          500: '#008040', // Vert foncé - Succès
          600: '#006633',
          700: '#004D26',
          800: '#00331A',
          900: '#001A0D',
        },
        'light': {
          50: '#FAFCFC',
          100: '#F5F9F9',
          200: '#E0EDED',
          300: '#C0E0E0', // Bleu-vert très clair
          400: '#A0D0D0',
          500: '#80C0C0',
          600: '#60A0A0',
          700: '#408080',
          800: '#306060',
          900: '#204040',
        },
        // Couleurs neutres pour le texte et les fonds
        'slate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #206080 0%, #208080 100%)',
        'gradient-accent': 'linear-gradient(135deg, #20A080 0%, #008040 100%)',
        'gradient-hero': 'linear-gradient(135deg, #206080 0%, #204080 50%, #208080 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(32, 96, 128, 0.1), 0 4px 6px -4px rgba(32, 96, 128, 0.1)',
        'medium': '0 4px 25px -5px rgba(32, 96, 128, 0.15), 0 8px 10px -6px rgba(32, 96, 128, 0.1)',
        'strong': '0 10px 40px -10px rgba(32, 96, 128, 0.2)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(32, 96, 128, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 30px -5px rgba(32, 96, 128, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
