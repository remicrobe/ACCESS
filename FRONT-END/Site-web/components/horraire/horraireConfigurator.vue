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
        v-bind="props"
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
        @click="openDialog"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar v-if="!edit" title="Créer un modèle" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un modèle" color="cyan-darken-1"></v-toolbar>
      <v-form v-model="form" @submit.prevent="save">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="6"
                class="mt-n5"
              >
                <v-text-field

                  label="Nom du modêle"
                  required
                  :loading="loading"
                  variant="outlined"
                  :rules="[required]"
                  v-model="hModel.nom"
                />
              </v-col>

              <template v-for="day in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']">
                <v-col
                  cols="12"
                  sm="3"
                  class="mt-n5"
                >
                  <v-text-field
                    variant="outlined"
                    :label="'Heure de début ' + day"
                    v-model="hModel['hDeb' + day]"
                    :rules="[required]"
                    density="comfortable"
                    type="time"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  class="mt-n5"
                >
                  <v-text-field
                    variant="outlined"
                    :label="'Heure de fin ' + day"
                    v-model="hModel['hFin' + day]"
                    :rules="[required]"
                    density="comfortable"
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
            type="submit"
            :loading="loading"
          >
            Sauvegarder
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>

import { useGlobalStore } from "~/services/globalStore";
import { th } from "vuetify/locale";
import { useApiService } from "~/services/apiServices";

export default {
  name: "horraireConfigurator",

  data() {
    return {
      form: false,
      modal: false,
      loading: false,
      hModel: {
        id: undefined,
        nom: undefined,
        hDebLundi: undefined,
        hFinLundi: undefined,
        hDebMardi: undefined,
        hFinMardi: undefined,
        hDebMercredi: undefined,
        hFinMercredi: undefined,
        hDebJeudi: undefined,
        hFinJeudi: undefined,
        hDebVendredi: undefined,
        hFinVendredi: undefined,
        hDebSamedi: undefined,
        hFinSamedi: undefined,
        hDebDimanche: undefined,
        hFinDimanche: undefined,
      },
    };
  },
  methods: {
    required(v) {
      return !!v || "Ce champ est requis";
    },
    openDialog() {
      if (this.edit) {
        this.hModel = this.merge(this.hModel, this.edit);
      }
      this.modal = true;
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
    async save() {
      if (!this.form) return;
      this.loading = true;
      if (!this.edit) {
        let { data: tdata, status: status } = await useApiService("/modele-horaire/", {
          method: "post",
          body: this.hModel,
          watch: false,
        }, true, true, "Modification");
        if (status.value === "success") {
          this.$emit("add", tdata.value);
          this.modal = false;
        }
      } else {
        let { data: tdata, status: status } = await useApiService(`/modele-horaire/${this.hModel.id}`, {
          method: "put",
          body: this.hModel,
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
  props: ["edit"],
  emits: ["add", "edit"],
};

</script>