<template>
  <v-dialog
    v-model="modal"
    max-width="900px"
    :persistent="true"
    :scrollable="true"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        style="float: right"
        class="align-center"
        icon="mdi-refresh"
        size="small"
        v-bind="props"
        variant="text"
        color="error"
      ></v-btn>
    </template>

    <v-card>
      <v-toolbar title="Attention !" color="error"></v-toolbar>

      <v-card-text>
        <v-container>
          <span> Vous êtes sur le point d'invalider la carte d'accès de l'utilisateur,
            cette opération n'as pas de retour en arrière possible</span>

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
          @click="validate"
          :loading="loading"
        >
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { useApiService } from "~/services/apiServices";

export default {
  name: "collabRefreshCard",

  data() {
    return {
      modal: false,
      loading: false,
      hModel: null
    };
  },
  methods:{
    async validate(){
      this.loading = true
      await useApiService(`/token/genererCarteQrCode/${this.collabID}`,{method:"post"},true,true)
      this.loading = false
      this.modal = false
    }
  },
  props: ["collabID"]
}

</script>