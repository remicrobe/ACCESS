<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" title="Gérer les services" color="primary">
          <service-configurator @exclude="exclude" @add="add" :collabs="collabs"/>
        </v-toolbar>

        <v-card-text
          style="height: 80vh; overflow: auto"
          v-if="!loading && services"
        >
          <v-data-table
            :headers="headers"
            :items="services"
            :items-per-page="5"
            class="elevation-1"
            items-per-page-text="Paramètres par page : "
          >
            <template v-slot:item.chefservice="{ item }">
              <v-chip v-if="item.chefservice" color="blue" dark>{{ item.chefservice.prenom + ' ' + item.chefservice.nom}}</v-chip>
              <span v-else>No Collaborator</span>
            </template>

            <template v-slot:item.collabs="{ item }">
              <v-chip v-if="item.collabs" color="blue" dark>{{ item.collabs.length }}</v-chip>
              <span v-else>No Collaborator</span>
            </template>

            <template v-slot:item.actions="{ item }">
              <service-configurator @exclude="exclude" @edit=edit :collabs=collabs :edit="item"/>
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
import { useApiService } from "~/services/apiServices";

export default {
   setup(){
     let {data:services,pending:loading} = useApiService('/service/mesServices', {method:"get"},true)
    let {data:collabs} = useApiService('/collab/sansService', {method:"get",watch:false},true)


    return {services,loading,collabs}
  },
  methods:{
    add(service){
      this.services.push(service)
      service.collabs.forEach(collab=>{
        this.collabs = this.collabs.filter(c=> c.id !== collab.id)
      })
    },
    edit(service){
      this.services[this.services.findIndex((s)=> s.id === service.id)] = service
      service.collabs.forEach(collab=>{
        this.collabs = this.collabs.filter(c=> c.id !== collab.id)
      })
    },
    exclude(c){
      if(!this.collabs.some(collab => collab.id === c.id))
        this.collabs.push(c)
    }
  },
  computed: {
    headers() {
      if (!this.$vuetify.display.mobile) {
        return [
          { title: 'ID', value: 'id' },
          { title: 'Nom service', value: 'nomservice' },
          { title: 'Chef service', value: 'chefservice' },
          { title: 'NB Collaborateurs', value: 'collabs', align: 'center' },
          { title: 'Actions', value: 'actions' }
        ]
      } else {
        return [
          { title: 'Nom service', value: 'nomservice' },
          { title: 'Actions', value: 'actions' }
        ]
      }
    }
  }
}
</script>