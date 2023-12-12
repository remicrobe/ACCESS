import React, {useEffect} from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import {ThemeProvider} from "react-native-rapi-ui";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseUrl = 'https://access-api-38cea021d5b8.herokuapp.com';

export async function getCollabData() {
    collabData = JSON.parse(await AsyncStorage.getItem('userData'));
    return collabData;
}

export let collabData = null;

export async function disconnectCollab() {
    return await AsyncStorage.clear();
}

export default function App() {

    return (
        <ThemeProvider>
            <AppNavigator/>
        </ThemeProvider>
    );
}
