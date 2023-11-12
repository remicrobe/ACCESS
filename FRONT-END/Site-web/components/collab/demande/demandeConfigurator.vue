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
        @click="openModal"
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
        @click="openModal"
        color="cyan-darken-1"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar v-if="!edit" title="Créer une demande" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier une demande" color="cyan-darken-1"></v-toolbar>

      <v-card-text>
        <v-container>
          <v-row>

            <v-col
              cols="12"
              md="6"
              class="mt-n5"
            >
              <v-autocomplete
                variant="outlined"
                label="Collaborateur"
                :loading="loading"
                :items="collabs"
                item-title="nom"
                clearable
                :disabled="!!edit"
                item-value="id"
                v-model="demande.collab.id"
                density="comfortable"
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.raw.prenom + ' ' + item.raw.nom "
                  ></v-chip>
                </template>
                <template v-slot:item="{ props, item }">

                  <v-list-item
                    v-bind="props"
                    :title="item.raw.prenom + ' ' + item.raw.nom"
                    :subtitle="item.raw.service ? item.raw.service.nomservice : 'Aucun service'"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col
              cols="12"
              md="6"
              class="mt-n5"
            >
              <v-select
                variant="outlined"
                label="Type absence"
                :items="['conge','maladie','autre']"
                density="comfortable"
                v-model="demande.raison"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="6"
              class="mt-n5"
            >
              <v-text-field
                clearable
                variant="outlined"
                label="Date début"
                :loading="loading"
                type="datetime-local"
                v-model="demande.datedeb"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="6"
              class="mt-n5"
            >
              <v-text-field
                clearable
                variant="outlined"
                label="Date fin"
                :loading="loading"
                type="datetime-local"
                v-model="demande.datefin"
              />
            </v-col>


            <v-col
              cols="12"
              md="12"
              class="mt-n5"
            >
              <v-text-field

                label="Raison demande"
                required
                :loading="loading"
                variant="outlined"
                v-model="demande.description"
              />
            </v-col>

          </v-row>
          <v-alert v-if="!(checkDate()===true)" :text="checkDate()" color="orange-darken-3" type="warning"></v-alert>
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
          :disabled="!(checkDate()===true)"
          @click="save"
          :loading="loading"
        >
          Sauvegarder
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { useApiService } from "~/services/apiServices";
import { DateTime } from "luxon";

export default {
  name: "collabDemandeConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
      demande: {
          datedeb: undefined,
          datefin: undefined,
          description: undefined,
          id: undefined,
          raison: undefined,
        collab: {
          id: undefined,
        },
      },
      blankDemande: undefined,
    };
  },
  props: ["edit",'collabs'],
  emits: ["add", "edit"],
  methods: {
    checkDate() {
      if (this.demande.datedeb && this.demande.datefin) {
        if (new Date(this.demande.datefin) >= new Date(this.demande.datedeb)) {
          return true;
        } else {
          return "La date de fin doit être plus récente que la date de début";
        }
      } else {
        return "Vous devez saisir une date de début et une date de fin";
      }
    },
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
    openModal() {
      this.modal = true;
      if(this.blankDemande){
        this.demande = this.blankDemande
      }else{
        this.blankDemande = this.demande
      }
      if(this.edit){
        this.demande =  this.merge(this.demande,this.edit)
        this.demande.collab.id = this.edit.collab.id
        if(this.demande.datedeb){
          this.demande.datedeb = DateTime.fromISO(this.demande.datedeb).toFormat('yyyy-MM-dd HH:mm:ss')
        }
        if(this.demande.datefin){
          this.demande.datefin = DateTime.fromISO(this.demande.datefin).toFormat('yyyy-MM-dd HH:mm:ss')
        }
      }
    },
    async save() {
      this.loading = true;
      let data;
      if (!this.edit) {
        let { data: tdata, status: status } = await useApiService(`/absence/creerUneAbsence/${this.demande.collab.id}}`, {
          method: "post",
          body: this.demande,
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
        } = await useApiService(`/absence/modifierAbsence/${this.demande.id}`, {
          method: "put",
          body: this.demande,
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
};

</script>