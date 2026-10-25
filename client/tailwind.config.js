/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        // Sampled from the AMS logo gradient (orange → pink → violet → indigo).
        brand: {
          orange: '#FF8A3D',
          pink: '#F23E7A',
          violet: '#9B3FE0',
          indigo: '#5B2BCB',
          50: '#F7F3FF',
          100: '#EFE7FF',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        ink: { DEFAULT: '#0F172A', soft: '#475569', muted: '#64748B' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF8A3D 0%, #F23E7A 45%, #9B3FE0 75%, #5B2BCB 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.07), inset 0 1px 0 rgba(255,255,255,0.6)',
        lift: '0 20px 50px -12px rgba(91, 43, 203, 0.22)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
