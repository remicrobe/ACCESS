
<template>
  <v-dialog v-model="modal" fullscreen>
    <template v-slot:activator="{ props }">
      <v-btn
        variant="text"
        style="float: right"
        class="align-center"
        icon="mdi-printer"
        color="purple"
        @click="openModal"
      >
      </v-btn>
    </template>
    <v-toolbar
      dark
      color="primary"
    >
      <v-btn
        icon
        color="error"
        @click="modal = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Carte d'accès au format PDF</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card>
      <iframe :src="pdfUrl" style="width:100%; height:100%;"></iframe>
    </v-card>
  </v-dialog>
</template>

<script>

import { useApiService } from "~/services/apiServices";

export default {
  name: "collabConfigurator",

  data() {
    return {
      modal: false,
      loading: false,
      hModel: null,
      pdfurl: null
    };
  },
  methods:{
    async openModal(){
      let {data} = await useApiService(`/token/genererPDFCarteQrCode/${this.collabsID}`,{method:"GET"},true,false)
      let pdfUrl = URL.createObjectURL(data.value);
      // Attribuer l'URL à une variable de données pour l'utiliser dans le template
      this.pdfUrl = pdfUrl;
      this.modal = !this.modal
    }
  },
  props: ["collabsID"]
}

</script>