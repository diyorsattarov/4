import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // default configuration
    outDir: 'dist',
    // other configurations...
  },
  // other settings...
});
