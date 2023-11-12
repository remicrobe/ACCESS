<template>
  <div class="text-center" v-if="notifications">
    <v-menu
      v-model="drawer"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <v-btn class="text-none" stacked v-bind="props">
          <v-badge :content="notifications.length" :color="notifications.length > 0 ? 'error' : ''">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            title="Vos notifications"
          />
        </v-list>

        <v-divider></v-divider>

        <v-list-item
          v-if="notifications.length > 0"
          v-for="notification in notifications"
          :key="notification.id"
          :title="notification.title"
          lines="two"
          :subtitle="notification.subtitle"
          @click="$router.push(notification.link)"
        >
        </v-list-item>

        <v-list-item
          v-else
          title="Vous n'avez aucune notification a traité">
        </v-list-item>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="text"
            color="error"
            @click="drawer = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { useApiService } from "~/services/apiServices";

export default {
  setup() {
    let { data: notifications } = useApiService("/access/notifications", { method: "get" }, true, false);
    return { notifications };
  },
  data() {
    return {
      drawer: false,
    };
  },
  mounted() {
    watch(() => this.$route, async (to, from) => {
      let { data } = await useApiService("/access/notifications", { method: "get" }, true, false);
      this.notifications = data.value;
    }, { deep: true });
  },
};
</script>
