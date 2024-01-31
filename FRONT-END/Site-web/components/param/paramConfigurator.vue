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
        variant="text"
        color="secondary"
        @click="openModal"
      ></v-btn>
    </template>
    <template v-else v-slot:activator="{ props }">
      <v-btn
        variant="text"
        style="float: right"
        class="align-center"
        icon="mdi-pencil"
        color="cyan-darken-1"
        @click="openModal"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar v-if="!edit" title="Créer un service" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un service" color="cyan-darken-1"></v-toolbar>
      <v-form v-model="form" @submit.prevent="save">
        <v-card-text>
          <v-container>
            <v-row>

              <v-col
                cols="6"
                md="6"
                class="mt-n5"
              >
                <v-text-field

                  label="Nom paramètre"
                  :rules="[required]"
                  :loading="loading"
                  v-model="param.viewName"
                  variant="outlined"
                  density="compact"
                  disabled="true"
                  readonly="true"
                />
              </v-col>
              <v-col
                cols="6"
                md="6"
                class="mt-n5"
              >
                <v-text-field

                  label="Valeur"
                  :rules="[required]"
                  :loading="loading"
                  v-model="param.value"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
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

import { useApiService } from "~/services/apiServices";

export default {
  name: "serviceConfigurator",

  data() {
    return {
      form: false,
      modal: false,
      loading: false,
      param: {
        viewName: undefined,
        value: undefined,
        uniqueName: undefined
      },
    };
  },
  props: ["edit"],
  emits: ["edit"],
  methods: {
    required(v) {
      return !!v || "Ce champ est requis";
    },
    openModal() {
      this.modal = true;
      if (this.edit) {
        this.param = { ...this.edit };
      }
    },
    async save() {
      if (!this.form) return;
      this.loading = true;
      if (!this.edit) {
        // For later ....
      } else {
        let {
          data: tdata,
          status: status,
        } = await useApiService(`/param/modifierParam/${this.param.uniqueName}`, {
          method: "put",
          body: this.param,
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