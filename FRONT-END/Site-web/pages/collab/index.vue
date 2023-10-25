<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" title="Gérer les collaborateurs" color="primary">
          <collabConfigurator/>
        </v-toolbar>

        <v-card-text
          style="height: 80vh; overflow: auto"
          v-if="!loading && collabs"
        >
          <v-data-table
            :headers="headers"
            :items="collabs"
            :items-per-page="5"
            class="elevation-1"
            items-per-page-text="Collaborateurs par page : "
          >
            <template v-slot:item.service="{ item }">
              <v-chip v-if="item.service" color="blue" dark>{{ item.service.nomservice }}</v-chip>
              <span v-else>No Service</span>
            </template>

            <template v-slot:item.actions="{ item }">
              <collab-card-generator :collabs-i-d="item.id"/>
              <collab-configurator :edit="item"/>
            </template>
          </v-data-table>
        </v-card-text>
        <v-progress-circular indeterminate v-else />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import CollabConfigurator from "~/components/collab/collabConfigurator.vue";
import { useApiService } from "~/services/apiServices";

export default {
  components: { CollabConfigurator },
  async setup(){
    let {data:collabs,pending:loading,error} = await useApiService('http://localhost:5000/collab/infoCollabSousControl', {method:"get"},true,true)
    return {collabs,loading}
  },
  data(){
    return{
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'Prénom', value: 'prenom' },
        { title: 'Nom', value: 'nom' },
        { title: 'Fonction', value: 'fonction' },
        { title: 'Grade', value: 'grade' },
        { title: 'Service', value: 'service' },
        { title: 'Actions', value:'actions' }
      ],
    }
  }
};

</script>