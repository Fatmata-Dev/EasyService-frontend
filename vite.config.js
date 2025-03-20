import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000, // Utiliser le port défini par Render
    strictPort: true,
    allowedHosts: ["easyservice-29e5.onrender.com"],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
