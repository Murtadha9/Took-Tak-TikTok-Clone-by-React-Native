import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "../../Uitlis/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const VideoThumbnail = ({ video }) => {
  const navigation = useNavigation();

  return (
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
            <Text style={{ color: Colors.WHITE, fontSize: 12 }}>{video?.videoLikes?.length}</Text>
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
  );
};

export default VideoThumbnail;
