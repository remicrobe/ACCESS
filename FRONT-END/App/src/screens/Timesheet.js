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

    const handleLogout = async () => {
        useAuthStore.getState().disconnect();
        navigation.navigate('Login');
    };

    // Récupération des horaires
    const horaires = userData.horaire || userData.horairesdefault;

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
                                        <Text style={styles.label}>Horaires :</Text>
                                        {/* Génération dynamique des horaires */}
                                        {Object.keys(horaires).map((key, index) => (
                                            // Sauter les deux premiers champs
                                            index > 1 && (
                                                <View style={styles.scheduleContainer} key={key}>
                                                    <Text style={styles.day}> { key.substr(4) } :</Text>
                                                    <Text style={styles.time}>{horaires[key]}</Text>
                                                </View>
                                            )
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
    },
    day: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#6c757d',
    },
    time: {
        fontSize: 16,
        color: '#000',
    },
});
