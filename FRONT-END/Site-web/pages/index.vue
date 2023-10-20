<template>
    <v-row class="mt-1 ml-1 mr-1">
      <v-col md="4" v-for="(item, i) in items" :key="i">
        <v-card>
          <v-card-title>
            <v-icon>{{ item.icon }}</v-icon> {{ item.title }}
          </v-card-title>
          <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    name: 'Accueil',
    data: () => ({
      items: [
        { title: 'Employés dans les locaux', subtitle: '26K', icon: 'mdi-account' },
        { title: 'Employés attendus aujourd\'hui', subtitle: '6,200', icon: 'mdi-clock' },
        { title: 'Entrées sorties aujourd\'hui', subtitle: '2.69K', icon: 'mdi-exit-to-app' },
        // Ajoutez ici d'autres v-cards si nécessaire
      ],
    }),
  }
  </script>
  