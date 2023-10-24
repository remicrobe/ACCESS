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
                return-object
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
                label="Type absence"
                :items="['conges','maladie','autre']"
                density="comfortable"
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
                type="date"
                v-model="demande.debut"
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
                type="date"
                v-model="demande.fin"
              />
            </v-col>


            <v-col
              cols="12"
              md="12"
              class="mt-n5"
            >
              <v-text-field

                label="Raison demande (facultatif)"
                required
                :loading="loading"
                variant="outlined"
              />
            </v-col>

          </v-row>
          <v-alert v-if="!(checkDate()===true)" :text="checkDate()" type="warning"></v-alert>
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
  name: "collabDemandeConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
      demande:{
        debut: undefined,
        fin: undefined
      }
    };
  },
  props: ["edit"],
  methods:{
    checkDate(){
      if (this.demande.debut && this.demande.fin) {
        if (new Date(this.demande.fin) >= new Date(this.demande.debut)) {
          return true;
        } else {
          return 'La date de fin doit être plus récente que la date de début';
        }
      } else {
        return 'Vous devez saisir une date de début et une date de fin';
      }
    },

  }
}

</script>