import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Image, StyleSheet, Alert } from "react-native";
import { Layout, Text, TextInput, Button, useTheme } from "react-native-rapi-ui";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import $axios from "../../plugins/axios";
import { useAuthStore } from "../../store/auth.store";
import { useUserStore } from "../../store/user.store";
import { COLORS } from "../../color";

export default function ({ navigation }) {
    const { isDarkmode, setTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState("");

    // Vérifier l'authentification lors du montage du composant
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (token) {
                    useAuthStore.getState().setJwtToken(token); // Mettre à jour le token dans le store
                    await useUserStore.getState().getUserData(); // Récupérer les données de l'utilisateur
                    navigation.navigate("MainTabs"); // Naviguer vers l'écran principal
                }
            } catch (error) {
                console.error("Erreur lors de la vérification du token:", error);
            }
        };

        checkAuth(); // Appeler la fonction de vérification d'authentification
    }, [navigation]); // Ajouter navigation comme dépendance

    async function login() {
        setLoading(true);
        try {
            const response = await $axios.post(`collab/connect`, { mail: email, motdepasse: password });
            if (response.data && response.data.jwtToken) {
                await AsyncStorage.setItem('jwtToken', response.data.jwtToken);
                useAuthStore.getState().setJwtToken(response.data.jwtToken);
                await useUserStore.getState().getUserData();
                setWelcomeMessage(`Bienvenue ${response.data.collab.nom} ${response.data.collab.prenom}`);
                setIsModalVisible(true);
            } else {
                Alert.alert("Erreur", "Nous n'avons pu récupérer vos informations, veuillez essayer plus tard !");
            }
        } catch (error) {
            Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
            <Layout>
                <ScrollView style={styles.background} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>AccessLink</Text>
                    </View>
                    <View style={styles.curveWrapper}>
                        <View style={styles.curveContainer}>
                            <Image
                                resizeMode="contain"
                                style={styles.logo}
                                source={require("../../../assets/mns-fulllogo.png")}
                            />
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
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        containerStyle={styles.passwordInput}
                                        placeholder="Mot de passe"
                                        value={password}
                                        autoCapitalize="none"
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        secureTextEntry={!isPasswordVisible}
                                        onChangeText={(text) => setPassword(text)}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        <Ionicons
                                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                                            size={24}
                                            color="grey"
                                        />
                                    </TouchableOpacity>
                                </View>
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
                    </View>
                </ScrollView>

                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => {
                        setIsModalVisible(false);
                        navigation.navigate("MainTabs");
                    }}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{welcomeMessage}</Text>
                        <Button
                            text="Merci"
                            onPress={() => {
                                setIsModalVisible(false);
                                navigation.navigate("MainTabs");
                            }}
                            style={styles.modalButton}
                            color={COLORS.primary}
                        />
                    </View>
                </Modal>
            </Layout>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        paddingVertical: 40,
        alignItems: "center",
        paddingBottom: 100,
    },
    headerText: {
        color: "#FFFFFF",
        fontSize: 40,
        fontWeight: "bold",
    },
    curveWrapper: {
        flex: 1,
        overflow: "hidden",
        backgroundColor: COLORS.base,
        borderTopLeftRadius: 190,
        borderTopRightRadius: 190,
    },
    curveContainer: {
        backgroundColor: COLORS.base,
        overflow: "hidden",
        paddingTop: 20,
    },
    logo: {
        height: 100,
        width: 100,
        alignSelf: "center",
        marginTop: 20,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF",
        width: "90%",
        overflow: "hidden",
        marginHorizontal: "auto",
    },
    input: {
        marginVertical: 10,
        borderRadius: 100,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    passwordInput: {
        flex: 1,
        borderRadius: 100,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
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
        marginHorizontal: 30,
    },
    background: {
        backgroundColor: COLORS.primary,
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButton: {
        marginTop: 10,
    },
});
