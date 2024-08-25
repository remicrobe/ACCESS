import React, {useState} from "react";
import {
    ScrollView,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Image,
} from "react-native";
import {Header} from "../../header/Header";
import { COLORS } from "../../color";

import {
    Layout,
    Text,
    TextInput,
    Button,
    useTheme,
    themeColor,
} from "react-native-rapi-ui";
import $axios from "../../plugins/axios";

export default function ({navigation}) {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function forget() {
        setLoading(true);
        await $axios.post(`collab/demande-recuperation/`, {mail: email})
            .then((res) => {
                alert(`Vous avez reçu un mail !`);
                navigation.navigate("Login");
            })
            .catch((err) => {
                alert(`Une erreur est survenue !`);
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
                            backgroundColor: COLORS.base
                        }}
                    >
                    <Header/>
                    </View>
                    <View
                        style={{
                            flex: 3,
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            backgroundColor: COLORS.base
                        }}
                    >
                        <Text
                            size="h3"
                            fontWeight="bold"
                            style={{
                                alignSelf: "center",
                                padding: 30,
                                textAlign: "center",
                            }}
                        >
                            Problème de connexion
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
                        <Button
                            text={loading ? "Loading" : "Recevoir de l'aide par mail"}
                            onPress={() => {
                                forget();
                            }}
                            style={{
                                marginTop: 20,
                            }}
                            disabled={loading}
                            color="#4793CA"
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 15,
                                justifyContent: "center",
                            }}
                        >

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("Login");
                                }}
                            >
                                <Text
                                    size="md"
                                    fontWeight="bold"
                                    style={{
                                        marginLeft: 5,
                                    }}
                                >
                                    Je veux me connecter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Layout>
        </KeyboardAvoidingView>
    );
}
