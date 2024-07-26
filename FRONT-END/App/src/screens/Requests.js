import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Layout, Text } from "react-native-rapi-ui";
import { Header } from "../header/Header";
import axios from "../plugins/axios";
import { COLORS } from "../color";
import Icon from 'react-native-vector-icons/Ionicons'; // Utilisation des icônes Ionicons

export default function AbsencesScreen() {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fonction pour récupérer les absences
        const fetchAbsences = async () => {
            try {
                const response = await axios.get('/absence/mesAbsences');
                setAbsences(response.data);
                setLoading(false);
            } catch (error) {
                Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données.');
                setLoading(false);
            }
        };

        fetchAbsences();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Mes Absences" />
            <Layout>
                {loading ? (
                    <Text>Chargement...</Text>
                ) : (
                    <ScrollView>
                        {absences.length > 0 ? (
                            absences.map((absence, index) => (
                                <View key={index} style={styles.absenceItem}>
                                    <Text style={styles.title}>
                                        Demande N°{absence.id}
                                    </Text>
                                    <Text style={styles.absenceText}>
                                        {absence.datedeb} au {absence.datefin}
                                    </Text>
                                    <Text>
                                        {absence.raison}
                                    </Text>
                                    <Icon
                                        name={
                                            absence.accepte === true
                                                ? "checkmark-outline"
                                                : absence.accepte === false
                                                    ? "close-outline"
                                                    : "hourglass-outline"
                                        }
                                        size={24}
                                        color={
                                            absence.accepte === true
                                                ? COLORS.green
                                                : absence.accepte === false
                                                    ? COLORS.red
                                                    : COLORS.yellow
                                        }
                                    />
                                </View>
                            ))
                        ) : (
                            <Text>Aucune absence trouvée.</Text>
                        )}
                    </ScrollView>
                )}
            </Layout>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    title: {
        fontWeight: 'bold',
    },
    absenceItem: {
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: '#EAEAEA',
        marginBottom: 10,
        borderRadius: 10,
    },
    absenceText: {
        fontSize: 16,
    },
});
