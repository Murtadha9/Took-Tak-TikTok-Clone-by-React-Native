import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import OtherProfileIntro from "./OtherProfileIntro";
import { supabase } from "../../Uitlis/SupabaseConfig";
import UserPostList from "../Profile/UserPostList";

const OtherUserProfile = () => {
  const params = useRoute().params;

  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params && GetUserPost();
  }, [params]);

  const GetUserPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("* , videoLikes(postIdRef,userEmial), Users(*)")
      .eq("emailRef", params.user.email)
      .order("id", { ascending: false });

    if (data) {
      setPostList(data);
      setLoading(false);
    }
    if (error) {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, paddingTop: 25 }}>
      <FlatList
        data={[{ id: 1 }]}
        renderItem={({ item, index }) => (
          <View>
            <OtherProfileIntro user={params.user} postList={postList} />
            <UserPostList
              postList={postList}
              GetLatestVideo={GetUserPost}
              loading={loading}
            />
          </View>
        )}
      />
    </View>
  );
};

export default OtherUserProfile;
