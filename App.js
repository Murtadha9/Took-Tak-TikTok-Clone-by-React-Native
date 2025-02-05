import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./Apps/Screens/LoginScreens/LoginScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import HomeScreen from "./Apps/Screens/Home/HomeScreen";
import TabNavigations from "./Apps/Navigations/TabNavigations";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <View style={styles.container}>
        <SignedIn>
          <NavigationContainer>
            <TabNavigations />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
