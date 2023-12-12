import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    components: {
      ...components,
      ...labsComponents,
    },
    // add theme
    theme: {
      defaultTheme: LIGHT_THEME,
      themes: {
        light,
        dark,
      },
      // add color variations
      //   variations: {
      //     colors: ["primary", "secondary"],
      //     lighten: 3,
      //     darken: 3,
      //   },
    },
    // Add the custom iconset
    icons: {
      defaultSet: "custom",
      aliases,
      sets: {
        custom,
      },
    },
  });

  app.vueApp.use(vuetify);
});
