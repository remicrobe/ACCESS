import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Layout, Section, SectionContent, Text } from 'react-native-rapi-ui';
import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../color";

export default function ({ navigation }) {
    const userData = useUserStore.getState().userData;
    const s = require('../style');

    // Récupération des horaires
    const horaires = userData.horaire || userData.horairesdefault;

    const joursSemaine = {
        Lundi: ['hDebLundi', 'hFinLundi'],
        Mardi: ['hDebMardi', 'hFinMardi'],
        Mercredi: ['hDebMercredi', 'hFinMercredi'],
        Jeudi: ['hDebJeudi', 'hFinJeudi'],
        Vendredi: ['hDebVendredi', 'hFinVendredi'],
        Samedi: ['hDebSamedi', 'hFinSamedi'],
        Dimanche: ['hDebDimanche', 'hFinDimanche'],
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <Layout>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Ionicons name="person-circle-outline" size={96} color="#fff" />
                            <View style={styles.info}>
                                <Text style={styles.name}>{userData.nom} {userData.prenom}</Text>
                                <Text style={styles.email}>{userData.mail}</Text>
                                <View style={styles.infosRow}>
                                    <Text style={styles.headerLabel}>Fonction :</Text>
                                    <Text style={styles.headerValue}>{userData.fonction}</Text>
                                </View>
                                <View style={styles.infosRow}>
                                    <Text style={styles.headerLabel}>Service :</Text>
                                    <Text style={styles.headerValue}>{userData.service.nomservice}</Text>
                                </View>
                            </View>
                        </View>
                        <Section>
                            <SectionContent>                                    
                                {/* Affichage des horaires */}
                                {horaires && (
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.label}>Vos horaires de travail :</Text>
                                        {/* Génération dynamique des horaires */}
                                        {Object.keys(joursSemaine).map((jour, index) => (
                                            <View style={styles.scheduleContainer} key={index}>
                                                <Text style={styles.day}>{jour} :</Text>
                                                <View style={styles.timeContainer}>
                                                    <Text style={styles.time}>{horaires[joursSemaine[jour][0]].slice(0, 5)}h</Text>
                                                    <Text style={styles.time}>/</Text>
                                                    <Text style={styles.time}>{horaires[joursSemaine[jour][1]].slice(0, 5)}h</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </SectionContent>
                        </Section>
                    </View>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        display : 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 20,
        paddingTop: 15,
        backgroundColor: COLORS.primary,
    },
    infoContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6c757d',
    },
    value: {
        fontSize: 16,
        color: '#000',
    },
    name: {
        fontSize: 24,
        color: COLORS.base,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    email: {
        fontSize: 18,
        color: COLORS.base,
        textAlign: 'center',
    },
    headerLabel: {
        color: COLORS.base,
        fontWeight: 'bold',
    },
    headerValue: {
        color: COLORS.base,
    },
    infosRow: {
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    },
    scheduleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    day: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    timeContainer: {
        flexDirection: 'row',
    },
    time: {
        marginHorizontal: 5,
    },
});
