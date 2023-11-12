<template>
  <v-row class="mt-1 ml-1 mr-1">
    <v-col v-if="stats" md="4" v-for="(item, i) in stats" :key="i">
      <v-card color="primary">
        <v-card-title>
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-card-title>
        <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
      </v-card>
    </v-col>
    <v-divider></v-divider>
    <v-divider></v-divider>
    <v-divider></v-divider>
    <v-divider></v-divider>
    <v-col md="12">
      <v-card v-if="user" color="primary" class="mt-2 mb-2" :title="`Bienvenue ${user.prenom}`" variant="tonal">
        <v-card-text v-if="user.grade === 'collab'">
          En tant que collaborateur et chef de service, vous pouvez ici visualiser les demandes de vos collaborateurs,
          les visualiser,
          et suivre leurs présence dans les locaux. <br>
          En cas de nouvelle demande, vous les verrez apparaître des notifications ci dessous
        </v-card-text>
        <v-card-text v-else>
          En tant que RH , vous pouvez ici visualiser les collaborateurs, ainsi que leurs demande, vous pouvez les
          modifier
          et suivre leurs présence dans les locaux. <br>
          Par ailleurs, il vous ai aussi possible de modifier l'ensemble des accès <br>
        </v-card-text>
      </v-card>
    </v-col>
    <v-divider></v-divider>
    <v-divider></v-divider>
    <v-divider></v-divider>
    <v-divider></v-divider>
  </v-row>
</template>

<script>
import { useGlobalStore } from "~/services/globalStore";
import { useApiService } from "~/services/apiServices";

export default {
  async created() {
    useGlobalStore().getUserInfo().then(tuser=>{
      this.user = tuser
    });
    useApiService("/access/stats", { method: "get" }, true, false).then(({data:tstats})=>{
      this.stats = tstats
    })
  },
  data(){
    return{
      stats:undefined,
      user:undefined
    }
  }
};
</script>
  