import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from "vite-plugin-vercel";

export default defineConfig({
  plugins: [react(), vercel()],
  base: "/",
  server: {
    host: "0.0.0.0", // Écoute sur toutes les interfaces réseau
    port: 3000, // Port utilisé pour le développement
    strictPort: true, // Force l'utilisation du port 3000
    allowedHosts: ["easyservice-29e5.onrender.com", "easyservice-frontend-l01x.onrender.com", "easyservice-zhmc.onrender.com", "easyservice.vercel.app"], // Autoriser ces hôtes
  },
});
