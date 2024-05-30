import React from "react";
import {View, Image, StyleSheet, Text} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {COLORS} from "../color";

export  function Header () {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
                AccessLink
            </Text>
            <Image 
                style={styles.headerImage}
                source={require('../../assets/mns-fulllogo.png')}
            />
            <View style={{
                height: 1,
                width: '80%',
                backgroundColor: 'black',
            }}></View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
    },
    headerImage: {
        height: 120,
        width: 130,
        resizeMode: "contain",
    },
    headerText: {
    fontSize: RFPercentage(6),
        fontWeight: "bold",
        color: COLORS.primary,
        marginTop: 20,
    },
});