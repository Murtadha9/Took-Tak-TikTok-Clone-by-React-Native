
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./../../Uitlis/FirebaseConfig";
import Colors from "../../Uitlis/Colors";
import { supabase } from "./../../Uitlis/SupabaseConfig";
import { useUser } from "@clerk/clerk-expo";

const PreviewScreen = () => {
  const [descr, setDescr] = useState("");
  const navigation = useNavigation();
  const params = useRoute().params;
  const { user } = useUser();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    console.log(params);
  }, []);

  const uploadFileToFirebase = async (fileUri, folder) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const filename = fileUri.split("/").pop();
      const storageRef = ref(storage, `${folder}/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading ${folder} to Firebase:`, error);
      return null;
    }
  };
  
  const PublishHandler = async () => {
    setLoad(true); // Show loading indicator
    try {
      const videoUrl = await uploadFileToFirebase(params.video, "videos");
      const thumbnailUrl = await uploadFileToFirebase(params.thumbnail, "thumbnails");
  
      if (videoUrl && thumbnailUrl) {
        // Check if user exists in Users table
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("*")
          .eq("email", user?.primaryEmailAddress?.emailAddress)
          .single();
  
        if (userError) {
          console.error("Error fetching user:", userError);
          alert(`Error fetching user: ${userError.message}`);
          setLoad(false);
          return;
        }
  
        if (!userData) {
          console.error("User does not exist in Users table");
          alert("User does not exist in Users table");
          setLoad(false);
          return;
        }
  
        const { data, error } = await supabase.from("videos").insert([
          {
            videoUrl: videoUrl,
            thumbnail: thumbnailUrl,
            description: descr,
            emailRef: user?.primaryEmailAddress?.emailAddress,
          },
        ]);
  
        if (error) {
          console.error("Error saving video URL to Supabase:", error);
          alert(`Error saving video URL to Supabase: ${error.message}`);
        } else {
          console.log("Video URL saved to Supabase:", data);
          navigation.navigate("home");
        }
      } else {
        alert("Failed to upload video or thumbnail.");
      }
    } catch (error) {
      console.error("Error publishing video:", error);
      alert(`Error publishing video: ${error.message}`);
    } finally {
      setLoad(false); // Hide loading indicator
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
            {load ? (
              <ActivityIndicator size="small" color={Colors.WHITE} />
            ) : (
              <Text style={{ color: Colors.WHITE }}>Publish</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PreviewScreen;
