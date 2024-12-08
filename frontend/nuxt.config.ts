// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true, 
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000', // URL par défaut si .env est manquant
    },
  },
  googleFonts: {
    families: {
      Molle: [400],
    },
    display: 'swap',
  },
  components: [
    { path: '~/components/', pathPrefix: false }
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/scss/variables.scss";`, // Injection automatique
        },
      },
    },
  },
   

})
