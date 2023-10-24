<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" title="Gérer les demandes" color="primary">
          <collab-demande-configurator/>
        </v-toolbar>

        <v-card-text
          style="height: 80vh; overflow: auto"
        >
          Ici la v-data-table ...
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
<script setup lang="ts">
import CollabDemandeConfigurator from "~/components/collab/demande/demandeConfigurator.vue";
</script>