import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import PlayVideoItem from "./PlayVideoItem";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../Uitlis/SupabaseConfig";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useUser } from "@clerk/clerk-expo";

const PlayViedoList = () => {
  const params = useRoute().params;
  const [videoList, setVideoList] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState();
  const BottomTabHeight = useBottomTabBarHeight();
  const windowHeight = Dimensions.get("window").height;

  const { user } = useUser();

  useEffect(() => {
    setVideoList([params.selectedVideo]);
    GetLatestVideo();
  }, []);

  const GetLatestVideo = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("videos")
      .select(
        "*, Users(username, name, profileImage,email),videoLikes(postIdRef,userEmial)"
      )
      .range(0, 7)
      .order("id", { ascending: false });

    const result = data.filter((item) => item.id != params.selectedVideo.id);
    setVideoList((videoList) => [...videoList, ...result]);

    if (data) {
      setLoading(false);
    }
  };

  const useLikeHandler = async (videoPost, isLike) => {
    if (!isLike) {
      const { data, error } = await supabase
        .from("videoLikes")
        .insert([
          {
            postIdRef: videoPost.id,
            userEmial: user?.primaryEmailAddress?.emailAddress,
          },
        ])
        .select();

      if (!error) {
        updateLocalLikeState(videoPost.id, true);
      }
    } else {
      const { error } = await supabase
        .from("videoLikes")
        .delete()
        .eq("postIdRef", videoPost.id)
        .eq("userEmial", user?.primaryEmailAddress?.emailAddress);

      if (!error) {
        updateLocalLikeState(videoPost.id, false);
      }
    }
  };

  const updateLocalLikeState = (videoId, isLike) => {
    setVideoList((currentList) =>
      currentList.map((video) =>
        video.id === videoId
          ? {
              ...video,
              videoLikes: isLike
                ? [...video.videoLikes, { postIdRef: videoId, userEmial: user?.primaryEmailAddress?.emailAddress }]
                : video.videoLikes.filter((like) => like.userEmial !== user?.primaryEmailAddress?.emailAddress),
            }
          : video
      )
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          zIndex: 10,
          padding: 10,
          paddingTop: 50,
        }}
      >
        <Ionicons name="arrow-back-circle" size={35} color="black" />
      </TouchableOpacity>
      <FlatList
        data={videoList}
        pagingEnabled
        keyExtractor={(item) => item.id.toString()}
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / (windowHeight - BottomTabHeight)
          );
          setCurrentVideoIndex(index);
        }}
        renderItem={({ item, index }) => (
          <PlayVideoItem
            video={item}
            activeIndex={currentVideoIndex}
            index={index}
            useLikeHandler={useLikeHandler}
            user={user}
          />
        )}
      />
    </View>
  );
};

export default PlayViedoList;
