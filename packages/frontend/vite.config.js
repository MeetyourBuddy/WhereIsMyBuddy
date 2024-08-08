import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
  server: {
    port: process.env.VITE_PORT || 5173
  }
}
