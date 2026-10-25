import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages, Netlify or any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
})
