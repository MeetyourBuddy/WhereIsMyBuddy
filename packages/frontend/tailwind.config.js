import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
// @ts-ignore
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'signin-blue': '#162D3A',
        'google-button': '#F3F9FA',
        'not-found': '#565872',
        'onboarding-card': '#F3F9FA',
        border: '#162D3A40'
      }
    },
    fontFamily: {
      rub: ['Rubik']
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};
