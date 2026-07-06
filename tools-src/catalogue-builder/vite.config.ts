import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds a fully self-contained SPA bundle that gets embedded via
// <iframe src="/tools/catalogue-builder/index.html"> by the main site,
// so paths must be relative and everything (JS/CSS) must be bundled here.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../../public/tools/catalogue-builder',
    emptyOutDir: true
  },
  server: {
    port: 5174,
    strictPort: true
  }
});
