import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Layout, Section, SectionContent, Text } from 'react-native-rapi-ui';
import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/user.store";
import { Ionicons } from "@expo/vector-icons";

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
                    <View style={s.container}>
                        <View style={s.header}>
                            <Ionicons name="people-circle-outline" size={96} color="#6c757d" />

                            <View style={styles.info}>
                                <Text style={styles.name}>{userData.nom} {userData.prenom}</Text>
                                <Text style={styles.email}>{userData.mail}</Text>
                            </View>
                        </View>
                        <Section>
                            <SectionContent>
                                {/* Affichage des informations existantes */}
                                <View style={styles.infoContainer}>
                                    <Text style={styles.label}>Fonction :</Text>
                                    <Text style={styles.value}>{userData.fonction}</Text>
                                </View>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.label}>Service :</Text>
                                    <Text style={styles.value}>{userData.service.nomservice}</Text>
                                </View>

                                {/* Affichage des horaires */}
                                {horaires && (
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.label}>Horaires :</Text>
                                        {/* Génération dynamique des horaires */}
                                        {Object.keys(horaires).map((key, index) => (
                                            // Sauter les deux premiers champs
                                            index > 1 && (
                                                <View style={styles.scheduleContainer} key={key}>
                                                    <Text style={styles.day}>{index % 2 === 0 ? 'Début' : 'Fin'} { key.substr(4) } :</Text>
                                                    <Text style={styles.time}>{horaires[key]}</Text>
                                                </View>
                                            )
                                        ))}
                                    </View>
                                )}
                            </SectionContent>
                        </Section>
                        <Button
                            text="Se déconnecter"
                            color="#C9474E"
                            style={{ marginTop: 30, marginBottom: 40 }}
                            onPress={handleLogout}
                        />
                    </View>
                </Layout>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    info: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 18,
        color: '#6c757d',
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
