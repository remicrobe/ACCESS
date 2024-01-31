<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" title="Gérer les points d'accés" color="primary">
          <access-configurator
            :collabs="collabs"
            :services="services"
            @add="add"
          />
        </v-toolbar>

        <v-card-text
          style="height: 80vh; overflow: auto"
          v-if="access"
        >
          <v-data-table
            :headers="headers"
            :items="access"
            :items-per-page="15"
            class="elevation-1"
            items-per-page-text="Access par page : "
          >
            <template v-slot:item.typePoint="{ item }">
              <v-chip v-if="item.typePoint.toUpperCase() === 'AP'" color="success" dark>Point d'accès</v-chip>
              <v-chip v-if="item.typePoint.toUpperCase() === 'POINTEUSE'" color="success" dark>Pointeuse</v-chip>
            </template>

            <template v-slot:item.active="{ item }">
              <v-icon v-if="item.active === true" color="success">mdi-check-bold</v-icon>
              <v-icon v-else-if="item.active === false" color="error">mdi-alert-circle</v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <access-configurator
                :edit="item"
                :collabs="collabs"
                :services="services"
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
  setup() {
    let { data: services } = useApiService("/service/mesServices", { method: "get" }, true, false);
    let { data: collabs } = useApiService("/collab/infoCollabSousControl", { method: "get" }, true, false);
    let { data: access } = useApiService("/access/listeAccess", { method: "get" }, true, false);
    return { collabs, services, access };
  },
  methods: {
    useGlobalStore,
    add(access2edit) {
      this.access.push(access2edit);
    },
    edit(access2edit) {
      this.access[this.access.findIndex((a) => a.id === access2edit.id)] = access2edit;
    },

  },
  computed:{
    headers(){
      if(!this.$vuetify.display.mobile){
        return [
          { title: "Nom balise", value: "nompoint" },
          { title: "Localisation balise", value: "location" },
          { title: "Type balise", value: "typePoint" },
          { title: "Active", value: "active" },
          { title: "Actions", value: "actions" },
        ]
      }else{
        return [
          { title: "Nom balise", value: "nompoint" },
          { title: "Active", value: "active" },
          { title: "Actions", value: "actions" },
        ]
      }
    }
  }
};

</script>