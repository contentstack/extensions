import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    middlewareMode: false,
  },
  optimizeDeps: {
    include: ['@contentstack/venus-components'],
  },
  define: {
    'process.env': {},
  },
})
