import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Configuration HTTPS pour le développement (optionnel)
    // https: true,
  },
  build: {
    // Optimisations pour la production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios']
        }
      }
    },
    // Compression et optimisation avec esbuild (plus rapide et stable)
    minify: 'esbuild',
    // Taille maximale des chunks
    chunkSizeWarningLimit: 1000,
    // Optimisation des assets
    assetsInlineLimit: 4096
  },
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'react-router-dom']
  },
  // Configuration de sécurité
  define: {
    // Désactiver les devtools en production
    __VUE_PROD_DEVTOOLS__: false,
  }
});
