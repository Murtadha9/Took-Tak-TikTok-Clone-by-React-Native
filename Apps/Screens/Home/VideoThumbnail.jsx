
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React from "react";
import Colors from "../../Uitlis/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Uitlis/SupabaseConfig";

const VideoThumbnail = ({ video, refreshData }) => {
  const navigation = useNavigation();
  const { user } = useUser();

  const onDeleteHandler = async (video) => {
    Alert.alert("DELETE VIDEO", "Are you sure you want to delete this video?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          console.log("cancel");
        },
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deletePostVideo(video),
      },
    ]);
  };

  const deletePostVideo = async (video) => {
    await supabase.from("videoLikes").delete().eq("postIdRef", video.id);

    const { error } = await supabase.from("videos").delete().eq("id", video.id);

    if (error) {
      console.error("Error deleting video:", error);
      ToastAndroid.show("Error deleting post", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Post Deleted", ToastAndroid.SHORT);
      refreshData();
    }
  };

  return (
    <View
      onPress={() =>
        navigation.navigate("play-screen", {
          selectedVideo: video,
        })
      }
      style={{ flex: 1 }}
    >
      {user.primaryEmailAddress.emailAddress === video.Users.email && (
        <TouchableOpacity
          onPress={() => onDeleteHandler(video)}
          style={{ position: "absolute", zIndex: 10, right: 0, padding: 20 }}
        >
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("play-screen", {
            selectedVideo: video,
          })
        }
        style={{ flex: 1, margin: 10 }}
      >
        <>
          <View
            style={{
              position: "absolute",
              zIndex: 10,
              bottom: 0,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image
                source={{ uri: video?.Users?.profileImage }}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: Colors.WHITE,
                  borderRadius: 99,
                }}
              />
              <Text style={{ color: Colors.WHITE, fontSize: 12 }}>
                {video?.Users?.name}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ color: Colors.WHITE, fontSize: 12 }}>
                {video?.videoLikes?.length}
              </Text>
              <Ionicons name="heart-sharp" size={24} color="white" />
            </View>
          </View>

          <Image
            source={{ uri: video?.thumbnail }}
            style={{ width: "100%", height: 250, borderRadius: 15 }}
            onError={(error) =>
              console.log("Error loading image:", error.nativeEvent.error)
            }
          />
        </>
      </TouchableOpacity>
    </View>
  );
};

export default VideoThumbnail;
