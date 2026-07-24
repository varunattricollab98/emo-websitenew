import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    // route + vendor code-splitting keeps the initial JS payload small
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('react-router') || id.includes('@remix-run')) return 'router'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler'))
            return 'react'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
