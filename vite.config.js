import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // Ajoutez des options si nécessaire, par exemple : react({ fastRefresh: false })
  server: {
    allowedHosts: [
      "easyservice-29e5.onrender.com",
      "www.easyservice-29e5.onrender.com",
      "localhost",
      "0.0.0.0",
    ],
  },
});
