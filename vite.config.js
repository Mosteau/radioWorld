import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios']
        }
      }
    },
    // Forcer l'utilisation d'esbuild uniquement
    minify: 'esbuild',
    // Désactiver explicitement terser
    terserOptions: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'react-router-dom']
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  }
});