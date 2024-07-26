import React, { useEffect, useRef } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Login from "../screens/connexion/Login";
import ForgetPassword from "../screens/connexion/ForgetPassword";
import QRCode from "../screens/QRCode";
import Planning from "../screens/Planning";
import Activity from "../screens/Activity";
import Timesheet from '../screens/Timesheet';
import AskVacation from "../screens/AskVacation";
import Requests from "../screens/Requests";
import { useUserStore } from "../store/user.store";
import { COLORS } from "../color";
import { View, Image, StyleSheet } from "react-native";

const MainStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();
const ActivityStack = createNativeStackNavigator();
const QRCodeStack = createNativeStackNavigator();
const PlanningStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const HomeTabs = () => {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="Timesheet" component={Timesheet} />
        </HomeStack.Navigator>
    );
};

const ActivityTabs = () => {
    return (
        <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
            <ActivityStack.Screen name="Activity" component={Activity} />
            <PlanningStack.Screen name="AskVacation" component={AskVacation} />
            <ActivityStack.Screen name="Requests" component={Requests} />
        </ActivityStack.Navigator>
    );
};

const QRCodeTabs = () => {
    return (
        <QRCodeStack.Navigator screenOptions={{ headerShown: false }}>
            <QRCodeStack.Screen name="QRCode" component={QRCode} />
        </QRCodeStack.Navigator>
    );
};

const PlanningTabs = () => {
    return (
        <PlanningStack.Navigator screenOptions={{ headerShown: false }}>
            <PlanningStack.Screen name="PlanningHome" component={Planning} />
        </PlanningStack.Navigator>
    );
};

const ProfileTabs = () => {
    const navigation = useNavigation();
    const ref = useRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            if (ref.current) {
                ref.current.reset({
                    index: 0,
                    routes: [{ name: 'Profile' }],
                });
            }
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }} ref={ref}>
            <ProfileStack.Screen name="Profile" component={Profile} />
        </ProfileStack.Navigator>
    );
};

const MainTabs = () => {
    const { isDarkmode } = useTheme();

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
            <Tabs.Screen
                name="Accueil"
                component={HomeTabs}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"home-outline"} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: () => {
                        // Reset stack when tab is pressed
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    },
                })}
            />
            <Tabs.Screen
                name="Mes demandes"
                component={ActivityTabs}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"time-outline"} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: () => {
                        // Reset stack when tab is pressed
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Activity' }],
                        });
                    },
                })}
            />
            <Tabs.Screen
                name="QR Code"
                component={QRCodeTabs}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
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
                                   source={focused ? require("../../assets/close.png") : require("../../assets/qr-code.png")} />
                        </View>
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: () => {
                        // Reset stack when tab is pressed
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'QRCode' }],
                        });
                    },
                })}
            />
            <Tabs.Screen
                name="Planning"
                component={PlanningTabs}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"calendar"} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: () => {
                        // Reset stack when tab is pressed
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'PlanningHome' }],
                        });
                    },
                })}
            />
            <Tabs.Screen
                name="Mes infos"
                component={ProfileTabs}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"person"} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: () => {
                        // Reset stack when tab is pressed
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Profile' }],
                        });
                    },
                })}
            />
        </Tabs.Navigator>
    );
};

const Main = () => {
    useEffect(() => {
        async function fetchUserData() {
            let res = await useUserStore.getState().getUserData();
            if (!res) {
                navigationRef.current?.navigate("Login");
                alert("Nous n'avons pu récupérer vos informations, veuillez essayer de vous reconnecter !");
            } else {
                navigationRef.current?.navigate("MainTabs");
            }
        }

        fetchUserData();
    }, []);

    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="Login" component={Login} />
            <MainStack.Screen name="ForgetPassword" component={ForgetPassword} />
            <MainStack.Screen name="MainTabs" component={MainTabs} />
        </MainStack.Navigator>
    );
};

const navigationRef = React.createRef();

export default () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Main />
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    qrcodeIcon: {
        height: 35,
        width: 35,
    },
});
