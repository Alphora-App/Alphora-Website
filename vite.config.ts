import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serving at https://www.alphora.app -> base must be '/'
export default defineConfig({
  plugins: [react()],
  base: '/',   // IMPORTANT
})
