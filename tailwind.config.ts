import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores Primárias - Verde Sage
        primary: {
          sage: '#7E9690',
          'sage-light': '#A8BCB6',
          'sage-dark': '#6A7F7A',
        },
        // Cores Secundárias - Rosa Suave
        secondary: {
          rose: '#e2bbbe',
          'rose-light': '#f0d5d8',
          'rose-dark': '#d4a5a9',
        },
        // Neutras
        neutral: {
          snow: '#FAFAFF', // Off-white levemente azulado
          cream: '#FAF8F3',
          white: '#FFFFFF',
        },
        // Texto
        text: {
          primary: '#2D2D2D',
          secondary: '#6B6B6B',
          light: '#9B9B9B',
        },
        // Glassmorphism
        glass: {
          white: 'rgba(250, 250, 255, 0.95)',
          cream: 'rgba(250, 248, 243, 0.95)',
        },
      },
      // Sombras suaves e difusas
      boxShadow: {
        'soft': '0 4px 20px rgba(106, 127, 122, 0.12)',
        'soft-lg': '0 10px 40px rgba(106, 127, 122, 0.15)',
        'soft-xl': '0 20px 60px rgba(106, 127, 122, 0.18)',
        'inner-soft': 'inset 0 2px 4px rgba(126, 150, 144, 0.06)',
        'float': '0 12px 48px rgba(106, 127, 122, 0.20)',
      },
      // Bordas arredondadas modernas
      borderRadius: {
        'modern': '24px',
        'modern-lg': '32px',
        'modern-xl': '40px',
      },
      // Backdrop blur para glassmorphism
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        primary: ['var(--font-cormorant)', 'serif'],
        secondary: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
