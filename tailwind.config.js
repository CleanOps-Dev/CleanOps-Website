/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-orange': '#f59e0b',
                'brand-purple': '#A373BA',
                'brand-purple-light': '#E2A6FE',
                'brand-purple-dark': '#190125',
                'dark-primary': '#171717',
                'dark-secondary': '#262626',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            animation: {
                'gradient-bg': 'gradient-bg 15s ease infinite',
                // Add the Ken Burns animation
                'ken-burns': 'ken-burns 20s ease-out infinite',
            },
            keyframes: {
                'gradient-bg': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                // Define the Ken Burns keyframes
                'ken-burns': {
                    '0%': {
                        transform: 'scale(1) translate(0, 0)',
                    },
                    '50%': {
                        transform: 'scale(1.15) translate(5%, -5%)',
                    },
                    '100%': {
                        transform: 'scale(1) translate(0, 0)',
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
