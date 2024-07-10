import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Image, StyleSheet } from "react-native";
import { Layout, Text, TextInput, Button, useTheme } from "react-native-rapi-ui";
import $axios from "../../plugins/axios";
import { useAuthStore } from "../../store/auth.store";
import { useUserStore } from "../../store/user.store";
import {COLORS} from "../../color";

export default function ({ navigation }) {
    const { isDarkmode, setTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function login() {
        setLoading(true);
        await $axios.post(`collab/connect`, { mail: email, motdepasse: password })
            .then(async (res) => {
                try {
                    useAuthStore.getState().setJwtToken(res.data.jwtToken);
                    await useUserStore.getState().getUserData();
                    alert(`Bienvenue ${res.data.collab.nom} ${res.data.collab.prenom}`);
                    navigation.navigate("MainTabs");
                } catch (error) {
                    // Error saving data
                }
            })
            .catch((err) => {
                alert(`Une erreur est survenue lors de la connexion`);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
            <Layout>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>AccessLink</Text>
                    </View>
                    <View style={styles.curveContainer}>
                        <View style={styles.innerCurveContainer}>
                            <Image
                                resizeMode="contain"
                                style={styles.logo}
                                source={require("../../../assets/mns-fulllogo.png")}
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                containerStyle={styles.input}
                                placeholder="Login"
                                value={email}
                                autoCapitalize="none"
                                autoCompleteType="off"
                                autoCorrect={false}
                                keyboardType="email-address"
                                onChangeText={(text) => setEmail(text)}
                            />
                            <TextInput
                                containerStyle={styles.input}
                                placeholder="Mot de passe"
                                value={password}
                                autoCapitalize="none"
                                autoCompleteType="off"
                                autoCorrect={false}
                                secureTextEntry={true}
                                onChangeText={(text) => setPassword(text)}
                            />
                            <TouchableOpacity
                                style={styles.linkContainer}
                                onPress={() => navigation.navigate("ForgetPassword")}
                            >
                                <Text style={styles.linkText}>Première connexion</Text>
                                <Text style={styles.linkText}>Mot de passe oublié</Text>
                            </TouchableOpacity>
                            <Button
                                text={loading ? "Loading" : "Connexion"}
                                onPress={login}
                                style={styles.button}
                                disabled={loading}
                                color="#4793CA"
                            />
                        </View>
                    </View>
                </ScrollView>
            </Layout>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        paddingVertical: 40,
        alignItems: "center",
    },
    headerText: {
        color: "#FFFFFF",
        fontSize: 40,
        fontWeight: "bold",
    },
    curveContainer: {
        backgroundColor: COLORS.base,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50, // Corrected typo
        overflow: "hidden",
        alignItems: "center", // Added to center align items
    },
    innerCurveContainer: {
        width: "100%",
        alignItems: "center",
        paddingTop: 50, // Adjust to position the logo correctly
    },
    logo: {
        height: 100,
        width: 100,
        alignSelf: "center",
        marginTop: -50, // Adjust to position the logo correctly
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF",
        width: "100%",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    input: {
        marginVertical: 10,
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    linkText: {
        fontSize: 14,
        color: COLORS.primary,
    },
    button: {
        marginTop: 20,
        borderRadius: 30,
    },
});
