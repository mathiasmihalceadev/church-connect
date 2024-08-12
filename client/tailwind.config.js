const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
            extend: {
                fontFamily: {
                    sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
                }
            }
        },
        colors: {
            'royal-blue': 'rgba(69, 108, 210, 1)',
            'lynx-white': 'rgba(247, 247, 248, 1)',
            'hyacinth-arbor': 'rgba(102, 113, 133, 1)',
            'lead-gray': 'rgba(33, 33, 33, 1)',
            'lila-purple': 'rgba(209, 224, 247, 1)',
            'input-gray': 'rgba(198, 207, 224, 1)',
            'dark-slate': 'rgba(28, 43, 80, 1)',
            'white': 'rgb(255, 255, 255)',
            'rose-red': 'rgba(181, 40, 40, 0.76)',
            'loader-background': 'rgba(102, 113, 133, 0.59)',
            'background-gray': 'rgba(245, 245, 245, 1)',
            'light-gray': 'rgb(220,220,220)',
            'blur': 'rgba(69,108,210,0.47)',
        },
        extend: {
            dropShadow: {
                'button': '0px 4px 4px rgba(0, 0, 0, 0.25)'
            },
            zIndex: {
                '2': '2',
                '3': '3',
                '4': '4',
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"},
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}