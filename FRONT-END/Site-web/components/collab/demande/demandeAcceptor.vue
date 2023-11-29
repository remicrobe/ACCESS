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
        icon="mdi-hand-okay"
        size="small"
        v-bind="props"
        variant="text"
        color="warning"
      />
    </template>

    <v-card>
      <v-toolbar title="Attention !" color="error"></v-toolbar>

      <v-card-text>
        <v-container>
          <span> Vous êtes sur le point d'accepter ou de refuser l'absence de
            {{ `${demande.collab.prenom} ${demande.collab.nom} du
                ${new Date(demande.datedeb).toLocaleString()} au
                ${new Date(demande.datefin).toLocaleString()}` }}
          </span>

        </v-container>
      </v-card-text>
      <v-card-actions class="mt-n5">

        <v-btn
          color="warning"
          variant="text"
          @click="modal = !modal"
          :disabled="loading"
          :loading="loading"
        >
          Annuler
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="outlined"
          @click="validate(false)"
          :disabled="loading"
          :loading="loading"
        >
          Refuser
        </v-btn>

        <v-btn
          color="success"
          variant="outlined"
          @click="validate(true)"
          :loading="loading"
        >
          Accepter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { useApiService } from "~/services/apiServices";

export default {
  name: "demandeAcceptor",

  data() {
    return {
      modal: false,
      loading: false,
      hModel: null
    };
  },
  methods:{
    async validate(bool){
      this.loading = true
      let {data,status} = await useApiService(`/absence/accepterAbsence/${this.demande.id}`,{method:"put",body:{reponse:bool}},true,true,'')
      if(status.value === 'success') this.$emit("edit",data.value)
      this.loading = false
      this.modal = false
    }
  },
  props: ["demande"],
  emits: ['edit']
}

</script>
