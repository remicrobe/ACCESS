import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import { Layout, Text, TextInput, Button, useTheme } from "react-native-rapi-ui";
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../color";
import {Header} from "../header/Header";
import axios from "../plugins/axios";


export default function ({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [absences, setAbsences] = useState([]);
    const [selectedAbsence, setSelectedAbsence] = useState(null);

    useEffect(() => {
        axios.get('collab/absences')
          .then(response => {
            const fetchedAbsences = response.data;
            const formattedAbsences = fetchedAbsences.map(absence => ({
              label: `${absence.raison} - ${absence.datedeb}`,
              value: absence.id,
            }));
            setAbsences(formattedAbsences);
          })
          .catch(error => {
            Alert.alert("Error", "Unable to fetch absences.");
          });
      }, []);

    return(
            
        <Layout>
            <Header/>
            <View style={styles.formContainer}>
            <DropDownPicker
                open={open}
                value={value}
                items={absences}
                setOpen={setOpen}
                setValue={setValue}
                placeholder="Select an option"
                style={styles.dropdown}
                dropDownStyle={styles.dropdownList}
                onValueChange={(value) => setSelectedAbsence(value)}
            />
                <TextInput
                    containerStyle={styles.input}
                    placeholder="Mot de passe"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <Button
                    text={loading ? "Loading" : "Envoyer"}
                    style={styles.button}
                    disabled={loading}
                    color="#4793CA"
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    bold: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    accessItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    buttonDetails: {
        marginTop: 50,
        marginBottom: 30,
        paddingVertical: 20,
        paddingHorizontal: 40,
        backgroundColor: COLORS.base,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 15,
        alignSelf: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
    },
    dropdownList: {
        borderColor: 'gray',
    },
});
