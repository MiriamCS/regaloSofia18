import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// /assets se sirve tal cual en la raíz del sitio (niveles, sprites, fotos, música).
// /config se importa dentro del código (textos, tamaños de foto, dificultad).
export default defineConfig({
  base: './',
  publicDir: 'assets',
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Sofía: 18 años en clave de sol',
        short_name: 'Sofía 18',
        description: 'Un regalo de cumpleaños para Sofía',
        lang: 'es',
        start_url: './',
        scope: './',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#071A3D',
        theme_color: '#071A3D',
        icons: [
          { src: 'icons/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icono-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,jpg,jpeg,webp,ogg,mp3,txt,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
});
