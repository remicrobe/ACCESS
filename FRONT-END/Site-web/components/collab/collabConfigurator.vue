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
      <v-toolbar v-if="!edit" title="Créer un collaborateur" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un collaborateur" color="cyan-darken-1"></v-toolbar>

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
                required
                :loading="loading"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
              class="mt-n5"
            >
              <v-text-field

                label="Nom"
                required
                :loading="loading"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="mt-n5"
            >
              <v-text-field

                label="Email"
                required
                :loading="loading"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              class="mt-n5"
              sm="3"
            >
              <v-text-field
                label="Description poste"
                required
                :loading="loading"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
              class="mt-n5"
            >
              <v-select
                variant="outlined"
                label="Type collaborateur"
                :items="['DRH','RH','ARH','COLLAB']"
                density="comfortable"
              />
            </v-col>


            <v-col
              cols="12"
              md="5"
              class="mt-n5"
            >
              <v-autocomplete
                variant="outlined"
                label="Services"
                return-object
                density="comfortable"
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
  name: "collabConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
    };
  },
  props: ["edit"]
}

</script>