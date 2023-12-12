import React, {useEffect} from "react";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import {themeColor, useTheme} from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import Home from "../screens/Home";
import SecondScreen from "../screens/QRCode";
import About from "../screens/Planning";
import Profile from "../screens/Profile";
import {View} from "react-native";
import Login from "../screens/connexion/Login";
import ForgetPassword from "../screens/connexion/ForgetPassword";
import QRCode from "../screens/QRCode";
import Planning from "../screens/Planning";
import Activity from "../screens/Activity";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCollabData} from '../../App';

const MainStack = createNativeStackNavigator();
const Main = () => {
    const navigation = useNavigation();

    useEffect(() => {
        try {
            getCollabData()
                .then((collabData) => {
                    if (collabData === null) {
                        navigation.navigate("Login");
                    } else {
                        navigation.navigate("MainTabs");
                    }
                });

        } catch (error) {
            alert('Une erreur est survenue lors de la récupération de vos données, veuillez vous reconnecter.');
        }
    }, []);
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <MainStack.Screen name="Login" component={Login}/>
            <MainStack.Screen name="ForgetPassword" component={ForgetPassword}/>
            <MainStack.Screen name="MainTabs" component={MainTabs}/>
            <MainStack.Screen name="QRCode" component={QRCode}/>
        </MainStack.Navigator>
    );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
    const {isDarkmode} = useTheme();

    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
                    backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
                },
            }}
        >
            {/* these icons using Ionicons */}
            <Tabs.Screen
                name="Accueil"
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} icon={"md-home"}/>
                    ),
                }}
            />

            <Tabs.Screen
                name="Mon activité"
                component={Activity}
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} icon={"analytics-outline"}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="QR Code"
                component={QRCode}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({focused}) => (
                        <View style={{
                            position: 'absolute',
                            bottom: 15, // space from bottombar
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            backgroundColor: 'grey', // background color of the button
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TabBarIcon focused={focused} icon={"qr-code-outline"}/>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="Planning"
                component={Planning}
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} icon={"calendar"}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Mes infos"
                component={Profile}
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} icon={"person"}/>
                    ),
                }}
            />
        </Tabs.Navigator>
    );
};


export default () => {
    return (
        <NavigationContainer>
            <Main/>
        </NavigationContainer>
    );
};
