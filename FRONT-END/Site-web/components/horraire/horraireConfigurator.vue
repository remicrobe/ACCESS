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
      <v-toolbar v-if="!edit" title="Créer un modèle" color="success"></v-toolbar>
      <v-toolbar v-else title="Modifier un modèle" color="cyan-darken-1"></v-toolbar>

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
              />
            </v-col>

            <template v-if="hModel === null" v-for="day in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']">
              <v-col
                cols="12"
                sm="3"
                class="mt-n5"
              >
                <v-text-field
                  variant="outlined"
                  :label="'Heure de début ' + day"
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
  name: "horraireConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
      hModel: null
    };
  },
  props: ["edit"]
}

</script>