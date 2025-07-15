// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  server: {
    port:3000,
  },
  css: [
    'mapbox-gl/dist/mapbox-gl.css',
    '@/assets/scss/styles.scss',
    
  ],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css'
        }
      ]
    }
  }
})
