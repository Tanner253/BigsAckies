import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Deep Space Background
        'space-black': '#0a0a0f',
        'space-dark': '#1a1a2e',
        'space-void': '#16213e',
        
        // Nebula Colors inspired by the image
        'nebula-deep-purple': '#2d1b69',
        'nebula-royal-purple': '#4c1d95',
        'nebula-magenta': '#db2777',
        'nebula-hot-pink': '#ec4899',
        'nebula-crimson': '#dc2626',
        'nebula-amber': '#f59e0b',
        'nebula-orange': '#ea580c',
        'nebula-gold': '#fbbf24',
        'nebula-cyan': '#06b6d4',
        'nebula-violet': '#7c3aed',
        'nebula-pink': '#e879f9',
        'nebula-rose': '#f43f5e',
        'nebula-blue': '#3b82f6',
        
        // Accent Colors
        'cosmic-blue': '#1e40af',
        'cosmic-teal': '#0f766e',
        'stellar-white': '#f8fafc',
        'stellar-silver': '#e2e8f0',
        'stellar-silver-light': '#cbd5e1',
        'stellar-silver-dark': '#94a3b8',
        
        // Default theme colors
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
      backgroundImage: {
        'nebula-gradient': 'linear-gradient(135deg, #2d1b69 0%, #4c1d95 25%, #db2777 50%, #ec4899 75%, #fbbf24 100%)',
        'cosmic-gradient': 'linear-gradient(45deg, #1e40af 0%, #7c3aed 25%, #db2777 50%, #f59e0b 75%, #06b6d4 100%)',
        'stellar-gradient': 'radial-gradient(circle at 30% 70%, #7c3aed 0%, #db2777 30%, #ec4899 60%, #fbbf24 100%)',
        'space-gradient': 'radial-gradient(ellipse at center, #2d1b69 0%, #1a1a2e 40%, #0a0a0f 100%)',
        'aurora-gradient': 'linear-gradient(90deg, #06b6d4 0%, #7c3aed 25%, #db2777 50%, #ec4899 75%, #fbbf24 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "pulse-glow": {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(236, 72, 153, 0.5)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.8), 0 0 40px rgba(124, 58, 237, 0.6)',
            transform: 'scale(1.05)'
          },
        },
        "shimmer": {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        "twinkle": {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        "rotate-slow": {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        "orbit": {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "orbit": "orbit 15s linear infinite",
      },
      boxShadow: {
        'cosmic': '0 0 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)',
        'nebula': '0 0 20px rgba(219, 39, 119, 0.4), 0 0 40px rgba(124, 58, 237, 0.3)',
        'stellar': '0 0 15px rgba(6, 182, 212, 0.5), 0 0 30px rgba(251, 191, 36, 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config; 