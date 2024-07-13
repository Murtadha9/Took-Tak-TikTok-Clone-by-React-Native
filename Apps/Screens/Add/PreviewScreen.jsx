import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./../../Uitlis/FirebaseConfig";
import Colors from "../../Uitlis/Colors";
import { supabase } from "./../../Uitlis/SupabaseConfig";

const PreviewScreen = () => {
  const [descr, setDescr] = useState("");
  const navigation = useNavigation();
  const params = useRoute().params;

  useEffect(() => {
    console.log(params);
  }, []);

  const uploadToFirebase = async (videoUri) => {
    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const filename = videoUri.split("/").pop();
      const storageRef = ref(storage, `videos/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading video:", error);
      return null;
    }
  };

  const PublishHandler = async () => {
    const videoUrl = await uploadToFirebase(params.video);
    if (videoUrl) {
      const { data, error } = await supabase.from("videos").insert([
        {
          videoUrl: videoUrl,
          thumbnail: params.thumbnail, // Ensure this column exists or adjust as needed
          description: descr,
          emailRef: "user@example.com", // Replace this with actual user email or data
        },
      ]);
      if (error) {
        console.error("Error saving video URL to Supabase:", error);
        alert(`Error saving video URL to Supabase: ${error.message}`);
      } else {
        console.log("Video URL saved to Supabase:", data);
        navigation.navigate("home");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ padding: 20, backgroundColor: Colors.WHITE, flex: 1 }}
    >
      <ScrollView style={{ padding: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="arrow-back-circle" size={44} color="black" />
          <Text style={{ fontSize: 20 }}>Back</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 80 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Add Details</Text>
          <Image
            source={{ uri: params?.thumbnail }}
            style={{ width: 200, height: 300, borderRadius: 20, marginTop: 20 }}
          />
          <TextInput
            numberOfLines={3}
            placeholder="Description......"
            onChangeText={(value) => setDescr(value)}
            style={{
              borderWidth: 1,
              width: "100%",
              borderRadius: 10,
              marginTop: 25,
              borderColor: Colors.BACKGROUND_TRANS,
              paddingHorizontal: 10,
            }}
          />

          <TouchableOpacity
            onPress={PublishHandler}
            style={{
              backgroundColor: Colors.BLACK,
              padding: 10,
              paddingHorizontal: 25,
              borderRadius: 99,
              marginTop: 20,
            }}
          >
            <Text style={{ color: Colors.WHITE }}>Publish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PreviewScreen;
