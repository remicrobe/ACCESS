import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Layout, Text } from "react-native-rapi-ui";
import { Header } from "../header/Header";
import axios from "../plugins/axios";
import { COLORS } from "../color";
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";

export default function AbsencesScreen() {
    const [absences, setAbsences] = useState([]);
    const [filteredAbsences, setFilteredAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterPeriod, setFilterPeriod] = useState('all');

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                const response = await axios.get('/absence/mesAbsences');
                setAbsences(response.data);
                setFilteredAbsences(response.data);
                setLoading(false);
            } catch (error) {
                Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données.');
                setLoading(false);
            }
        };

        fetchAbsences();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterType, filterPeriod, absences]);

    const applyFilters = () => {
        let filtered = [...absences];

        if (filterType !== 'all') {
            filtered = filtered.filter(absence => {
                if (filterType === 'accepted') return absence.accepte === true;
                if (filterType === 'rejected') return absence.accepte === false;
                if (filterType === 'pending') return absence.accepte === null;
            });
        }

        if (filterPeriod !== 'all') {
            const today = new Date();
            filtered = filtered.filter(absence => {
                const startDate = new Date(absence.datedeb);
                const endDate = new Date(absence.datefin);

                if (filterPeriod === 'past') return endDate < today;
                if (filterPeriod === 'upcoming') return startDate > today;
                if (filterPeriod === 'current') return startDate <= today && endDate >= today;
            });
        }

        setFilteredAbsences(filtered);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header/>
            <Layout style={styles.layout}>
                <View style={{margin: 20, marginBottom: 5, marginTop: 5,}}>
                    <Text>Nombre total d'absences : {absences.length} </Text>
                </View>
                <View style={styles.filterContainer}>
                    <Picker
                        selectedValue={filterType}
                        style={styles.picker}
                        onValueChange={(itemValue) => setFilterType(itemValue)}
                    >
                        <Picker.Item label="Tous les types" value="all" />
                        <Picker.Item label="Accepté" value="accepted" />
                        <Picker.Item label="Rejeté" value="rejected" />
                        <Picker.Item label="En attente" value="pending" />
                    </Picker>
                    <Picker
                        selectedValue={filterPeriod}
                        style={styles.picker}
                        onValueChange={(itemValue) => setFilterPeriod(itemValue)}
                    >
                        <Picker.Item label="Toute période" value="all" />
                        <Picker.Item label="Passé" value="past" />
                        <Picker.Item label="À venir" value="upcoming" />
                        <Picker.Item label="En cours" value="current" />
                    </Picker>
                </View>
                {loading ? (
                    <Text>Chargement...</Text>
                ) : (
                    <ScrollView>
                        {filteredAbsences.length > 0 ? (
                            filteredAbsences.map((absence, index) => (
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
    layout: {
        paddingBottom: 50,
    },
    absenceItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: '#EAEAEA',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: COLORS.base,
    },
    absenceText: {
        fontSize: 16,
    },
    filterContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});
