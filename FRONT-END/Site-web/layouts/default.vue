<template>
  <v-app>
    <v-navigation-drawer color="primary" app v-model="drawer" v-if="!isLoginPage">
      <v-list>
        <v-list-item
          v-if="user"
          prepend-avatar="/default.png"
          :title="user.nom + ' ' + user.prenom"
          :subtitle="user.fonction"
        />
        <v-list-item @click="disconnect" title="Se déconnecter" append-icon="mdi-login" />

        <v-divider></v-divider>

        <template v-for="route in routes">
          <v-list-item
            v-if="route.grade.includes('*') || user && route.grade.includes(user.grade)"
            :to="route.route"
            :title="route.title"
            :append-icon="route.icon" />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" :elevation="1" app v-if="!isLoginPage">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ "AccessLink > " + currentRouteTitle }}</v-toolbar-title>
      <notification></notification>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer app v-if="!isLoginPage"></v-footer>
  </v-app>
</template>

<script>
import { useGlobalStore } from "~/services/globalStore";
import Notification from "~/components/global/notification.vue";

export default {
  components: { Notification },
  async setup() {
    let user = await useGlobalStore().getUserInfo();

    return { user };
  },
  data: () => ({
    drawer: true,
    routes: [
      {
        route: "/",
        title: "Accueil",
        icon: "mdi-home",
        grade: ["*"],
      },
      {
        route: "/collab",
        title: "Collaborateurs",
        icon: "mdi-account-multiple",
        grade: ["*"],
      },
      {
        route: "/horaires",
        title: "Horaires",
        icon: "mdi-clock",
        grade: ["drh", "rh", "arh"],
      },
      {
        route: "/demande-collab",
        title: "Demandes",
        icon: "mdi-frequently-asked-questions",
        grade: ["*"],
      },
      {
        route: "/services",
        title: "Services",
        icon: "mdi-domain",
        grade: ["drh", "rh", "arh"],
      },
      {
        route: "/access",
        title: "Points d'accès",
        icon: "mdi-door",
        grade: ["drh", "rh", "arh"],
      },
      {
        route: "/access-history",
        title: "Historique d'accès",
        icon: "mdi-history",
        grade: ["*"],
      },
    ],
  }),

  computed: {
    isLoginPage() {
      return this.$route.path.indexOf("login") !== -1;
    },
    currentRouteTitle() {
      const currentRoute = this.$route.path;
      const matchingRoute = this.routes.find(route => route.route === currentRoute);
      return matchingRoute ? matchingRoute.title : "";
    },
  },
  async mounted() {
    await this.checkUserRight()

    watch(() => this.$route, async (to, from) => {
      if(!this.user){
        this.user = await useGlobalStore().getUserInfo();
      }
      await this.checkUserRight()
    }, { deep: true });

  },
  methods: {
    disconnect() {
      useGlobalStore().disconnect();
      useRouter().push('/login')
    },
    checkUserRight(){
      if (!this.isLoginPage && !useGlobalStore().isLogin()) {
        useRouter().push('/login?ref=' + useRouter().currentRoute.value.fullPath)
      }
    }
  },
};
</script>
  
