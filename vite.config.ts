import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base path to ensure assets load correctly on any domain (GitHub Pages, Vercel, or Custom Domain)
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
