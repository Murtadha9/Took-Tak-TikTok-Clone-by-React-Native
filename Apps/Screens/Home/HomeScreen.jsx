import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Uitlis/SupabaseConfig";

const HomeScreen = () => {
  const { user } = useUser();

  useEffect(()=>{
   
      user&&updateProfileImage();

  },[user])

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from("Users")
      .update({
        profileImage: user?.imageUrl,
      })
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .is("profileImage", null)
      .select()
      console.log(data)
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;
