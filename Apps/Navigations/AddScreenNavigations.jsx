import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddScreen from "../Screens/Add/AddScreen";
import PreviewScreen from "../Screens/Add/PreviewScreen";

const Stack = createStackNavigator();

const AddScreenNavigations = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="add-screen" component={AddScreen} />
      <Stack.Screen name="prev-screen" component={PreviewScreen} />
    </Stack.Navigator>
  );
};

export default AddScreenNavigations;
