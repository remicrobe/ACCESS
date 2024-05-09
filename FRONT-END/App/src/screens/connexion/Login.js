import React, {useState} from "react";
import {ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Image,} from "react-native";
import {Layout, Text, TextInput, Button, useTheme, themeColor,} from "react-native-rapi-ui";
import $axios from "../../plugins/axios";
import {useAuthStore} from "../../store/auth.store";
import {useUserStore} from "../../store/user.store";

export default function ({navigation}) {
    const {isDarkmode, setTheme} = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function login() {
        setLoading(true);
        await $axios.post(`collab/connect`, {mail: email, motdepasse: password})
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
        <KeyboardAvoidingView behavior="height" enabled style={{flex: 1}}>
            <Layout>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
                        }}
                    >
                        <Image
                            resizeMode="contain"
                            style={{
                                height: 220,
                                width: 220,
                            }}
                            source={require("../../../assets/mns-fulllogo.png")}
                        />
                    </View>
                    <View
                        style={{
                            flex: 3,
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
                        }}
                    >
                        <Text
                            fontWeight="bold"
                            style={{
                                alignSelf: "center",
                                padding: 30,
                            }}
                            size="h3"
                        >
                            Se connecter
                        </Text>
                        <Text>Email</Text>
                        <TextInput
                            containerStyle={{marginTop: 15}}
                            placeholder="Votre e-mail"
                            value={email}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={(text) => setEmail(text)}
                        />

                        <Text style={{marginTop: 15}}>Mot de passe</Text>
                        <TextInput
                            containerStyle={{marginTop: 15}}
                            placeholder="Votre mot de passe"
                            value={password}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <Button
                            text={loading ? "Loading" : "Se connecter"}
                            onPress={() => {
                                login();
                            }}
                            style={{
                                marginTop: 20,
                            }}
                            disabled={loading}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ForgetPassword");
                                }}
                            >
                                <Text size="md" fontWeight="bold">
                                    Première connexion / mot de passe oubliée
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 30,
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    isDarkmode ? setTheme("light") : setTheme("dark");
                                }}
                            >
                                <Text
                                    size="md"
                                    fontWeight="bold"
                                    style={{
                                        marginLeft: 5,
                                    }}
                                >
                                    {isDarkmode ? "☀️ mode lumineux" : "🌑 mode sombre"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Layout>
        </KeyboardAvoidingView>
    );
}
