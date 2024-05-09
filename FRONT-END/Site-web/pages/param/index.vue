<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" title="Gérer les paramètres" color="primary">
        </v-toolbar>

        <v-card-text
          style="overflow: auto"
          v-if="!loading && params"
        >
          <v-data-table
            :headers="headers"
            :items="params"
            :items-per-page="-1"
            items-per-page-text="Paramètres par page : "
          >
            <template v-slot:item.actions="{ item }">
              <param-configurator @edit="edit" :edit="item"/>
            </template>

            <template #bottom></template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
import { useApiService } from "~/services/apiServices";

export default {
  setup() {
    let { data: params } = useApiService("/param", { method: "get" }, true);


    return { params };
  },
  methods:{
    edit(param){
      this.params[this.params.findIndex((p)=> p.uniqueName === param.uniqueName)] = param
    }
  },
  computed: {
    headers() {
      return [
        { title: "Nom du paramètre", value: "viewName" },
        { title: "Valeur", value: "value", align: "center" },
        { title: "Actions", value: "actions", align: 'end' },
      ];

    },
  },
};
</script>
