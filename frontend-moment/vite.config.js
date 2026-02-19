import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',   
    port: 5173,          // use Vite’s default dev port
    strictPort: true,    // fail if port is taken
  },
})
