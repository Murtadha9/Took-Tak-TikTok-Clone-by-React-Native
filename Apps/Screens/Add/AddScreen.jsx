
import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "../../Uitlis/Colors";
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { supabase } from './../../Uitlis/SupabaseConfig';

const AddScreen = () => {
  const navigation = useNavigation();
  const [vid, setVid] = useState(null);

  const SelectVideoFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      GenerateVideoThumbnails(result.assets[0].uri);
    }
  };

  const GenerateVideoThumbnails = async (videoUrl) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        videoUrl,
        {
          time: 10000,
        }
      );

      navigation.navigate("prev-screen", {
        video: videoUrl,
        thumbnail: uri,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Image
        source={require("./../../../assets/images/add.png")}
        style={{ width: 150, height: 150 }}
      />
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
        Start Uploading Short Videos
      </Text>

      <TouchableOpacity
        onPress={SelectVideoFile}
        style={{
          backgroundColor: Colors.BLACK,
          padding: 10,
          paddingHorizontal: 25,
          borderRadius: 99,
          marginTop: 20,
        }}
      >
        <Text style={{ color: Colors.WHITE }}>Select Video File</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddScreen;
