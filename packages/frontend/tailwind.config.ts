import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', ...fontFamily.sans]
      },
      fontSize: {
        'display-lg': '11.25rem',
        'display-md': '8rem',
        'display-sm': '6rem',
        'heading-2xl': '4.5rem',
        'heading-xl': '3.75rem',
        'heading-lg': '3rem',
        'heading-md': '2.25rem',
        'heading-sm': '1.875rem',
        'heading-xs': '1.5rem',
        'text-2xl': '1.5rem',
        'text-xl': '1.25rem',
        'text-lg': '1.25rem',
        'text-base': '1rem',
        'text-md': '1rem',
        'text-sm': '0.875rem',
        'text-xs': '0.75rem',
        'text-2xs': '0.625rem',
        'paragraph-2xl': '1.25rem',
        'paragraph-lg': '1rem',
        'paragraph-sm': '0.75rem',
        'label-2xl': '1.125rem',
        'label-lg': '0.875rem',
        'label-sm': '0.625rem'
      },
      fontWeight: {
        light: '100',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '900'
      },
      lineHeight: {
        'display-lg': '11.75rem',
        'display-md': '8.5rem',
        'display-sm': '6.5rem',
        'heading-2xl': '5rem',
        'heading-xl': '3.5rem',
        'heading-lg': '3rem',
        'heading-md': '2.75rem',
        'heading-sm': '2.375rem',
        'heading-xs': '2rem',
        'text-2xl': '2rem',
        'text-xl': '1.75rem',
        'text-lg': '1.5rem',
        'text-md': '1.375rem',
        'text-sm': '1.25rem',
        'text-xs': '1rem',
        'text-2xs': '0.875rem',
        'paragraph-lg': '1.5rem',
        'paragraph-md': '1.25rem',
        'label-xs': '0.875rem'
      },
      colors: {
        gray: {
          '5': 'hsl(214, 32%, 98%)',
          '10': 'hsl(210, 40%, 96%)',
          '20': 'hsl(214, 32%, 91%)',
          '30': 'hsl(214, 27%, 84%)',
          '40': 'hsl(215, 20%, 65%)',
          '50': 'hsl(215, 16%, 47%)',
          '60': 'hsl(215, 19%, 35%)',
          '70': 'hsl(215, 25%, 27%)',
          '80': 'hsl(217, 33%, 17%)',
          '90': 'hsl(222, 47%, 11%)',
          DEFAULT: 'hsl(215, 16%, 47%)'
        },
        blue: {
          '5': 'hsl(214, 100%, 97%)',
          '10': 'hsl(214, 95%, 93%)',
          '20': 'hsl(213, 97%, 87%)',
          '30': 'hsl(216, 96%, 78%)',
          '40': 'hsl(217, 91%, 68%)',
          '50': 'hsl(217, 91%, 60%)',
          '60': 'hsl(221, 83%, 53%)',
          '70': 'hsl(221, 75%, 48%)',
          '80': 'hsl(221, 70%, 40%)',
          '90': 'hsl(221, 64%, 33%)',
          DEFAULT: 'hsl(217, 91%, 60%)'
        },
        warning: {
          '5': 'hsl(48, 100%, 96%)',
          '10': 'hsl(48, 96%, 89%)',
          '20': 'hsl(48, 97%, 77%)',
          '30': 'hsl(45, 97%, 64%)',
          '40': 'hsl(43, 96%, 56%)',
          '50': 'hsl(38, 93%, 50%)',
          '60': 'hsl(32, 95%, 44%)',
          '70': 'hsl(27, 94%, 37%)',
          '80': 'hsl(26, 83%, 31%)',
          '90': 'hsl(24, 75%, 27%)',
          DEFAULT: 'hsl(38, 93%, 50%)'
        },
        success: {
          '5': 'hsl(142, 76%, 97%)',
          '10': 'hsl(141, 84%, 93%)',
          '20': 'hsl(141, 79%, 85%)',
          '30': 'hsl(142, 77%, 73%)',
          '40': 'hsl(142, 69%, 58%)',
          '50': 'hsl(142, 69%, 45%)',
          '60': 'hsl(142, 76%, 36%)',
          '70': 'hsl(142, 72%, 29%)',
          '80': 'hsl(142, 64%, 24%)',
          '90': 'hsl(142, 61%, 20%)',
          DEFAULT: 'hsl(142, 69%, 45%)'
        },
        purple: {
          '5': 'hsl(280, 100%, 98%)',
          '10': 'hsl(276, 100%, 95%)',
          '20': 'hsl(276, 100%, 92%)',
          '30': 'hsl(275, 98%, 85%)',
          '40': 'hsl(275, 95%, 75%)',
          '50': 'hsl(273, 91%, 65%)',
          '60': 'hsl(275, 80%, 56%)',
          '70': 'hsl(273, 70%, 47%)',
          '80': 'hsl(273, 67%, 39%)',
          '90': 'hsl(273, 65%, 32%)',
          DEFAULT: 'hsl(273, 91%, 65%)'
        },
        brand: {
          '5': 'hsl(226, 100%, 97%)',
          '10': 'hsl(226, 100%, 94%)',
          '20': 'hsl(228, 96%, 89%)',
          '30': 'hsl(231, 94%, 82%)',
          '40': 'hsl(235, 91%, 74%)',
          '50': 'hsl(239, 84%, 67%)',
          '60': 'hsl(242, 74%, 59%)',
          '70': 'hsl(243, 75%, 50%)',
          '80': 'hsl(243, 54%, 41%)',
          '90': 'hsl(243, 45%, 35%)',
          DEFAULT: 'hsl(239, 84%, 67%)'
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
        primaryHover: {
          DEFAULT: 'hsl(var(--primary-hover))'
        },
        secondaryHover: {
          DEFAULT: 'hsl(var(--secondary-hover))'
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
          '5': 'hsl(355, 100%, 97%)',
          '10': 'hsl(355, 95%, 95%)',
          '20': 'hsl(355, 96%, 90%)',
          '30': 'hsl(355, 94%, 82%)',
          '40': 'hsl(355, 95%, 72%)',
          '50': 'hsl(351, 89%, 60%)',
          '60': 'hsl(346, 77%, 50%)',
          '70': 'hsl(346, 83%, 41%)',
          '80': 'hsl(346, 80%, 35%)',
          '90': 'hsl(346, 73%, 30%)',
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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      variants: {
        extend: {
          scale: ['group-hover'],
          opacity: ['group-hover']
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
