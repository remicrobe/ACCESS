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
                cols="12"
                md="12"
                class="mt-n5"
              >
                <v-text-field

                  label="Nom service"
                  required
                  :rules="[required]"
                  :loading="loading"
                  v-model="service.nomservice"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                class="mt-n5"
              >
                <v-autocomplete
                  variant="outlined"
                  chips
                  label="Collaborateurs dans le service"
                  :loading="loading"
                  :items="collabs"
                  item-title="nom"
                  :rules="[required]"
                  item-value="id"
                  v-model="service.collabs"
                  multiple
                  density="comfortable"
                  return-object
                >
                  <template v-slot:chip="{ item, index }">
                    <v-chip v-if="index < 2">
                      {{ item.raw.prenom + " " + item.raw.nom }}
                    </v-chip>
                    <v-chip v-if="index === 2">
                      (+{{ service.collabs.length - 2 }} autres)
                    </v-chip>
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
                md="6"
                class="mt-n5"
              >
                <v-autocomplete
                  variant="outlined"
                  label="Chef de service"
                  :loading="loading"
                  :items="service.collabs"
                  item-title="nom"
                  :rules="[required]"
                  item-value="id"
                  v-model="service.chefservice.id"
                  density="comfortable"
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      :text="item.raw.prenom + ' ' + item.raw.nom + ' '"
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
                md="12"
              >
                <v-table
                  class="row-pointer"
                  loading-text="Chargement des commentaires..."
                  :loading="loading"
                  overflow
                  v-if="service.collabs.length > 0 "
                >
                  <thead>
                  <tr>
                    <th>Identité</th>
                    <th class="text-right">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="collab in service.collabs">
                    <td>{{ collab.nom + ' ' + collab.prenom  }}</td>
                    <td
                      class="text-right"
                    >
                      <v-btn
                        variant="text"
                        style="float: right"
                        class="align-center"
                        icon="mdi-delete-outline"
                        color="error"
                        @click="exclude(collab.id)"

                      ></v-btn>
                    </td>
                  </tr>
                  </tbody>

                </v-table>
                <span v-else>Il n'y pas encore de collaborateur dans ce service</span>
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
      service: {
        id: undefined,
        nomservice: undefined,
        chefservice: {
          id: undefined,
        },
        collabs: [],
      },
    };
  },
  props: ["edit", "collabs"],
  emits: ["add", "edit", "exclude", "include"],
  methods: {
    required(v) {
      return !!v || "Ce champ est requis";
    },
    openModal() {
      this.modal = true;
      if (this.edit) {
        this.service = { ...this.edit };
      }
    },
    exclude(id) {
      if(id === this.service.chefservice.id){
        useNuxtApp().$toast(`Vous ne pouvez pas supprimer le chef de service du groupe`, {
          type: 'error',
          hideProgressBar: true
        });
      }else{
        let index = this.service.collabs.findIndex((c)=> c.id === id)
        this.$emit("exclude", this.service.collabs[index]);
        this.service.collabs.splice(index, 1);
      }

    },
    async save() {
      if (!this.form) return;
      if(!this.service.chefservice.id) return;
      this.loading = true;
      if (!this.edit) {
        let { data: tdata, status: status } = await useApiService("/service/creerService", {
          method: "post",
          body: this.service,
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
        } = await useApiService(`/service/modifierService/${this.service.id}`, {
          method: "put",
          body: this.service,
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
  watch: {
    "service.collabs"(o, n) {
      if (!this.service.collabs.some((c) => c.id === this.service.chefservice.id)) {
        this.service.chefservice.id = undefined;
      }
    },
  },
};

</script>