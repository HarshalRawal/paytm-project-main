import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing shadcn/ui colors
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
          '5': 'hsl(var(--chart-5))'
        },
        // WhatsApp UI specific colors
        whatsapp: {
          primary: '#00a884',
          secondary: '#202c33',
          background: '#111b21',
          surface: '#202c33',
          text: '#e9edef',
          'text-secondary': '#8696a0',
          divider: '#222d34',
          hover: '#2a3942',
          'message-out': '#005c4b',
          'message-in': '#202c33',
          'icon-active': '#00a884',
          'icon-inactive': '#8696a0',
          'notification': '#25d366',
          'error': '#ef4444',
          'success': '#22c55e'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      // Add WhatsApp specific customizations
      maxHeight: {
        'chat': 'calc(100vh - 8rem)', // For chat container
      },
      minHeight: {
        'message': '3rem', // For message bubbles
      },
      boxShadow: {
        'message': '0 1px 0.5px rgba(11, 20, 26, 0.13)',
      },
      animation: {
        'message-in': 'message-in 0.3s ease-out',
        'message-out': 'message-out 0.3s ease-out',
      },
      keyframes: {
        'message-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'message-out': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
