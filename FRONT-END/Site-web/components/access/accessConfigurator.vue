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
      <v-toolbar v-if="!edit" title="Créer un access" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un access" color="cyan-darken-1"></v-toolbar>
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

                  label="Nom du point"
                  required
                  :rules="[required]"
                  :loading="loading"
                  v-model="access.nompoint"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col
                cols="6"
                md="6"
                class="mt-n5"
              >
                <v-text-field

                  label="Localisation"
                  required
                  :rules="[required]"
                  :loading="loading"
                  v-model="access.location"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col
                md="4"
                class="mt-n5"
              >
                <v-select
                  variant="outlined"
                  label="Type point"
                  :items="['AP','Pointeuse']"
                  density="comfortable"
                  v-model="access.typePoint"
                  :rules="[required]"
                />
              </v-col>
              <v-col
                md='6'
                class="mt-n5"
              >
                <v-text-field

                  label="Adresse mac"
                  required
                  :rules="[required]"
                  :loading="loading"
                  v-model="access.macadress"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="mt-n5"
              >
                <v-switch color="success" label="Actif" inset v-model="access.active"></v-switch>
              </v-col>

              <template v-if="access.typePoint?.toUpperCase() === 'AP'">
                <v-col
                  cols="12"
                  md="6"
                  class="mt-n5"
                >
                  <v-autocomplete
                    variant="outlined"
                    chips
                    label="Collaborateurs autorisés"
                    :loading="loading"
                    :items="collabs"
                    item-title="nom"
                    clearable
                    :rules="[required]"
                    item-value="id"
                    v-model="access.collabAutorise"
                    multiple
                    density="comfortable"
                    return-object
                  >
                    <template v-slot:chip="{ item, index }">
                      <v-chip v-if="index < 2">
                        {{ item.raw.prenom + " " + item.raw.nom }}
                      </v-chip>
                      <v-chip v-if="index === 2">
                        (+{{ access.collabAutorise.length - 2 }} autres)
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
                    chips
                    label="Services autorisés"
                    :loading="loading"
                    :items="services"
                    item-title="nomservice"
                    clearable
                    :rules="[required]"
                    item-value="id"
                    v-model="access.serviceAutorise"
                    multiple
                    density="comfortable"
                    return-object
                  >
                    <template v-slot:chip="{ item, index }">
                      <v-chip v-if="index < 2">
                        {{ item.raw.nomservice }}
                      </v-chip>
                      <v-chip v-if="index === 2">
                        (+{{ access.serviceAutorise.length - 2 }} autres)
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  :md="this.$vuetify.display.mobile ? 12 : 6"
                >
                  <v-table
                    class="row-pointer"
                    :loading="loading"
                    overflow
                    v-if="access.collabAutorise.length > 0 "
                  >
                    <thead>
                    <tr>
                      <th>Identité</th>
                      <th class="text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="collab in access.collabAutorise">
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
                          @click="excludeCollab(collab.id)"

                        ></v-btn>
                      </td>
                    </tr>
                    </tbody>

                  </v-table>
                  <span v-else>Il n'y pas encore de collaborateur autorisé</span>
                </v-col>
                <v-col
                  cols="12"
                  :md="this.$vuetify.display.mobile ? 12 : 6"
                >
                  <v-table
                    class="row-pointer"
                    :loading="loading"
                    overflow
                    v-if="access.serviceAutorise.length > 0 "
                  >
                    <thead>
                    <tr>
                      <th>Nom service</th>
                      <th class="text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="service in access.serviceAutorise">
                      <td>{{ service.nomservice }}</td>
                      <td
                        class="text-right"
                      >
                        <v-btn
                          variant="text"
                          style="float: right"
                          class="align-center"
                          icon="mdi-delete-outline"
                          color="error"
                          @click="excludeSerivce(service.id)"

                        ></v-btn>
                      </td>
                    </tr>
                    </tbody>

                  </v-table>
                  <span v-else>Il n'y pas encore de service autorisé</span>
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

import { useApiService } from "~/services/apiServices";

export default {
  name: "serviceConfigurator",

  data() {
    return {
      form: false,
      modal: false,
      loading: false,
      access: {
        active: undefined,
        nompoint: undefined,
        location: undefined,
        typePoint: undefined,
        macadress: undefined,
        collabAutorise: [],
        serviceAutorise: [],
      },
      blankAccess: undefined,
    };
  },
  props: ["edit", "collabs", "services"],
  emits: ["add", "edit"],
  methods: {
    required(v) {
      return !!v || "Ce champ est requis";
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
      if (this.blankAccess) {
        this.access = this.blankAccess;
      } else {
        this.blankAccess = this.access;
      }
      console.log(this.edit,this.access)
      this.access = this.merge(this.edit, this.access);
      console.log(this.access)

    },
    exclude(id) {
      this.service.collabs = this.service.collabs.filter((c) => c.id !== id);
    },
    async save() {
      if (!this.form) return;
      this.loading = true;
      if (!this.edit) {
        let { data: tdata, status: status } = await useApiService("/access/creerAccess", {
          method: "post",
          body: this.access,
          watch: false,
        }, true, true, "Ajout");
        if (status.value === "success") {
          this.$emit("add", tdata.value);
          this.modal = false;
        }
      } else {
        let {
          data: tdata,
          status: status,
        } = await useApiService(`/access/modifierAccess/${this.edit.id}`, {
          method: "put",
          body: this.access,
          watch: false,
        }, true, true, "Modification");
        if (status.value === "success") {
          this.$emit("edit", tdata.value);
          this.modal = false;
        }
      }

      this.loading = false;
    },
    excludeCollab(id) {
      this.access.collabAutorise = this.access.collabAutorise.filter((c) => c.id !== id);
    },
    excludeSerivce(id) {
      this.access.serviceAutorise = this.access.serviceAutorise.filter((c) => c.id !== id);
    },
  },
};

</script>