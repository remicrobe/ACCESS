import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars'; 
import { Layout } from 'react-native-rapi-ui';
import axios from 'axios'; // Importer axios
import { COLORS } from '../color';

// Configurer la langue française pour les mois et les jours
LocaleConfig.locales['fr'] = {
    monthNames: [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    monthNamesShort: [
        'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
        'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'
    ],
    dayNames: [
        'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

const AbsenceAgenda = () => {
    const [items, setItems] = useState({});

    useEffect(() => {
        async function fetchAbsences() {
            try {
                // Remplacer 'API_URL' par l'URL réelle de votre API
                const response = await axios.get('https://votre-api.com/absences');
                if (response.data) {
                    let formattedItems = formatData(response.data);
                    setItems(formattedItems);
                } else {
                    alert("Nous n'avons pu récupérer vos informations, veuillez essayer plus tard !");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des absences:", error);
                alert("Une erreur est survenue lors de la récupération des données.");
            }
        }
    
        fetchAbsences();
    }, []);

    const formatData = (data) => {
        console.log("Formatting data...");
        let formattedItems = {};
        data.forEach((absence) => {
            let currentDate = absence.datedeb.substring(0, 10);
            const endDate = absence.datefin.substring(0, 10);
            console.log("Processing absence from:", currentDate, "to:", endDate);
    
            while (currentDate <= endDate) {
                if (!formattedItems[currentDate]) {
                    formattedItems[currentDate] = [];
                }
                formattedItems[currentDate].push({
                    name: absence.raison || "Absence",
                    description: absence.description,
                    accepte: absence.accepte,
                    datereponse: absence.datereponse ? absence.datereponse.substring(0, 10) : null,
                });
    
                const nextDate = addDays(currentDate, 1);
                console.log("currentDate:", currentDate, "nextDate:", nextDate);
                if (nextDate === currentDate) {
                    console.error("Loop Infinie détectée, dates identiques.");
                    break;
                }
                currentDate = nextDate;
            }
        });
        console.log("Formatted items:", formattedItems);
        return formattedItems;
    };

    const addDays = (date, days) => {
        const timestamp = Date.parse(date);
        if (isNaN(timestamp)) {
            console.error("Date invalide détectée:", date);
            return date;  // Retourner la date originale si elle est invalide
        }
    
        const result = new Date(timestamp + days * 24 * 60 * 60 * 1000);
        return result.toISOString().substring(0, 10);
    };

    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.itemStatus}>Statut: {item.accepte === null ? 'En attente' : item.accepte ? 'Accepté' : 'Refusé'}</Text>
                {item.datereponse && (
                    <Text style={styles.itemDate}>Date de réponse: {item.datereponse}</Text>
                )}
            </View>
        );
    };

    return (
        <Layout>
            <View style={styles.container}>
                <Agenda
                    items={items}
                    selected={new Date().toISOString().substring(0, 10)}
                    renderItem={renderItem}
                    theme={{
                        selectedDayBackgroundColor: COLORS.secondary,
                        todayTextColor: COLORS.primary,
                        dotColor: COLORS.primary,
                        agendaDayTextColor: COLORS.primary,
                        agendaDayNumColor: COLORS.primary,
                        agendaTodayColor: COLORS.primary,
                        agendaKnobColor: COLORS.secondary,
                    }}
                    // Ajouter des propriétés pour afficher les jours sans événements
                    renderEmptyData={() => <View style={styles.emptyDay}><Text style={styles.emptyText}>Aucune absence pour cette journée</Text></View>}
                />
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingBottom: 25,
    },
    item: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemStatus: {
        marginTop: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    itemDate: {
        marginTop: 5,
        color: '#888',
    },
    emptyDay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontStyle: 'italic',
    },
});

export default AbsenceAgenda;
