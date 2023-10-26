<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" :title="'Gérer les demandes du personnel' " color="primary">
          <collab-demande-configurator />
        </v-toolbar>

        <v-card-text
          style="height: 80vh; overflow: auto"
          v-if="!loading && demande"
        >
          <v-data-table
            :headers="headers"
            :items="demande"
            :items-per-page="5"
            class="elevation-1"
            items-per-page-text="Demandes par page : "
          >
            <template v-slot:item.collab="{ item }">
              <v-chip v-if="item.collab" color="blue" dark>{{ item.collab.prenom }} {{ item.collab.nom }}</v-chip>
              <span v-else>No Collaborator</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
<script>
import CollabDemandeConfigurator from "~/components/collab/demande/demandeConfigurator.vue";
import { useGlobalStore } from "~/services/globalStore";
import { useApiService } from "~/services/apiServices";

export default{
  async setup(){
    let {data:demande,pending:loading} = await useApiService('/absence/absenceDeMesCollaborateurs', {method:"get"},true,true)

    return {demande,loading}
  },
  data(){
    return{
      headers: [
        { title: 'Date début', value: 'datedeb' },
        { title: 'Date fin', value: 'datefin' },
        { title: 'Raison', value: 'raison' },
        { title: 'Description', value: 'description' },
        { title: 'Accepté', value: 'accepte' },
        { title: 'Date réponse', value: 'datereponse' },
        { title: 'Collaborateur', value: 'collab' }
      ],
    }
  }
}

</script>