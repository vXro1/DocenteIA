import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El backend no tiene CORS: en desarrollo las peticiones a /api se reenvían a Spring Boot.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
