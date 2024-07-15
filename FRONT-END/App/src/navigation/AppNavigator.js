import React, {useEffect} from "react";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import {themeColor, useTheme} from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";

import Home from "../screens/Home";
import Profile from "../screens/Profile";
import {View, Image, StyleSheet} from "react-native";
import Login from "../screens/connexion/Login";
import ForgetPassword from "../screens/connexion/ForgetPassword";
import QRCode from "../screens/QRCode";
import Planning from "../screens/Planning";
import Activity from "../screens/Activity";
import Timesheet from '../screens/Timesheet';
import {useUserStore} from "../store/user.store";
import {COLORS} from "../color";

const MainStack = createNativeStackNavigator();
const Main = () => {
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchUserData() {
            let res = await useUserStore.getState().getUserData();

            if (!res) {
                navigation.navigate("Login");
                alert("Nous n'avons pu récupérer vos informations, veuillez essayer de vous reconnecter !")
            } else {
                navigation.navigate("MainTabs");
            }

        }
        fetchUserData()

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
            <MainStack.Screen name="Timesheet" component={Timesheet}/>
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
                        <TabBarIcon focused={focused} icon={"home-outline"}/>
                    ),
                }}
            />

            <Tabs.Screen
                name="Mes demandes"
                component={Activity}
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabBarIcon focused={focused} icon={"time-outline"}/>
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
                            bottom: 15,
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            backgroundColor: COLORS.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Image style={styles.qrcodeIcon}
                            source={focused ? require("../../assets/close.png") : require("../../assets/qr-code.png")}/>
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

const styles = StyleSheet.create({
    qrcodeIcon: {
        height: 35,
        width: 35,
    },
});