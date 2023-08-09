import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import SearchScreen from "../screens/SearchScreen";
import ConfigScreen from "../screens/ConfigScreen";
import SearchItemScreen from "../screens/SearchItemScreen";

export type RootStackParamsList = {
  OnboardingScreen: undefined;
  HomeScreen: undefined;
  TransactionsScreen: undefined;
  StatisticsScreen: undefined;
  SearchScreen: undefined;
  ConfigScreen: undefined;
  SearchItemScreen: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamsList>();

export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ animation: "fade" }}>
      {/* <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionsScreen"
        component={TransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfigScreen"
        component={ConfigScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchItemScreen"
        component={SearchItemScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
