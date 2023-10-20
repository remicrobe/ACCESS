<template>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item-group>
          <v-list-item to="/login" title="Se connecter"/>
          <v-list-item to="/login/reset-password" title="Mot de passe soublié"/>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
  }
  </script>
  