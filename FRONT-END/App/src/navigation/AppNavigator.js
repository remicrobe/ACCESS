import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import Home from "../screens/Home";
import SecondScreen from "../screens/SecondScreen";
import About from "../screens/About";
import Profile from "../screens/Profile";
import {View} from "react-native";

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
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
            {/* these icons using Ionicons */}
            <Tabs.Screen
                name="Accueil"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"md-home"} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Mon activité"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"analytics-outline"} />
                    ),
                }}
            />
            <Tabs.Screen
                name="QR Code"
                component={Home}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            position: 'absolute',
                            bottom: 20, // space from bottombar
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            backgroundColor: 'grey', // background color of the button
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TabBarIcon focused={focused} icon={"qr-code-outline"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="Planning"
                component={About}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"calendar"} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Mes infos"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} icon={"person"} />
                    ),
                }}
            />
        </Tabs.Navigator>
    );
};


export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
