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
        v-bind="props"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar v-if="!edit" title="Créer un service" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un service" color="cyan-darken-1"></v-toolbar>

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
                :loading="loading"
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
                density="compact"
                item-title="name"
                multiple
                :loading="loading"
                return-object
              >
                <template v-slot:chip="{ item, index }">
                  <v-chip v-if="index < 4">
                    {{ item.title }}
                  </v-chip>
                  <v-chip v-if="index === 4">
                    (+{{ collabInService.length - 4 }} autres)
                  </v-chip>
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
                label="Chef de service"
                density="compact"
                item-title="name"
                :loading="loading"
                return-object
              />
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
                v-if="collabInService.length > 0 "
              >
                <thead>
                <tr>
                  <th>Magasins</th>
                  <th>CP</th>
                  <th>Ville</th>
                  <th>Pays</th>
                  <th class="text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="mag in collabInService">
                  <td>{{ mag.nom }}</td>
                  <td>{{ mag.cp }}</td>
                  <td>{{ mag.ville }}</td>
                  <td>{{ mag.pays }}</td>
                  <td
                    class="text-right"
                  >
                    <v-btn
                      variant="text"
                      style="float: right"
                      class="align-center"
                      icon="mdi-delete-outline"
                      color="error"

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

export default {
  name: "serviceConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
      collabInService:[],
    };
  },
  props: ["edit"],
}

</script>