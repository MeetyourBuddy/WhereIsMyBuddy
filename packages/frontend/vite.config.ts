import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@services': resolve(__dirname, './src/services'),
      '@config': resolve(__dirname, './src/config'),
      '@providers': resolve(__dirname, './src/providers')
    }
  }
});
