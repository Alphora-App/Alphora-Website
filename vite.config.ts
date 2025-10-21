import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Custom domain (alphora.app) → keep root base
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
})
