import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Simuler __dirname en ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Écoute sur toutes les interfaces réseau
    port: 3000, // Port utilisé pour le développement
    strictPort: true, // Force l'utilisation du port 3000
    allowedHosts: ["easyservice-29e5.onrender.com"], // Autoriser cet hôte
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});