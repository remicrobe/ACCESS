<template>
  <v-dialog
    v-model="modal"
    max-width="900px"
    :persistent="true"
    :scrollable="true"
  >
    <template v-if="!edit" v-slot:activator="{ props }">
      <v-btn
        style="float: right"
        class="align-center"
        icon="mdi-plus"
        size="small"
        @click="open"
        variant="text"
        color="secondary"
      ></v-btn>
    </template>
    <template v-else v-slot:activator="{ props }">
      <v-btn
        variant="text"
        style="float: right"
        class="align-center"
        icon="mdi-pencil"
        color="cyan-darken-1"
        v-bind="props"
        @click="open"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar v-if="!edit" title="Créer un collaborateur" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un collaborateur" color="cyan-darken-1"></v-toolbar>
      <v-form
        v-model="form"
        @submit.prevent="saveCollab"
      >
        <v-card-text>

          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="3"
                class="mt-n5"
              >
                <v-text-field
                  label="Prénom"
                  :rules=[required]
                  :loading="loading"
                  variant="outlined"
                  v-model="collabInfo.prenom"
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
                class="mt-n5"
              >
                <v-text-field

                  label="Nom"
                  :rules=[required]
                  :loading="loading"
                  variant="outlined"
                  v-model="collabInfo.nom"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="mt-n5"
              >
                <v-text-field

                  label="Email"
                  :rules=[required]
                  :loading="loading"
                  variant="outlined"
                  v-model="collabInfo.mail"
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="mt-n5"
              >
                <v-switch color="success" label="Actif" inset v-model="collabInfo.actif"></v-switch>
              </v-col>

              <v-col
                cols="12"
                class="mt-n5"
                sm="3"
              >
                <v-text-field
                  label="Description poste"
                  :rules=[required]
                  :loading="loading"
                  variant="outlined"
                  v-model="collabInfo.fonction"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="mt-n5"
              >
                <v-select
                  variant="outlined"
                  :loading="loading"
                  :rules=[required]
                  label="Type collaborateur"
                  :items="['DRH','RH','ARH','COLLAB']"
                  density="comfortable"
                  v-model="collabInfo.grade"
                  :disabled="!useGlobalStore().isRH"
                />
              </v-col>


              <v-col
                cols="12"
                md="5"
                class="mt-n5"
              >
                <v-autocomplete
                  variant="outlined"
                  label="Service"
                  :loading="loading"
                  :items="services"
                  :disabled="!useGlobalStore().isRH"
                  item-title="nomservice"
                  clearable
                  item-value="id"
                  v-model="collabInfo.service.id"
                  density="comfortable"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="mt-n5"
              >
                <v-select
                  variant="outlined"
                  :loading="loading"
                  label="Modèle d'horraire"
                  :items=modele
                  item-title="nom"
                  item-value="id"
                  v-model="collabInfo.horairesdefault.id"
                  density="comfortable"
                  clearable
                />
              </v-col>
              <template v-if="collabInfo.horairesdefault.id === null"
                        v-for="day in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']">
                <v-col
                  cols="12"
                  sm="3"
                  class="mt-n5"
                >
                  <v-text-field
                    :loading="loading"
                    variant="outlined"
                    :label="'Heure de début ' + day"
                    density="comfortable"
                    v-model="collabInfo.horaire['hDeb' + day]"
                    type="time"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  class="mt-n5"
                >
                  <v-text-field
                    :loading="loading"
                    variant="outlined"
                    :label="'Heure de fin ' + day"
                    density="comfortable"
                    v-model="collabInfo.horaire['hFin' + day]"
                    type="time"
                  />
                </v-col>
              </template>
            </v-row>


          </v-container>

        </v-card-text>
        <v-card-actions class="mt-n5">

          <v-btn
            color="error"
            variant="text"
            @click="modal = !modal"
            :disabled="loading"
            :loading="loading"
          >
            Fermer
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="text"
            :loading="loading"
            type="submit"
          >
            Sauvegarder
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>

import { useApiService } from "~/services/apiServices";
import { useGlobalStore } from "~/services/globalStore";

export default {
  name: "collabConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
      form: false,
      hModel: null,
      collabInfo: {
        id: undefined,
        actif: false,
        fonction: "",
        grade: "COLLAB",
        horaire: {
          hDebDimanche: undefined,
          hDebJeudi: undefined,
          hDebLundi: undefined,
          hDebMardi: undefined,
          hDebMercredi: undefined,
          hDebSamedi: undefined,
          hDebVendredi: undefined,
          hFinDimanche: undefined,
          hFinJeudi: undefined,
          hFinLundi: undefined,
          hFinMardi: undefined,
          hFinMercredi: undefined,
          hFinSamedi: undefined,
          hFinVendredi: undefined,
        },
        horairesdefault: {
          id: null,
        },
        mail: "",
        nom: "",
        prenom: "",
        service: {
          id: null,
        },
      },
    };
  },
  methods: {
    useGlobalStore,
    required(v) {
      return !!v || "Ce champ est requis";
    },
    open() {
      this.modal = true;
      this.collabInfo = this.merge(this.edit, this.collabInfo);
      console.log(this.collabInfo);
    },
    // Méthode très utile permettant de fusionner les deux objets
    merge(obj1, obj2) {
      let answer = {};
      for (const key in obj1) {
        if (answer[key] === undefined || answer[key] === null)
          answer[key] = obj1[key];
      }
      for (const key in obj2) {
        if (answer[key] === undefined || answer[key] === null)
          answer[key] = obj2[key];
      }
      return answer;
    },
    async saveCollab() {
      if (!this.form) return;
      this.loading = true;

      let collab2send = {...this.collabInfo}

      if(collab2send.horairesdefault.id !== null){
        collab2send.horaire = null;
      }

      if (!this.edit) {
        let { data: tdata, status: status } = await useApiService("/collab/creerCollab", {
          method: "post",
          body: collab2send,
          watch: false,
        }, true, true, "Modification");
        if (status.value === "success") {
          this.$emit("add", tdata.value);
          this.modal = false;
        }
      } else {
        let {
          data: tdata,
          status: status,
        } = await useApiService(`/collab/modifierCollab/${collab2send.id}`, {
          method: "put",
          body: collab2send,
          watch: false,
        }, true, true, "Modification");
        if (status.value === "success") {
          this.$emit("edit", tdata.value);
          this.modal = false;
        }
      }

      this.loading = false;
    },
  },
  props: ["edit", "services", "modele"],
  emits: ["add", "edit"],
};

</script>