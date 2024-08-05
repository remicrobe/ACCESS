import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Layout, Text, TextInput, Button } from "react-native-rapi-ui";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { Header } from "../header/Header";
import axios from "../plugins/axios";
import { COLORS } from "../color";

export default function ({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [datedeb, setDatedeb] = useState(new Date());
    const [datefin, setDatefin] = useState(new Date());
    const [periodeDebOpen, setPeriodeDebOpen] = useState(false);
    const [periodeDeb, setPeriodeDeb] = useState(null);
    const [periodeFinOpen, setPeriodeFinOpen] = useState(false);
    const [periodeFin, setPeriodeFin] = useState(null);
    const [raisonOpen, setRaisonOpen] = useState(false);
    const [raison, setRaison] = useState(null);
    const [description, setDescription] = useState('');
    const [showDateDeb, setShowDateDeb] = useState(false);
    const [showDateFin, setShowDateFin] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

    const periodeOptionsDeb = [
        { label: 'Matin', value: '0' },
        { label: 'Midi', value: '1' }
    ];

    const periodeOptionsFin = [
        { label: 'Midi', value: '0' },
        { label: 'Soir', value: '1' }
    ];

    const raisonOptions = [
        { label: 'Congés', value: 'vacation' },
        { label: 'Maladie', value: 'disease' },
        { label: 'Autre', value: 'other' }
    ];

    const handleSubmit = () => {
        if (!datedeb || !datefin || !periodeDeb || !periodeFin || !raison) {
            setModalMessage("Veuillez remplir tous les champs obligatoires.");
            setModalType('error');
            setModalVisible(true);
            return;
        }

        setLoading(true);
        const leaveRequest = {
            datedeb: datedeb.toISOString().split('T')[0],
            datefin: datefin.toISOString().split('T')[0],
            periodeDeb,
            periodeFin,
            raison,
            description
        };

        axios.post('/absence/creerUneAbsence/{idcollab}', leaveRequest)
            .then(response => {
                setModalMessage("Votre demande a bien été envoyée !");
                setModalType('success');
                setLoading(false);
                setModalVisible(true);
            })
            .catch(error => {
                setModalMessage("Votre demande n'a pas été envoyée. Veuillez réessayer.");
                setModalType('error');
                setLoading(false);
                setModalVisible(true);
            });
    };

    const onChangeDateDeb = (event, selectedDate) => {
        const currentDate = selectedDate || datedeb;
        setShowDateDeb(Platform.OS === 'ios');
        setDatedeb(currentDate);
    };

    const onChangeDateFin = (event, selectedDate) => {
        const currentDate = selectedDate || datefin;
        setShowDateFin(Platform.OS === 'ios');
        setDatefin(currentDate);
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <Layout style={{ paddingBottom: 50 }}>
                    <Header />
                    <View style={styles.formContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.label}>Date de début:</Text>
                            <TextInput
                                containerStyle={styles.input}
                                placeholder="Date de début :"
                                value={datedeb.toISOString().split('T')[0]}
                                onFocus={() => setShowDateDeb(true)}
                            />
                            {showDateDeb && (
                                <DateTimePicker
                                    value={datedeb}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDateDeb}
                                />
                            )}
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.label}>Date de fin:</Text>
                            <TextInput
                                containerStyle={styles.input}
                                placeholder="Date de fin :"
                                value={datefin.toISOString().split('T')[0]}
                                onFocus={() => setShowDateFin(true)}
                            />
                            {showDateFin && (
                                <DateTimePicker
                                    value={datefin}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDateFin}
                                />
                            )}
                        </View>
                        <DropDownPicker
                            open={periodeDebOpen}
                            value={periodeDeb}
                            items={periodeOptionsDeb}
                            setOpen={setPeriodeDebOpen}
                            setValue={setPeriodeDeb}
                            placeholder="Période de début"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />
                        <DropDownPicker
                            open={periodeFinOpen}
                            value={periodeFin}
                            items={periodeOptionsFin}
                            setOpen={setPeriodeFinOpen}
                            setValue={setPeriodeFin}
                            placeholder="Période de fin"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />
                        <DropDownPicker
                            open={raisonOpen}
                            value={raison}
                            items={raisonOptions}
                            setOpen={setRaisonOpen}
                            setValue={setRaison}
                            placeholder="Type d'absence"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />
                        <TextInput
                            containerStyle={styles.input}
                            placeholder="Description de la demande"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <Button
                            text={loading ? "Chargement..." : "Envoyer ma demande"}
                            style={styles.button}
                            color={COLORS.primary}
                            onPress={handleSubmit}
                            disabled={loading}
                        />
                    </View>
                </Layout>
                <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={modalType === 'success' ? styles.successText : styles.errorText}>{modalMessage}</Text>
                        <Button
                            text="Terminé"
                            onPress={() => setModalVisible(false)}
                            style={styles.modalButton}
                            color={COLORS.primary}
                        />
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
        width: '100%',
    },
    dropdown: {
        width: '100%',
        marginVertical: 10,
        borderColor: COLORS.grey,
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 0,
        marginBottom:0,
    },
    dropdownList: {
        top: '100%',
        borderColor: COLORS.grey,
        zIndex: 3
    },
    dateContainer: {
        width: '100%',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    successText: {
        color: COLORS.primary,
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        color: COLORS.red,
        fontSize: 18,
        marginBottom: 10,
    },
    modalButton: {
        marginTop: 10,
    },
});
