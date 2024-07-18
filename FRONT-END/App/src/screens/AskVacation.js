import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import { Layout, Text, TextInput, Button, useTheme } from "react-native-rapi-ui";

import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../color";
import {Header} from "../header/Header";
import $axios from "../plugins/axios";


export default function ({ navigation }) {
    const [loading, setLoading] = useState(false);

    return(
            
        <Layout>
            <Header/>
            <View style={styles.formContainer}>
                <TextInput
                    containerStyle={styles.input}
                    placeholder="Type d'abscence"
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="absence"
                    onChangeText={(text) => setEmail(text)}
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
});
