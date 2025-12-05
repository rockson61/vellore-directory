import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary Palette - Indigo (Refined for better contrast)
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5', // Main primary - WCAG AA compliant
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                // Secondary Palette - Purple
                secondary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea', // Main secondary
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                // Accent - Emerald (Refined for better contrast)
                accent: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669', // Main accent - WCAG AA compliant
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                // WhatsApp
                whatsapp: {
                    DEFAULT: '#25D366',
                    dark: '#1ebe57',
                },
                // Neutral Grays (High Contrast)
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
            },
            boxShadow: {
                // Claymorphic Shadows
                'clay-sm': '0 1px 4px rgba(0, 0, 0, 0.04)',
                'clay': '0 4px 16px rgba(0, 0, 0, 0.06)',
                'clay-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'clay-elevated': '0 12px 32px rgba(0, 0, 0, 0.10)',
                'clay-float': '0 16px 40px rgba(99, 102, 241, 0.15)',
                'clay-glow': '0 0 0 4px rgba(99, 102, 241, 0.1)',
                // Legacy (keeping for compatibility)
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
                'hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'float': '0 12px 32px rgba(99, 102, 241, 0.15)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
            },
            backdropBlur: {
                'glass': '20px',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            transitionTimingFunction: {
                'bouncy': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'gradient': 'gradient 3s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
            },
        },
    },
    plugins: [],
};

export default config;
