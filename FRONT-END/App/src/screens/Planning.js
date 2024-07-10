import {LocaleConfig} from 'react-native-calendars';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import {StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Layout, Text} from "react-native-rapi-ui";
import {useUserStore} from "../store/user.store";
import {Header} from "../header/Header";
import {COLORS} from "../color";


LocaleConfig.locales['fr'] = {
    monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
};

LocaleConfig.defaultLocale = 'fr';

const App = () => {
    const s = require('../style');
    const [userAbsenceData, setUserAbsenceData] = useState([]);
    const [selected, setSelected] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        async function fetchUserAbsence() {
            let res = await useUserStore.getState().getUserAbsenceData();
            if (!res) {
                alert("Nous n'avons pu récupérer vos informations, veuillez essayer plus tard !")
            } else {
                setUserAbsenceData(res);
            }
        }
        fetchUserAbsence();
    }, []);

    const addDays = (date, days) => {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().substring(0, 10);
    };

    const markedDates = userAbsenceData.reduce((acc, event) => {
        const startDate = event.datedeb.substring(0, 10);
        const endDate = event.datefin.substring(0, 10);
        for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
            acc[date] = {selected: true, selectedColor: COLORS.secondary};
        }
        return acc;
    }, {});

    const handleDayPress = (day) => {
        setSelected(day.dateString);
        const event = userAbsenceData.find(event => {
            const startDate = event.datedeb.substring(0, 10);
            const endDate = event.datefin.substring(0, 10);
            return day.dateString >= startDate && day.dateString <= endDate;
        });
        setSelectedEvent(event);
    };

    return (
        <Layout>
            <Header/>
            <View style={s.container}>
                <View style={s.header}>
                    <View>
                        <Text style={s.bold}>Votre planning</Text>
                    </View>
                </View>
                <View>
                    <Calendar
                        style={styles.calendar}
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                    />
                </View>
                {selectedEvent && (
                    <View style={styles.eventContainer}>
                        <Text style={styles.eventTitle}>{selectedEvent.raison}</Text>
                        <Text style={styles.eventDescription}>{selectedEvent.description}</Text>
                        <Text style={styles.eventStatus}>Statut: {selectedEvent.accepte === null ? 'En attente' : selectedEvent.accepte ? 'Accepté' : 'Refusé'}</Text>
                        {selectedEvent.datereponse && (
                            <Text style={styles.eventResponseDate}>
                                Date de réponse: {selectedEvent.datereponse.substring(0, 10)}
                            </Text>
                        )}
                    </View>
                )}

            </View>
        </Layout>

    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    email: {
        fontSize: 16,
        color: '#6c757d',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    value: {
        fontSize: 16,
        marginLeft: 8,
    },
    eventContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventDescription: {
        fontSize: 16,
        marginTop: 8,
    },
    eventStatus: {
        fontSize: 16,
        marginTop: 8,
        fontWeight: 'bold',
    },
    eventResponseDate: {
        fontSize: 16,
        marginTop: 8,
    },
    calendar: {
        backgroundColor: 'transparent',
    },

});


export default App;
