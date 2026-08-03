import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This repository is published at:
// https://abdzulkifli.github.io/retreat_mr/
export default defineConfig({
  plugins: [react()],
  base: '/retreat_mr/',
  build: {
    target: 'es2020',
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true
  }
});
