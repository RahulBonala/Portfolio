import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 4096,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Function form so shared deps (e.g. scheduler) stay with react in
        // vendor — the object form pulled them into the three chunk and made
        // the whole 3D stack an eager static dependency of the entry.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('/three/') ||
            id.includes('@react-three') ||
            id.includes('react-reconciler') ||
            id.includes('its-fine')
          ) {
            return 'three'; // lazy — only fetched on capable devices
          }
          if (id.includes('gsap') || id.includes('lenis')) return 'motion';
          if (id.includes('@emailjs')) return 'emailjs';
          return 'vendor';
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
      },
    },
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'lenis'],
  },
})
