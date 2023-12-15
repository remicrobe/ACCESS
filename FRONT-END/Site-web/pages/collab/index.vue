<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" title="Gérer les collaborateurs" color="primary">
          <collabConfigurator
            v-if="useGlobalStore().isRH"
            :services="services"
            :modele="modele"
            @add="add"
          />
        </v-toolbar>

        <v-card-text
          style="overflow: auto"
          v-if="collabs"
        >
          <v-data-table
            :headers="headers"
            :items="collabs"
            :items-per-page="15"
            items-per-page-text="Collaborateurs par page : "
          >
            <template v-slot:item.prenom="{ item }">
              {{ item.nom.toUpperCase() +  ' ' + item.prenom}}
            </template>

            <template v-slot:item.service="{ item }">
              <v-chip v-if="item.service" color="success" dark>{{ item.service.nomservice }}</v-chip>
              <v-chip v-else color="error" dark>Pas de service</v-chip>
            </template>

            <template v-slot:item.actif="{ item }">
              <v-icon v-if="item.actif === true" color="success">mdi-check-bold</v-icon>
              <v-icon v-else-if="item.actif === false" color="error">mdi-alert-circle</v-icon>
              <v-icon v-else color="warning">mdi-alert-circle</v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <collab-card-generator :collabs-i-d="item.id"/>
              <collab-refresh-card :collab-i-d="item.id"/>
              <collab-configurator
                :edit="item"
                :services="services"
                :modele="modele"
                @edit="edit"
              />
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
import { useGlobalStore } from "~/services/globalStore";

export default {
  components: { CollabConfigurator },
   setup(){
    let {data:services} =  useApiService('/service/mesServices', {method:"get"},true,false)
    let {data:collabs} =  useApiService('/collab/infoCollabSousControl', {method:"get"},true,false)
    let {data:modele} =  useApiService('/modele-horaire', {method:"get"},true,false)
    return {collabs,services,modele}
  },
  methods:{
    useGlobalStore,
    add(collab){
      this.collabs.push(collab)
    },
    edit(collab){
      this.collabs[this.collabs.findIndex((c)=> c.id === collab.id)] = collab
    }
  },
  computed:{
    headers(){
      if(!this.$vuetify.display.mobile){
        return [
          { title: 'Identité', value: 'prenom' },
          { title: 'Fonction', value: 'fonction' },
          { title: 'Grade', value: 'grade' },
          { title: 'Service', value: 'service' , align: 'center'},
          { title: 'Actif', value:'actif' },
          { title: 'Actions', value:'actions', align: 'end' }
        ]
      }else{
        return [
          { title: 'Identité', value: 'prenom' },
          { title: 'Fonction', value: 'fonction' },
          { title: 'Actions', value:'actions', align: 'end' }
        ]
      }
    }
  }
};

</script>

<style scoped>

</style>
