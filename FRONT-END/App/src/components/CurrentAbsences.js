import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Layout, Text } from "react-native-rapi-ui";
import axios from "../plugins/axios";
import { COLORS } from "../color";
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';

export default function AbsencesScreen() {
    const [currentAbsences, setCurrentAbsences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                const response = await axios.get('/absence/mesAbsences');
                const absences = response.data;

                const currentDate = new Date();

                const ongoingAbsences = absences.filter(absence => 
                    new Date(absence.datedeb) <= currentDate && 
                    new Date(absence.datefin) >= currentDate && 
                    absence.accepte === true
                );

                ongoingAbsences.sort((a, b) => new Date(a.datedeb) - new Date(b.datedeb));

                setCurrentAbsences(ongoingAbsences);
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
            <Layout>
                {loading ? (
                    <Text>Chargement...</Text>
                ) : (
                    <ScrollView>
                        <Text style={styles.title}>Absences en cours</Text>
                        {currentAbsences.length > 0 ? (
                            currentAbsences.map((absence) => (
                                <View key={absence.id} style={styles.absenceItem}>
                                    <View>
                                        <Text style={{ 
                                            color: COLORS.green,
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
                                </View>
                            ))
                        ) : (
                            <Text style={styles.absenceText}>Aucune absence en cours.</Text>
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
        padding: 20,
        borderColor: COLORS.grey,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        padding: 20,
        
    },
    raison: {
        fontWeight: '700',
        color: '#828282',
        backgroundColor: COLORS.base,
    },
    absenceItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: COLORS.base,
    },
    absenceText: {
        fontSize: 16,
        backgroundColor: COLORS.base,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        backgroundColor: COLORS.base,
    },
});
