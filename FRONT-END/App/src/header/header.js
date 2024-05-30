import React from "react";
import {View, Image, StyleSheet, Text} from "react-native";
export  function Header () {
    return (
        <View style={styles.headerContainer}>
            <Image 
                style={styles.headerImage}
                source={require('../../assets/mns-fulllogo.png')}
            />
            <Text style={styles.headerText}>
                AccessLink
            </Text>
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
});