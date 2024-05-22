import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import {Button, Layout, Text, useTheme} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import $axios from "../plugins/axios";
import QRCodeComponent from "react-native-qrcode-svg";
import ProgressBar from 'react-native-progress/Bar';
import {COLORS} from "../color";

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
                <ProgressBar style={styles.progressBar} progress={loadingProgress} width={null} />
                <View style={styles.header}>
                    <View>
                        <Text style={styles.bold}>Votre badge d'accès</Text>
                        <View style={styles.subtitleGroup}>
                            <Text style={styles.subtitle}> Scannez ce QR Code pour entrer dans le bâtiment.</Text>
                            <Text style={styles.subtitle}> Placez votre téléphone à environ 10cm du lecteur.</Text>
                        </View>
                    </View>
                </View>
                <Button
                    text="Recharger le QR Code"
                    color= {COLORS.primary}
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
        alignItems: 'center',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginVertical: 16,
        justifyContent:'center',
    },
    qrContainer: {
        backgroundColor: 'transparent',
        borderColor: COLORS.primary,
        borderWidth: 4,
        paddingVertical: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    bold: {
        fontSize: 25,
        fontWeight: 'bold',
        textTransform: "uppercase",
        color: '#084B83',
    },
    subtitleGroup: {
        paddingTop: 20,
    },
    subtitle: {
        fontSize: 12,
    },
});
