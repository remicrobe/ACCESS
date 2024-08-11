<template>
    <v-app>
        <v-navigation-drawer color="primary" app v-model="drawer" v-if="!isLoginPage">
            <v-list>
                <v-list-item
                    v-if="user"
                    :title="user.nom + ' ' + user.prenom"
                    :subtitle="user.fonction"
                >
                    <template #prepend>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card
                                v-bind="props"
                                variant="text"
                                class="mr-2"
                            >
                                <v-avatar
                                    rounded="0"
                                >
                                    <v-img v-if="!isHovering" cover src="./default.png"></v-img>
                                    <v-img @click="console.log('upload')" v-else cover src="./upload.png"></v-img>
                                </v-avatar>
                            </v-card>
                        </v-hover>

                    </template>
                </v-list-item>
                <v-list-item @click="disconnect" v-if="!isPrivacyPage && !isLoginPage" title="Se déconnecter" append-icon="mdi-login"/>

                <v-divider></v-divider>

                <template v-for="route in routes">
                    <v-list-item
                        v-if="route.grade.includes('*') || user && route.grade.includes(user.grade)"
                        :to="route.route"
                        :title="route.title"
                        :append-icon="route.icon"/>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar color="primary" :elevation="1" app v-if="!isLoginPage">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{ "AccessLink > " + currentRouteTitle }}</v-toolbar-title>
            <notification></notification>
        </v-app-bar>

        <v-main>
            <slot/>
        </v-main>

        <v-footer app v-if="!isLoginPage"></v-footer>
    </v-app>
</template>

<script>
import {useGlobalStore} from "~/services/globalStore";
import Notification from "~/components/global/notification.vue";

export default {
    components: {Notification},
    async setup() {
        let user = await useGlobalStore().getUserInfo();

        return {user};
    },
    data: () => ({
        drawer: true,
        routes: [
            {
                route: "/",
                title: "Accueil",
                icon: "mdi-home",
                grade: ["*"],
            },
            {
                route: "/collab",
                title: "Collaborateurs",
                icon: "mdi-account-multiple",
                grade: ["*"],
            },
            {
                route: "/horaires",
                title: "Horaires",
                icon: "mdi-clock",
                grade: ["drh", "rh", "arh"],
            },
            {
                route: "/demande-collab",
                title: "Demandes",
                icon: "mdi-frequently-asked-questions",
                grade: ["*"],
            },
            {
                route: "/incident",
                title: "Incident",
                icon: "mdi-alert",
                grade: ["*"],
            },
            {
                route: "/services",
                title: "Services",
                icon: "mdi-domain",
                grade: ["drh", "rh", "arh"],
            },
            {
                route: "/access",
                title: "Points d'accès",
                icon: "mdi-door",
                grade: ["drh", "rh", "arh"],
            },
            {
                route: "/param",
                title: "Paramètres",
                icon: "mdi-settings",
                grade: ["drh", "rh", "arh"],
            },
            {
                route: "/access-history",
                title: "Historique d'accès",
                icon: "mdi-history",
                grade: ["*"],
            },
            {
                route: "/presence",
                title: "Temps de présence",
                icon: "mdi-archive-clock-outline",
                grade: ["*"],
            },
            {
                route: "/privacy",
                title: "Politique de confidentialité",
                icon: "mdi-lock-outline",
                grade: ["*"],
            },
        ],
    }),

    computed: {
        isLoginPage() {
            return this.$route.path.indexOf("login") !== -1;
        },
        isPrivacyPage() {
            return this.$route.path.indexOf("privacy") !== -1;
        },
        currentRouteTitle() {
            const currentRoute = this.$route.path;
            const matchingRoute = this.routes.find(route => route.route === currentRoute);
            return matchingRoute ? matchingRoute.title : "";
        },
    },
    async mounted() {
        await this.checkUserRight();

        watch(() => this.$route, async (to, from) => {
            const currentRoute = this.$route.path;
            const matchingRoute = this.routes.find(route => route.route === currentRoute);

            if (!this.user) {
                this.user = await useGlobalStore().getUserInfo();
            }
            await this.checkUserRight();
        }, {deep: true});

    },
    methods: {
        disconnect() {
            useGlobalStore().disconnect();
            useRouter().push('/login');
        },
        checkUserRight() {
            if (!this.isLoginPage && !this.isPrivacyPage && !useGlobalStore().isLogin()) {
                useRouter().push('/login?ref=' + useRouter().currentRoute.value.fullPath);
            }
        }
    },
};
</script>

