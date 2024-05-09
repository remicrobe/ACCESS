import React, {useEffect} from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import {ThemeProvider} from "react-native-rapi-ui";
import 'react-native-reanimated'

export default function App() {

    return (
        <ThemeProvider>
            <AppNavigator/>
        </ThemeProvider>
    );
}
