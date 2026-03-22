import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MallowMoney/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.png', 'mallow-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        id: '/MallowMoney/',
        name: 'MallowMoney',
        short_name: 'MallowMoney',
        description: 'Personal Finance Tracker with Pixel Mallow',
        theme_color: '#E8F8FB',
        background_color: '#E8F8FB',
        display: 'standalone',
        display_override: ['standalone', 'window-controls-overlay'],
        orientation: 'portrait',
        scope: '/MallowMoney/',
        start_url: '/MallowMoney/?mode=standalone',
        screenshots: [
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'MallowMoney Dashboard'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'MallowMoney Mobile'
          }
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
