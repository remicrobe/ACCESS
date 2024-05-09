import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { Layout, Text, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import $axios from "../plugins/axios";

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
            <View style={s.container}>
                <View style={s.header}>
                    <Ionicons name="analytics-outline" size={96} color="#6c757d" />

                    <Text style={s.bold}>Mon activité</Text>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
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
});
