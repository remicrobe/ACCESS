import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Section, Text } from 'react-native-rapi-ui';
import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../color";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assurez-vous d'importer AsyncStorage
import { useNavigation } from '@react-navigation/native';

export default function () {
    const userData = useUserStore(state => state.userData); 
    const { navigate } = useNavigation(); // Utilisez useNavigation pour la navigation

    const navigateToTimesheet = () => {
        navigate('Timesheet');
    };

    const handleLogout = async () => {
        try {
            // Supprimer le jeton JWT du stockage local
            await AsyncStorage.removeItem('jwtToken');

            // Mettre à jour l'état de l'authentification dans le store
            useAuthStore.getState().disconnect();

            // Naviguer vers l'écran de connexion
            navigate('Login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.base }}>
            <ScrollView>
                <Layout>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Ionicons name="person-circle-outline" size={96} color="#fff" />

                            <View style={styles.info}>
                                <Text style={styles.name}>{userData?.nom} {userData?.prenom}</Text>
                                <Text style={styles.email}>{userData?.mail}</Text>
                                <View style={styles.infosRow}>
                                    <Text style={styles.headerLabel}>Fonction : </Text>
                                    <Text style={styles.headerValue}>{userData?.fonction}</Text>
                                </View>
                                <View style={styles.infosRow}>
                                    <Text style={styles.headerLabel}>Service : </Text>
                                    <Text style={styles.headerValue}>{userData?.service?.nomservice}</Text>
                                </View>
                            </View>
                        </View>
                        <Section style={{ marginVertical: 45 }}>
                            <TouchableOpacity
                                style={styles.buttonDetails}
                                onPress={navigateToTimesheet}
                            >
                                <Text style={{ color: COLORS.primary, textAlign: 'center' }}>Détails des horaires</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDeco} onPress={handleLogout}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Se déconnecter</Text>
                            </TouchableOpacity>
                        </Section>
                    </View>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 20,
        paddingTop: 15,
        backgroundColor: COLORS.primary,
    },
    info: {
        flex: 1,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonDetails: {
        marginBottom: 30,
        paddingVertical: 20,
        paddingHorizontal: 40,
        backgroundColor: COLORS.base,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 15,
        alignSelf: 'center',
    },
    buttonDeco: {
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 40,
        backgroundColor: '#C9474E',
        alignSelf: 'center',
    },
    container : {
        backgroundColor: COLORS.base,
    }
});
