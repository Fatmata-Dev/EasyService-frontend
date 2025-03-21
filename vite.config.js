import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Ajoutez des options si nécessaire, par exemple : react({ fastRefresh: false })
  server: {
    host: "0.0.0.0", // Écoute sur toutes les interfaces réseau
    port: 3000, // Port utilisé pour le développement
    strictPort: true, // Force l'utilisation du port 3000
  },
  // Utilisez un fichier .env pour les variables d'environnement
  // Vite expose automatiquement les variables préfixées par VITE_ via import.meta.env
});