import React, { useEffect } from "react";
import { NavigationContainer, useNavigation, CommonActions } from "@react-navigation/native";
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

const HomeTabs = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
);

const ActivityTabs = () => (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
        <ActivityStack.Screen name="Activity" component={Activity} />
        <ActivityStack.Screen name="AskVacation" component={AskVacation} />
        <ActivityStack.Screen name="Requests" component={Requests} />
    </ActivityStack.Navigator>
);

const QRCodeTabs = () => (
    <QRCodeStack.Navigator screenOptions={{ headerShown: false }}>
        <QRCodeStack.Screen name="QRCode" component={QRCode} />
    </QRCodeStack.Navigator>
);

const PlanningTabs = () => (
    <PlanningStack.Navigator screenOptions={{ headerShown: false }}>
        <PlanningStack.Screen name="PlanningScreen" component={Planning} />
    </PlanningStack.Navigator>
);

const ProfileTabs = () => {
    const navigation = useNavigation();


    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="Profile" component={Profile} />
            <ProfileStack.Screen name="Timesheet" component={Timesheet} />
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
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            })
                        );
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
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Activity' }],
                            })
                        );
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
                                   source={require("../../assets/qr-code.png")} />
                        </View>
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'QRCode' }],
                            })
                        );
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
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Profile' }],
                            })
                        );
                    },
                })}
            />
        </Tabs.Navigator>
    );
};

const Main = () => {
    const navigationRef = React.createRef();

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

export default () => (
    <NavigationContainer ref={navigationRef}>
        <Main />
    </NavigationContainer>
);

const styles = StyleSheet.create({
    qrcodeIcon: {
        height: 35,
        width: 35,
    },
});
