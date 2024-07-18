import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import React from "react";
import { Video, ResizeMode } from "expo-av";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Colors from "../../Uitlis/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PlayVideoItem = ({ video, activeIndex, index, useLikeHandler, user }) => {
  const videoRef = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const BottomTabHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get("window").height - BottomTabHeight;
  const navigation = useNavigation();

  const checkIsUserLike = () => {
    const result = video?.videoLikes?.find(
      (item) => item.userEmial == user?.primaryEmailAddress?.emailAddress
    );
    return result;
  };

  const onOtherUserProfilePress = (otherUser) => {
    navigation.navigate("other", {
      user: otherUser,
    });
  };


  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this cool content!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 20,
          padding: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "flex-end",
        }}
      >
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => onOtherUserProfilePress(video.Users)}
            >
              <Image
                source={{ uri: video?.Users.profileImage }}
                style={{ width: 40, height: 40, borderRadius: 99 }}
              />
            </TouchableOpacity>
            <Text style={{ color: Colors.WHITE, fontSize: 16 }}>
              {video?.Users.name}
            </Text>
          </View>
          <Text style={{ color: Colors.WHITE }}>{video?.description}</Text>
        </View>

        <View style={{ display: "flex", gap: 15 }}>
          <>
            {checkIsUserLike() ? (
              <TouchableOpacity onPress={() => useLikeHandler(video, true)}>
                <Ionicons name="heart" size={35} color="red" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => useLikeHandler(video, false)}>
                <Ionicons name="heart-outline" size={35} color="white" />
              </TouchableOpacity>
            )}
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                marginTop: -15,
              }}
            >
              {video?.videoLikes?.length}
            </Text>
          </>

          <Ionicons
            name="chatbubble-ellipses-outline"
            size={35}
            color="white"
          />

          <TouchableOpacity onPress={onShare}>
            <Ionicons name="share-social-outline" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Video
        ref={videoRef}
        style={[styles.video, { height: screenHeight }]}
        source={{
          uri: video?.videoUrl,
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay={activeIndex == index}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
};

export default PlayVideoItem;

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    width: Dimensions.get("window").width,
  },
});
