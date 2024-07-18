
import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Uitlis/SupabaseConfig";
import VideoThumbnail from "./VideoThumbnail";

const HomeScreen = () => {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    if (user) {
      updateProfileImage();
      setLoadCount(0);
      setVideoList([]); // Reset video list on user change
    }
  }, [user]);

  useEffect(() => {
    GetLatestVideo();
  }, [loadCount]);

  const updateProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .update({
          profileImage: user?.imageUrl,
        })
        .eq("email", user?.primaryEmailAddress?.emailAddress)
        .is("profileImage", null)
        .select();

      if (error) throw error;
      console.log("Profile image updated:", data);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const GetLatestVideo = async () => {
    setLoading(true);
  
      const { data, error } = await supabase
        .from("videos")
        .select("*, Users(username, name, profileImage ,email),videoLikes(postIdRef,userEmial)")
        .range(loadCount, loadCount + 7)
        .order("id", { ascending: false });

      setVideoList(videoList => [...data]);
      console.log(error);
      if(data){
        setLoading(false);
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
          numColumns={2}
          style={{ display: "flex" }}
          onRefresh={()=>GetLatestVideo()}
          refreshing={loading}
          onEndReached={() => setLoadCount(loadCount + 7)}
          
          renderItem={({ item , index }) => (
            <VideoThumbnail video={item} key={item.id} refreshData={()=>console.log('delete')}/>
          )}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
