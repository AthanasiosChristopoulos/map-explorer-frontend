// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  css: [
    'vue-library/src/assets/scss/styles.scss',
    'mapbox-gl/dist/mapbox-gl.css',
    '@/assets/scss/styles.scss',
  ],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css'
        }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/mapbox-gl-animated-popup@0.4.0/dist/mapbox-gl-animated-popup.min.js',
          defer: true
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
    }
  }
})
