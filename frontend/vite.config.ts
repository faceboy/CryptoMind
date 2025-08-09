import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      '@headlessui/react',
      'framer-motion',
      'react-hot-toast',
      'clsx'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
