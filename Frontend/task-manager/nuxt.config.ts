// https://nuxt.com/docs/api/configuration/nuxt-config

// import tailwindcss from "@tailwindcss"
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    // '@nuxtjs/tailwindcss',
  ],
    vite: {
      plugins: [
        tailwindcss(),
      ],
  },
})