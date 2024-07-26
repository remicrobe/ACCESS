import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Layout, Text, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import $axios from "../plugins/axios";
import {Header} from "../header/Header";
import { COLORS } from "../color";
import { useNavigation } from '@react-navigation/native';


export default function ({ navigation }) {
    const s = require('../style');
    const [loading, setLoading] = useState(false);
    const [historique, setHistorique] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    }, []);

    const { navigate } = useNavigation();

    const navigateToAskVacation  = () => {
        navigate('AskVacation');
    };

    const navigateToAllRequests = () => {
        navigate('Requests');
    };

    function fetchData() {
        return new Promise((resolve, reject) => {
            // Replace 'get' with 'post' if required
            $axios.get('/historique/me')
                .then((res) => {
                    setHistorique(res.data);
                    resolve();
                })
                .catch((err) => {
                    alert("Une erreur est survenue lors de la récupération de l'historique");
                    reject(err);
                }).finally(() => {
                setLoading(false);
            });
        });
    }

    function renderAccessItem(access) {
        return (
            <View key={access.id} style={styles.accessItem}>
                <Text>{access.date}</Text>
                <Text>Type d'action: {access.typeAction}</Text>
                {access.actionAutorise ? (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                ) : (
                    <Ionicons name="close-circle" size={24} color="red" />
                )}
            </View>
        );
    }


    return (
        <Layout>
            <Header/>
            <View style={s.container}>
                <View style={s.header}>
                    <Text style={s.bold}>Mes demandes</Text>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <TouchableOpacity
                        style={styles.buttonDetails}
                        onPress={navigateToAskVacation}
                    >
                        <Text style={{ color: COLORS.primary, textAlign: 'center' }}>Faire une demande de congé</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonDetails}
                        onPress={navigateToAllRequests}
                    >
                        <Text style={{ color: COLORS.primary, textAlign: 'center' }}>Voir l'état de mes demandes</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <View>
                            {historique.map((access) => renderAccessItem(access))}
                        </View>
                    )}
                </ScrollView>
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
