import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from "../../color";
import { Header } from "../../header/Header";
import {
    Layout,
    Text,
    TextInput,
    Button
} from "react-native-rapi-ui";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [mailMessage, setMailMessage] = useState("");

    const forget = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://access-api-38cea021d5b8.herokuapp.com/collab/demande-recuperation/', { mail: email });

            if (response.status === 200 || response.status === 201) {
                setMailMessage(`Un mail vous a été envoyé !`);
                setIsModalVisible(true);
            } else {
                Alert.alert('Erreur', 'Une erreur est survenue !');
            }
        } catch (error) {
            if (error.response) {
                console.error('Erreur:', error.response.data);
                Alert.alert('Erreur', error.response.data.message || 'Une erreur est survenue !');
            } else {
                Alert.alert('Erreur', 'Une erreur réseau est survenue !');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
            <Layout>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.base }}>
                        <Header />
                    </View>
                    <View style={{ flex: 3, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: COLORS.base }}>
                        <Text
                            size="h3"
                            fontWeight="bold"
                            style={{ alignSelf: "center", padding: 30, textAlign: "center" }}
                        >
                            Problème de connexion
                        </Text>
                        <Text>Email</Text>
                        <TextInput
                            containerStyle={{ marginTop: 15 }}
                            placeholder="Votre e-mail"
                            value={email}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={setEmail}
                        />
                        <Button
                            text={loading ? "Loading" : "Recevoir de l'aide par mail"}
                            onPress={forget}
                            style={{ marginTop: 20 }}
                            disabled={loading}
                            color="#4793CA"
                        />
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text
                                    size="md"
                                    fontWeight="bold"
                                    style={{ marginLeft: 5 }}
                                >
                                    Je veux me connecter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => {
                        setIsModalVisible(false);
                        navigation.navigate("Login");
                    }}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{mailMessage}</Text>
                        <Button
                            text="Terminé"
                            onPress={() => {
                                setIsModalVisible(false);
                                navigation.navigate("Login");
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
