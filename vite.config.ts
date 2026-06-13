import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 4096,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Function form so shared deps (e.g. scheduler) stay with react in vendor
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
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
