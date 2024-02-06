<template>
    <v-row class="mt-1 ml-1 mr-1">
        <v-col md="12">
            <v-card class="mx-auto">
                <v-toolbar class="pt-n5" :title="`Gérer l'incident #${incidentId}`" color="primary">
                </v-toolbar>
                <v-card-text style="overflow: auto" v-if="incident">
                    <v-row class="mt-n3 ml-n3 mr-n3">
                        <v-col md="4">
                            <v-card color="primary" :elevation="2">
                                <v-card-title>
                                    <v-icon>mdi-account</v-icon>
                                    Identité collaborateur
                                </v-card-title>
                                <v-card-subtitle>{{ incident.collab.prenom }} {{
                                        incident.collab.nom
                                    }}
                                </v-card-subtitle>
                            </v-card>
                        </v-col>

                        <v-col md="4">
                            <v-card color="primary" :elevation="2">
                                <v-card-title>
                                    <v-icon>mdi-calendar</v-icon>
                                    Date incident
                                </v-card-title>
                                <v-card-subtitle>{{ new Date(incident.creeLe).toLocaleDateString() }}</v-card-subtitle>
                            </v-card>
                        </v-col>

                        <v-col md="4">
                            <v-card color="primary" :elevation="2">
                                <v-card-title>
                                    <v-icon>mdi-message</v-icon>
                                    Description incident
                                </v-card-title>
                                <v-card-subtitle>{{
                                        incident.description ? incident.description : 'Aucune'
                                    }}
                                </v-card-subtitle>
                            </v-card>
                        </v-col>

                        <v-col md="4">
                            <v-card color="primary" :elevation="2">
                                <v-card-title>
                                    <v-icon>mdi-account</v-icon>
                                    Prise en charge
                                </v-card-title>
                                <v-card-subtitle>
                                    {{
                                        incident.modifiePar ?
                                            incident.modifiePar.prenom + ' ' + incident.modifiePar.nom
                                            : 'Personne'
                                    }}
                                </v-card-subtitle>
                            </v-card>
                        </v-col>

                        <v-col md="4">
                            <v-card color="primary" :elevation="2">
                                <v-card-title>
                                    <v-icon>mdi-account</v-icon>
                                    Dernière prise en charge
                                </v-card-title>
                                <v-card-subtitle>
                                    {{
                                        incident.modifieLe ? new Date(incident.modifieLe).toLocaleDateString() : 'Jamais'
                                    }}
                                </v-card-subtitle>
                            </v-card>
                        </v-col>

                        <v-col md="4">
                            <v-card color="primary" :elevation="2">
                                <v-card-title>
                                    <v-icon :color="incident.ouvert ? 'error' : 'success'">
                                        {{ incident.ouvert ? 'mdi-hospital' : 'mdi-check-bold' }}
                                    </v-icon>
                                    Etat de l'incident
                                </v-card-title>
                                <v-card-subtitle>
                                    {{ incident.ouvert ? 'Non résolu' : 'Résolu' }}
                                </v-card-subtitle>
                            </v-card>
                        </v-col>

                    </v-row>

                    <v-card-text class="flex-grow-1 overflow-y-auto" style="height: 55vh;max-height: 55vh">
                        <template v-for="(msg, i) in incident.reponse" v-if="incident.reponse.length > 0">
                            <text-divider
                                v-if="i===0 || i !== 0 && (new Date(incident.reponse[i-1].creeLe).toLocaleDateString() !== new Date(incident.reponse[i].creeLe).toLocaleDateString())"
                                :text="new Date(msg.creeLe).toLocaleDateString()"
                            />

                            <div
                                :class="{ 'd-flex flex-row-reverse' : true }"
                            >
                                <!--                                <div class="mb-1 " v-if="msg.from !== 'user'">-->
                                <!--                                    <strong>{{ msg.from }}</strong>-->
                                <!--                                </div>-->
                                <v-chip
                                    color="primary"
                                    dark
                                    style="height:auto;white-space: normal; word-wrap: break-word; border-radius: 0"
                                    class="pa-4 mb-2"
                                >
                                    {{ msg.reponse }}
                                    <sub
                                        class="ml-2"
                                        style="font-size: 0.5rem; "
                                    >
                                        {{ DateTime.fromISO(msg.creeLe).toFormat('HH:mm:ss') }}
                                    </sub>
                                </v-chip>
                            </div>
                        </template>
                        <text-divider
                            text="Aucun message"
                            v-else
                        />
                    </v-card-text>
                    <v-card-actions>
                        <v-row>
                            <v-col md="8">
                                <v-text-field
                                    v-model="newMessage"
                                    label="Ecrivez votre message"
                                    type="text"
                                    no-details
                                    outlined
                                    append-outer-icon="send"
                                    hide-details
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <div class="text-center">
                                    <v-btn
                                        color="primary"
                                        size="x-large"
                                        block
                                        @click="sendMessage"
                                        variant="elevated"
                                        append-icon="mdi-send"
                                    >
                                        Valider
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import {useApiService} from "~/services/apiServices";
import {DateTime, Interval} from "luxon";
import incident from '~/pages/incident/index.vue';

export default {
    computed: {
        DateTime() {
            return DateTime;
        }
    },
    setup() {
        let {data: incident} = useApiService(`/incident/${useRouter().currentRoute.value.params.uuid}`, {
            method: "get",
            watch: false
        }, true);

        return {incident};
    },
    data() {
        return {
            incidentId: useRouter().currentRoute.value.params.uuid,
            newMessage: ''
        };
    },
    methods: {
        async sendMessage() {
            let {data: newMsg} = await useApiService(`/incident/${this.incidentId}/message`,{
                method: 'post',
                body: {
                    message: this.newMessage
                }
            }, true, true, 'Notification')

            this.incident.reponse.push(newMsg.value)

            this.newMessage = '';
        }
    }
};
</script>
