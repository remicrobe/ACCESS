import vuetify from "vite-plugin-vuetify";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
// @ts-ignore
export default defineNuxtConfig({
  // import styles
  // @ts-ignore
  css: ["@/assets/main.scss"],
  devtools: { enabled: true },
  // enable takeover mode
  typescript: { shim: false },
  build: { transpile: ["vuetify"] },
  modules: [
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins ||= [];
        config.plugins.push(vuetify());
      });
    },
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public:{
      apiUrl: 'https://api.access-link.tech',
      //apiUrl: 'http://localhost:5000',
      version: '0.0.1'
    }
  },

  app: {
    head: {
      title: "AccessLink",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
});
