<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card class="mx-auto">
        <v-toolbar class="pt-n5" title="Gérer les entrées-sorties" color="primary"></v-toolbar>
        <v-card-text style="overflow: auto">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                clearable
                variant="outlined"
                label="Date de début"
                density="comfortable"
                type="date"
                v-model=filtering.startDate
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                clearable
                variant="outlined"
                label="Date de fin"
                density="comfortable"
                type="date"
                v-model=filtering.endDate
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                variant="outlined"
                label="Etat ?"
                :items="['Autorisé','Refusé']"
                v-model=filtering.state
                clearable
                density="comfortable"
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                variant="outlined"
                label="Collaborateur"
                :items="collabs"
                item-title="nom"
                clearable
                item-value="id"
                v-model="filtering.collabs"
                density="comfortable"
                multiple
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.raw.prenom + ' ' + item.raw.nom"
                  ></v-chip>
                </template>
                <template v-slot:item="{ props, item }">

                  <v-list-item
                    v-bind="props"
                    :title="item.raw.prenom + ' ' + item.raw.nom"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                variant="outlined"
                v-if="services"
                label="Services"
                :items="services"
                item-title="nomservice"
                clearable
                item-value="id"
                v-model="filtering.service"
                density="comfortable"
                multiple
              >
              </v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                variant="outlined"
                label="Type d'action"
                :items="['Access','Pointage']"
                v-model=filtering.access
                clearable
                density="comfortable"
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-btn
                :loading="loading"
                color="primary"
                size="x-large"
                variant="flat"
                density="comfortable"
                block
                @click="exportData"
              >
                Exporter

                <template v-slot:loader>
                  <v-progress-linear indeterminate></v-progress-linear>
                </template>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table-server
            no-data-text="Aucune donnée disponible"
            items-per-page-text="Nombre d'historiques par page"
            :items-length=nbOfItem
            :headers="headers"
            :items="historique"
            @update:page="setPage"
            @update:options="updateOptions"
            :items-per-page-options="[{value:5, title:'5'},{value:10, title:'10'}]"
          >
            <template v-slot:item.identite="{ item }">
              <span>{{ item.collab.nom.toUpperCase() + " " + item.collab.prenom }}</span>
            </template>
            <template v-slot:item.nompoint="{ item }">
              <span>{{ item.point.nompoint }}</span>
            </template>
            <template v-slot:item.date="{ item }">
              <span>{{ new Date(item.date).toLocaleString() }}</span>
            </template>
            <template v-slot:item.actionAutorise="{ item }">
              <v-icon v-if="item.actionAutorise" color="success">mdi-check-bold</v-icon>
              <v-icon v-else color="error">mdi-alert-circle</v-icon>
            </template>
            <template v-slot:item.typeAction="{ item }">
              <span>{{ item.typeAction }}</span>
            </template>
            <template v-slot:item.statutUtilise="{ item }">
              <span>{{ item.statutUtilise }}</span>
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useApiService } from "~/services/apiServices";
import { DateTime } from "luxon";

export default {
  setup() {
    let { data: services } = useApiService("/service/mesServices", { method: "get" }, true, false);
    let { data: collabs } = useApiService("/collab/infoCollabSousControl", { method: "get" }, true, false);

    return { collabs, services };
  },
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      headers: [
        { title: "Identité", value: "identite" },
        { title: "Point d'accès", value: "nompoint" },
        { title: "Date", value: "date" },
        { title: "Action autorisée", value: "actionAutorise" },
        { title: "Type d'action", value: "typeAction" },
        { title: "Statut d'utilisation", value: "statutUtilise", align: 'end' },
      ],
      filtering: {
        startDate: null,
        endDate: null,
        collabs: null,
        services: null,
        state: null,
        access: null,
      },
      loading : false,
      page: 1,
      itemsParPage: 5,
      nbOfItem: 0,
      historique: undefined
    };
  },
  methods:{
    async fetchData() {
      this.loading = true
      let {
        status,
        data,
        error
      } = await useApiService(`/historique/${this.page}/${this.itemsParPage}`, {
        method: 'get',
        params: {
          filtering:this.filtering
        },
        watch: false,
      });
      if (status.value  === "success") {
        this.historique = data.value[0];
        this.nbOfItem = data.value[1];
      }
      this.loading = false;
    },
    async exportData() {
      this.loading = true
      let {
        status,
        data,
        error
      } = await useApiService(`/historique/export/${this.page}/${this.itemsParPage}`, {
        method: 'get',
        params: {
          filtering:this.filtering
        },
        watch: false,
      });
      if (status.value  === "success") {
        URL.createObjectURL(data.value)
        let url = URL.createObjectURL(data.value);
        let link = document.createElement('a');
        link.href = url;
        link.download = 'Historique-Recap-Access '  + DateTime.now().toFormat("dd-MM-yyyy HH-mm-ss") + '.xlsx';
        link.click();

      }
      this.loading = false;
    },
    setPage(page){
      this.page = page;
      this.fetchData();
    },
    updateOptions(options){
      this.itemsParPage = options.itemsPerPage;
      this.fetchData();
    }
  },
  watch:{
    filtering:{
      handler(){
        this.fetchData()
      },
      deep:true
    }
  }
};
</script>
