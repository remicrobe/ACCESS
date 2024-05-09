<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" :title="'Gérer les modèles d\'horraires' " color="primary">
          <horraire-configurator @add="add"/>
        </v-toolbar>

        <v-card-text
          style="overflow: auto"
        >
          <v-card-text
            style="overflow: auto"
            v-if="!loading && modele"
          >
            <v-data-table
              :headers="headers"
              :items="modele"
              :items-per-page="-1"
              items-per-page-text="Modeles par page : "
            >

              <template v-slot:item.actions="{ item }">
                <horraire-configurator @edit="edit" :edit="item"/>
              </template>

              <template #bottom></template>
            </v-data-table>
          </v-card-text>
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
    let {data:modele,pending:loading} = await useApiService('/modele-horaire', {method:"get"},true)

    return {modele,loading}
  },
  data(){
    return{
      headers: [
        { title: 'Nom', value: 'nom' },
        { title: 'Actions', value:'actions',align: 'end', sortable:false }
      ],
    }
  },
  methods:{
    add(model){
      this.modele.push(model)
    },
    edit(model){
      this.modele[this.modele.findIndex((m)=> m.id === model.id)] = model
    }
  }
}
</script>
