<template>
    <v-row class="mt-1 ml-1 mr-1">
        <v-col md="12">
            <v-card class="mx-auto">
                <v-toolbar class="pt-n5" :title="'Gérer les incident du personnel' " color="primary">
                </v-toolbar>
                <v-card-text style="overflow: auto">
                    <v-row >
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
                        items-per-page-text="Nombre d'incident par page"
                        :items-length="totalItems"
                        :headers="headers"
                        :items="incident"
                        @update:page="updatePage"
                        @update:options="updateOptions"
                        :items-per-page-options="[{value:5, title:'5'},{value:10, title:'10'}]"
                    >
                        <template v-slot:item.collab="{ item }">
                            <v-chip v-if="item.collab" color="blue" dark>{{ item.collab.prenom }}
                                {{ item.collab.nom.toUpperCase() }}
                            </v-chip>
                            <span v-else>Erreur</span>
                        </template>

                        <template v-slot:item.dateIncident="{ item }">
                            <v-chip v-if="item.collab" color="success" dark>
                                {{ new Date(item.dateIncident).toLocaleDateString() }}
                            </v-chip>
                        </template>

                        <template v-slot:item.ouvert="{ item }">
                            <v-icon v-if="item.ouvert === false" color="success">mdi-check-bold</v-icon>
                            <v-icon v-else-if="item.ouvert === true" color="error">mdi-alert-circle</v-icon>
                            <v-icon v-else color="warning">mdi-alert-circle</v-icon>
                        </template>

                        <template v-slot:item.reponse="{ item }">
                            <v-chip v-if="item.collab" color="success" dark>
                                {{ item.reponse.length }}
                            </v-chip>
                        </template>

                        <template v-slot:item.action="{ item }">
                            <v-btn
                                :to="`incident/${item.id}`"
                                icon="mdi-eye"
                            ></v-btn>
                        </template>
                    </v-data-table-server>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>


<script>
import {useApiService} from "~/services/apiServices";
import {DateTime, Interval} from "luxon";

export default {
    setup() {
        let {data: collabs} = useApiService("/collab/infoCollabSousControl", {method: "get", watch: false}, true);


        return {collabs};
    },
    data() {
        return {
            incident: [],
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
        add(pres) {
            console.log(pres);
            this.incident.push(pres);
        },
        edit(pres) {
            this.incident[this.incident.findIndex((p) => p.id === pres.id)] = pres;
        },
        getTimePres(hdeb, hfin) {

            let diff = Interval.fromDateTimes(DateTime.fromFormat(hdeb, "HH:mm:ss"), DateTime.fromFormat(hfin, "HH:mm:ss")).length('minutes');
            const hours = Math.floor(diff / 60);
            const minutes = Math.floor(diff % 60);

            return `${hours} H ${minutes.toString().padStart(2, "0")}`;
        },
        async fetchPresence() {
            this.loading = true;
            const {data} = await useApiService(`/incident/incidentDeMesCollaborateurs/${this.page}/${this.itemsPerPage}`, {
                params: {
                    filtering: this.filtering,
                },
                watch: false
            });
            this.incident = data.value[0];
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
            } = await useApiService(`/incident/incidentDeMesCollaborateurs/export/${this.page}/${this.itemsPerPage}`, {
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
                link.download = "Historique-Recap-Incident " + DateTime.now().toFormat("dd-MM-yyyy HH-mm-ss") + ".xlsx";
                link.click();

            }
            this.loading = false;
        },
    },
    computed: {
        headers() {
            return [
                {title: "Collaborateur", value: "collab"},
                {title: "Date incident", value: "dateIncident"},
                {title: "Résolu", value: "ouvert"},
                {title: "Créé par", value: "creePar"},
                {title: "Nombre de réponse", value: "reponse"},
                {title: "Action", value: "action", align: 'end'},
            ];
        },
    },
    mounted() {
        this.fetchPresence();
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
