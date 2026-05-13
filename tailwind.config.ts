import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
  		colors: {
        // Portfolio custom colors
        portfolio: {
          bg: '#F7F6F3',
          surface: '#FFFFFF',
          'surface-2': '#F0EEE9',
          border: '#E5E2DB',
          'border-strong': '#C8C4BB',
          text: '#1A1A18',
          'text-2': '#52524E',
          'text-3': '#8A8880',
          accent: '#1B4332',
          'accent-light': '#D8F3DC',
          'accent-mid': '#40916C',
          'accent-pale': '#F0FAF4',
          blue: '#1E3A5F',
          'blue-light': '#DBEAFE',
          'blue-pale': '#F0F6FF',
          amber: '#78350F',
          'amber-light': '#FEF3C7',
        },
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
  			'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
  			'base': ['1rem', { lineHeight: '1.5rem' }],
  			'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  			'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
  			'2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
  			'3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
  			'4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
  			'5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
  			'6xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.03em' }],
  		},
  		letterSpacing: {
  			tighter: '-0.05em',
  			tight: '-0.025em',
  			normal: '0em',
  			wide: '0.025em',
  			wider: '0.05em',
  			widest: '0.1em',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
