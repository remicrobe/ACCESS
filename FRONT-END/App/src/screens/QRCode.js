import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import {Button, Layout, Text, useTheme} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import $axios from "../plugins/axios";
import QRCodeComponent from "react-native-qrcode-svg";
import ProgressBar from 'react-native-progress/Bar';

export default function ({ navigation }) {
    const s = require('../style');
    const { isDarkmode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [qrCodeToken, setQrCodeToken] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        setLoading(true);
        getQRCode();
        const intervalId = setInterval(() => {
            getQRCode();
        }, 15000); // 15 seconds

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        if (!loading) {
            const intervalId = setInterval(() => {
                setLoadingProgress((prevProgress) => prevProgress + (1 / 15));
            }, 1000);

            return () => clearInterval(intervalId);
        } else {
            setLoadingProgress(0);
        }
    }, [loading]);

    function getQRCode() {
        $axios.post(`token/genererAppQrCode`)
            .then((res) => {
                setQrCodeToken(res.data);
            })
            .catch((err) => {
                alert("Une erreur est survenue lors de la récupération de votre QR code");
            }).finally(() => {
            setLoading(false);
            setLoadingProgress(0)
        });
    }

    return (
        <Layout>
            <View style={s.container}>
                <View style={s.header}>
                    <Ionicons name="qr-code-outline" size={96} color="#6c757d" />
                    <View>
                        <Text style={s.bold}>Votre badge d'accès</Text>
                    </View>
                </View>
                <View style={styles.qrContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        qrCodeToken && (
                            <QRCodeComponent
                                value={qrCodeToken}
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        )
                    )}
                </View>
                <ProgressBar progress={loadingProgress} width={null} />

                <Button
                    text="Recharger le QR Code"
                    color="red"
                    style={{ marginTop: 20 }}
                    onPress={getQRCode}
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
    qrContainer: {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    bold: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
