import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Layout, Text } from "react-native-rapi-ui";
import { Header } from "../header/Header";
import axios from "../plugins/axios";
import { COLORS } from "../color";
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns'; 

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
                                    <View>
                                        <Text style={{ 
                                            color: absence.accepte === true 
                                            ? COLORS.green 
                                            : absence.accepte === false 
                                                ? COLORS.red 
                                                : COLORS.yellow,
                                        fontWeight: 'bold'
                                        }}>
                                            Demande N°{absence.id}
                                        </Text>
                                        <Text style={styles.absenceText}>
                                            {format(new Date(absence.datedeb), 'dd/MM/yyyy')} au {format(new Date(absence.datefin), 'dd/MM/yyyy')}
                                        </Text>
                                        <Text style={styles.raison}>
                                            {absence.raison}
                                        </Text>
                                    </View>
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
    },
    raison: {
        fontWeight: '700',
        color: '#828282'
    },
    absenceItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
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
