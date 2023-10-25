<template>
  <v-app>
    <v-navigation-drawer color="primary" app v-model="drawer" v-if="!isLoginPage">
      <v-list >
        <v-list-item
          v-if="user"
          prepend-avatar="/default.png"
          :title="user.nom + ' ' + user.prenom"
          :subtitle="user.fonction"
        />
        <v-list-item @click="disconnect" title="Se déconnecter" append-icon="mdi-login" />

        <v-divider></v-divider>

        <v-list-item v-for="route in routes" :to="route.route" :title="route.title" :append-icon="route.icon" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" :elevation="1" app v-if="!isLoginPage">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ 'AccessLink > ' + currentRouteTitle  }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer app v-if="!isLoginPage"></v-footer>
  </v-app>
</template>

<script>
import { useGlobalStore } from "~/services/globalStore";

export default {
  data: () => ({
    drawer: true,
    user: useGlobalStore().getUserInfo(),
    routes: [
      {
        route: "/",
        title: "Accueil",
        icon: "mdi-home",
      },
      {
        route: "/collab",
        title: "Collaborateurs",
        icon: "mdi-account-multiple",
      },
      {
        route: "/demande-collab",
        title: "Demandes",
        icon: "mdi-frequently-asked-questions",
      },
      {
        route: "/services",
        title: "Services",
        icon: "mdi-domain",
      },
      {
        route: "/access",
        title: "Points d'accès",
        icon: "mdi-door",
      },
      {
        route: "/access-history",
        title: "Historique d'accès",
        icon: "mdi-history",
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
  created(){
    if (!this.isLoginPage && !useGlobalStore().isLogin()) {
      this.$router.push('/login');
    }
  },
  watch: {
    $route(o,n){
      if (!this.isLoginPage && !useGlobalStore().isLogin()) {
        this.$router.push('/login');
      }
    }
  },
  methods:{
    disconnect(){
      useGlobalStore().disconnect()
      this.$router.push('/login');
    }
  }
};
</script>
  
