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
      <v-toolbar v-if="!edit" title="Créer une présence" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier une présence" color="cyan-darken-1"></v-toolbar>

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
                v-model="presence.idCollab"
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
              sm="6"
              md="6"
              class="mt-n5"
            >
              <v-text-field
                clearable
                variant="outlined"
                label="Date présence"
                :loading="loading"
                type="date"
                v-model="presence.datePres"
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
                label="Heure début"
                :loading="loading"
                type="time"
                step="2"
                v-model="presence.hdeb"
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
                label="Heure fin"
                :loading="loading"
                type="time"
                step="2"
                v-model="presence.hfin"
              />
            </v-col>


            <v-col
              cols="12"
              md="12"
              class="mt-n5"
            >
              <v-text-field

                label="Raison de la création / modification"
                required
                :loading="loading"
                variant="outlined"
                v-model="presence.desc"
              />
            </v-col>

          </v-row>
          <v-alert v-if="!(checkTime()===true)" :text="checkTime()" color="orange-darken-3" type="warning"></v-alert>
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
          :disabled="!(checkTime()===true)"
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
  data() {
    return {
      modal: false,
      loading: false,
      presence: {
        idCollab : undefined,
        datePres : undefined,
        hdeb : undefined,
        hfin : undefined,
        desc : undefined,
        id : undefined
      },
      blankPresence: undefined,
    };
  },
  props: ["edit",'collabs'],
  emits: ["add", "edit"],
  methods: {
    checkTime() {
      if (this.presence.hdeb && this.presence.hfin) {
        if (DateTime.fromFormat(this.presence.hfin, "HH:mm:ss").toJSDate() >= DateTime.fromFormat(this.presence.hdeb, "HH:mm:ss").toJSDate()) {
          return true;
        } else {
          return "L'heure de début doit être inférieur a l'heure de fin";
        }
      } else {
        return "Vous devez saisir une heure de début et une heure de fin";
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
      if(this.edit) {
        this.presence = this.merge(this.presence, this.edit);
        this.presence.idCollab = this.edit.collab.id
      }
    },
    async save() {
      this.loading = true;
      let data;
      if (!this.edit) {
        let { data: tdata, status: status } = await useApiService(`/presence/ajouterPresenceCollab/`, {
          method: "post",
          body: this.presence,
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
        } = await useApiService(`/presence/modifierPresenceCollab/${this.presence.id}`, {
          method: "put",
          body: this.presence,
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