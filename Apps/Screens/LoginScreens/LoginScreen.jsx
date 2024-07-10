import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Video, ResizeMode } from "expo-av";
import Colors from "../../Uitlis/Colors";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';


export const useWarmUpBrowser = () => {
    React.useEffect(() => {
      // Warm up the android browser to improve UX
      // https://docs.expo.dev/guides/authentication/#improving-user-experience
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, []);
  };
  
  WebBrowser.maybeCompleteAuthSession();





const LoginScreen = () => {


    useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({ redirectUrl: Linking.createURL("/dashboard", { scheme: "tooktak" })});

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);





  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{
          uri: "https://cdn.pixabay.com/video/2024/03/04/202987-919379330_tiny.mp4",
        }}
        shouldPlay
        resizeMode="cover"
        isLooping={true}
        style={styles.viedo}
      />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 100,
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: Colors.BACKGROUND_TRANS,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.WHITE,
            fontSize: 35,
          }}
        >
          Took Tak
        </Text>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 16,
            textAlign: "center",
            marginTop: 15,
          }}
        >
          Find funny viedos and sharing with your friends{" "}
        </Text>

        <TouchableOpacity
        onPress={onPress}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexDirection: "row",
            padding: 5,
            paddingHorizontal: 55,
            backgroundColor: Colors.WHITE,
            borderRadius: 99,
            position: "absolute",
            bottom: 150,
          }}
        >
          <Image
            style={{ width: 50, height: 50 }}
            source={require("./../../../assets/images/google.png")}
          />
          <Text style={{}}>Sign In With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  viedo: {
    height: "100%",
    width: 1000,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
