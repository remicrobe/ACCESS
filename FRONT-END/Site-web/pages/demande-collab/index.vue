<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card
        class="mx-auto"
      >
        <v-toolbar class="pt-n5" :title="'Gérer les demandes du personnel' " color="primary">
          <collab-demande-configurator @add="add" :collabs="collabs" />
        </v-toolbar>

        <v-card-text
          style="overflow: auto"
        >
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
                :items="['Accepté','Refusé', 'En attente']"
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
                v-if="collabs"
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
                label="Services"
                :items="services"
                v-if="services"
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
                label="Type de demande"
                :items="['conge','maladie','autre']"
                v-model=filtering.type
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
            items-per-page-text="Nombre de demande par page"
            :items-length=nbOfItem
            :headers="headers"
            :items="demande"
            @update:page="setPage"
            @update:options="updateOptions"
            :items-per-page-options="[{value:5, title:'5'},{value:10, title:'10'}]"
          >
            <template v-slot:item.datedeb="{ item }">
              <v-chip v-if="item.collab" color="warning" dark>{{ new Date(item.datedeb).toLocaleDateString() }} à
                {{ new Date(item.datefin).toLocaleDateString() }}
              </v-chip>
            </template>

            <template v-slot:item.collab="{ item }">
              <v-chip v-if="item.collab" color="blue" dark>{{ item.collab.prenom }} {{ item.collab.nom.toUpperCase() }}</v-chip>
              <span v-else>No Collaborator</span>
            </template>

            <template v-slot:item.actions="{ item }">
              <collab-demande-configurator @edit=edit :collabs="collabs" :edit="item" />
              <collab-demande-acceptor @edit=edit :demande="item" />
            </template>

            <template v-slot:item.dateDemande="{ item }">
              <v-chip v-if="item.collab" color="success" dark>
                {{ new Date(item.dateDemande).toLocaleDateString() }}
              </v-chip>
            </template>

            <template v-slot:item.accepte="{ item }">
              <v-icon v-if="item.accepte === true" color="success">mdi-check-bold</v-icon>
              <v-icon v-else-if="item.accepte === false" color="error">mdi-alert-circle</v-icon>
              <v-icon v-else color="warning">mdi-alert-circle</v-icon>
            </template>
          </v-data-table-server>
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
import { DateTime } from "luxon";

export default {
  setup() {
    let { data: collabs } = useApiService("/collab/infoCollabSousControl", { method: "get", watch: false }, true);
    let { data: services } = useApiService("/service/mesServices", { method: "get" }, true, false);


    return { collabs, services };
  },
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      filtering: {
        startDate: null,
        endDate: null,
        collabs: null,
        services: null,
        state: null,
        type: null,
      },
      loading: false,
      page: 1,
      itemsParPage: 5,
      nbOfItem: 0,
      demande: undefined,
    };
  },
  methods: {
    add(demande) {
      this.demande.push(demande);
    },
    edit(demande) {
      this.demande[this.demande.findIndex((d) => d.id === demande.id)] = demande;
    },
    async fetchData() {
      this.loading = true;
      let {
        status,
        data,
        error,
      } = await useApiService(`/absence/absenceDeMesCollaborateurs/${this.page}/${this.itemsParPage}`, {
        method: "get",
        params: {
          filtering: this.filtering,
        },
        watch: false,
      });
      if (status.value === "success") {
        this.demande = data.value[0];
        this.nbOfItem = data.value[1];
      }
      this.loading = false;
    },
    async exportData() {
      this.loading = true;
      let {
        status,
        data,
        error,
      } = await useApiService(`/absence/absenceDeMesCollaborateurs/export/`, {
        method: "get",
        params: {
          filtering: this.filtering,
        },
        watch: false,
      });
      if (status.value === "success") {
        URL.createObjectURL(data.value);
        let url = URL.createObjectURL(data.value);
        let link = document.createElement("a");
        link.href = url;
        link.download = "Historique-Recap-Absence " + DateTime.now().toFormat("dd-MM-yyyy HH-mm-ss") + ".xlsx";
        link.click();

      }
      this.loading = false;
    },
    setPage(page) {
      this.page = page;
      this.fetchData();
    },
    updateOptions(options) {
      this.itemsParPage = options.itemsPerPage;
      this.fetchData();
    },
  },
  computed: {
    headers() {
      if (!this.$vuetify.display.mobile) {
        return [
          { title: "Collaborateur", value: "collab" },
          { title: "Periode", value: "datedeb", align: "center" },
          { title: "Date demande", value: "dateDemande", align: "center" },
          { title: "Type absence", value: "raison" },
          { title: "Description", value: "description" },
          { title: "Accepté", value: "accepte", align: "center" },
          { title: "Actions", value: "actions", align: 'end' },
        ];
      } else {
        return [
          { title: "Collaborateur", value: "collab" },
          { title: "Accepté", value: "accepte", align: "center" },
          { title: "Actions", value: "actions", align: 'end' },
        ];
      }
    },
  },
  watch: {
    filtering: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
  },
};

</script>
