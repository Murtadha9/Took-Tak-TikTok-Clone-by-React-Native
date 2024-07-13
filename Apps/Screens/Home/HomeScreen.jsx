import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Uitlis/SupabaseConfig";
import VideoThumbnail from "./VideoThumbnail";

const HomeScreen = () => {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    user && updateProfileImage();
    setLoadCount(0);
  }, [user]);

  useEffect(() => {
    GetLatestVideo();
  }, [loadCount]);

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from("Users")
      .update({
        profileImage: user?.imageUrl,
      })
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .is("profileImage", null)
      .select();
    //console.log(data);
  };

  const GetLatestVideo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*, Users(username, name, profileImage)")
        .range(loadCount, loadCount + 7)
        .order("id", { ascending: false });

      if (error) throw error;
      setVideoList(videoList=>[...videoList ,...data]);
      if (data) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching latest videos:", error);
    }
  };

  return (
    <View style={{ padding: 20, paddingTop: 25 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Took-Tak</Text>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 99 }}
        />
      </View>

      <View>
        <FlatList
          data={videoList}
          style={{ display: "flex" }}
          onRefresh={GetLatestVideo}
          refreshing={loading}
          onEndReached={() => setLoadCount(loadCount + 7)}
          //onEndReachedThreshold={0.2}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View key={index}>
              <VideoThumbnail video={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
