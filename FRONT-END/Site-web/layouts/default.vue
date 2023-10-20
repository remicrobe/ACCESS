<template>
	<v-app>
	  <v-navigation-drawer app v-model="drawer" v-if="!isLoginPage">
		<v-list>
			<v-list-item
          		prepend-avatar="https://randomuser.me/api/portraits/men/1.jpg"
          		title="John Doe"
				subtitle="Développeuse"
        	/>
			<v-list-item to="/login" title="Se déconnecter" append-icon="mdi-login"/>

        <v-divider></v-divider>

			<v-list-item v-for="route in routes" :to="route.route" :title="route.title" :append-icon="route.icon"/>
		</v-list>
	  </v-navigation-drawer>
  
	  <v-app-bar :elevation="1" app v-if="!isLoginPage">
		<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
		<v-toolbar-title>{{ currentRouteTitle }}</v-toolbar-title>
	  </v-app-bar>
  
	  <v-main>
		<slot />
	  </v-main>
  
	  <v-footer app v-if="!isLoginPage"></v-footer>
	</v-app>
  </template>
  
  <script>
  export default {
	data: () => ({
	  drawer: true,
	  routes: [
		{
			route: '/',
			title: 'Accueil',
			icon: 'mdi-home'
		},
		{
			route: '/collab',
			title: 'Collaborateurs',
			icon: 'mdi-account-multiple'
		},
		{
			route: '/services',
			title: 'Services',
			icon: 'mdi-domain'
		},
		{
			route: '/access',
			title: 'Points d\'accès',
			icon: 'mdi-door'
		},
		{
			route: '/access-history',
			title: 'Historique d\'accès',
			icon: 'mdi-history'
		},
	  ]
	}),
	computed: {
	  isLoginPage() {
		return this.$route.path.indexOf('login') !== -1;
	  },
	  currentRouteTitle() {
			const currentRoute = this.$route.path;
			const matchingRoute = this.routes.find(route => route.route === currentRoute);
			return matchingRoute ? matchingRoute.title : '';
    	}	
	}
  }
  </script>
  
