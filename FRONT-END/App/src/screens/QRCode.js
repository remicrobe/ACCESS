import React from "react";
import {View} from "react-native";
import {
    Layout,
    TopNav,
    Text,
    themeColor,
    useTheme,
} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";

export default function ({navigation}) {
    const {isDarkmode} = useTheme();
    return (
        <Layout>

            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* This text using ubuntu font */}
                <Text fontWeight="bold">Ici on affiche le QRCode</Text>
            </View>
        </Layout>
    );
}
