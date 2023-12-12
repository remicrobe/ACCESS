<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col md="12">
      <v-card class="mx-auto">
        <v-toolbar class="pt-n5" :title="'Gérer les présences du personnel' " color="primary">
          <presence-configurator :collabs="collabs" @add="add" />
        </v-toolbar>
        <v-card-text style="height: 80vh; overflow: auto">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
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
              sm="3"
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
              sm="6"
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
            items-per-page-text="Nombre de présence par page"
            :items-length="totalItems"
            :headers="headers"
            :items="presence"
            @update:page="updatePage"
            @update:options="updateOptions"
            :items-per-page-options="[{value:5, title:'5'},{value:10, title:'10'}]"
            class="elevation-1"
          >
            <template v-slot:item.collab="{ item }">
              <v-chip v-if="item.collab" color="blue" dark>{{ item.collab.prenom }} {{ item.collab.nom }}</v-chip>
              <span v-else>Erreur</span>
            </template>

            <template v-slot:item.tempspres="{ item }">
              {{ getTimePres(item.hdeb,item.hfin) }}
            </template>

            <template v-slot:item.datePres="{ item }">
              {{ new Date(item.datePres).toLocaleDateString() }}
            </template>

            <template v-slot:item.hdeb="{ item }">
              {{ item.hdeb + ' à ' + item.hfin }}
            </template>

            <template v-slot:item.action="{ item }">
              <presence-configurator :edit="item" :collabs="collabs" @edit="edit"/>
            </template>

            <template v-slot:item.modifiePar="{ item }">
              <v-chip v-if="item.modifiePar" color="error" dark>{{ item.modifiePar.prenom }} {{ item.modifiePar.nom }}</v-chip>
              <v-chip v-else color="success" dark>Non modifié</v-chip>
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
import { useApiService } from "~/services/apiServices";
import { DateTime, Interval } from "luxon";

export default {
  setup() {
    let { data: collabs } = useApiService("/collab/infoCollabSousControl", { method: "get", watch: false }, true);


    return { collabs };
  },
  data() {
    return {
      presence: [],
      page: 1,
      itemsPerPage: 5,
      totalItems: 0,
      filtering: {
        startDate: null,
        endDate: null,
        collabs: null,
      },
      loading: false,
    };
  },
  methods: {
    add(pres){
      console.log(pres)
      this.presence.push(pres)
    },
    edit(pres) {
      this.presence[this.presence.findIndex((p) => p.id === pres.id)] = pres;
    },
    getTimePres(hdeb, hfin) {

      let diff = Interval.fromDateTimes(DateTime.fromFormat(hdeb, "HH:mm:ss"),DateTime.fromFormat(hfin, "HH:mm:ss")).length('minutes')
      const hours = Math.floor(diff / 60);
      const minutes = Math.floor(diff % 60);

      return `${hours} H ${minutes.toString().padStart(2, "0")}`;
    },
    async fetchPresence() {
      this.loading = true;
      const { data } = await useApiService(`/presence/presenceDeMesCollaborateurs/${this.page}/${this.itemsPerPage}`, {
        params: {
          filtering: this.filtering,
        },
        watch: false
      });
      this.presence = data.value[0]
      this.totalItems = data.value[1];
      this.loading = false;
    },
    updatePage(page) {
      this.page = page;
      this.fetchPresence();
    },
    updateOptions(options) {
      this.itemsPerPage = options.itemsPerPage;
      this.fetchPresence();
    },
    async exportData() {
      this.loading = true;
      let {
        status,
        data,
        error,
      } = await useApiService(`/presence/presenceDeMesCollaborateurs/export/${this.page}/${this.itemsPerPage}`, {
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
        link.download = "Historique-Recap-Presence " + DateTime.now().toFormat("dd-MM-yyyy HH-mm-ss") + ".xlsx";
        link.click();

      }
      this.loading = false;
    },
  },
  computed: {
    headers() {
      return [
        { title: "Collaborateur", value: "collab" },
        { title: "Date de présence", value: "datePres" },
        { title: "Heure de présence", value: "hdeb" },
        { title: "Temps de présence", value: "tempspres" },
        { title: "Créé par", value: "creePar" },
        { title: "Modifié par", value: "modifiePar" },
        { title: "Action", value: "action" },
      ];
    },
  },
  mounted() {
    this.fetchPresence()
  },
  watch: {
    filtering: {
      handler() {
        this.fetchPresence();
      },
      deep: true,
    },
  },
};
</script>