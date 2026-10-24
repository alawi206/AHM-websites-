import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Photos dropped into src/assets/photos are resized and converted to
    // AVIF / WebP / JPEG at build time (see src/lib/photos.ts).
    imagetools({ removeMetadata: true }),
  ],
  build: {
    // Keep the client manifest so the prerender step can preload fonts.
    manifest: true,
    cssCodeSplit: false,
  },
})
