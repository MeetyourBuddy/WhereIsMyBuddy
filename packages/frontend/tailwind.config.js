import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
// @ts-ignore
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'signin-blue': '#162D3A',
        'google-button': '#F3F9FA'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};
