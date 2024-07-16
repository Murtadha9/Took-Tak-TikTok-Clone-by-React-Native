import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Uitlis/Colors";
import { Entypo } from '@expo/vector-icons';


const ProfileIntro = ({postList}) => {
  const { user } = useUser();

  const [totalPostLikes,setTotalPostLikes] = useState()

  useEffect(()=>{
    postList&&calcTotalLikes()
  },[postList])

  const calcTotalLikes=()=>{
    let totalLikes=0
    postList.forEach(element => {
        totalLikes=totalLikes+element?.videoLikes.length
    });
    setTotalPostLikes(totalLikes)
  }

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>Profile</Text>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 100, height: 100, borderRadius: 99 }}
        />
        <Text style={{ fontWeight: "400", fontSize: 20 }}>
          {user?.fullName}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: 20,
            color: Colors.BACKGROUND_TRANS,
          }}
        >
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ padding: 20 , alignItems:'center' }}>
          <Entypo name="video" size={30} color="black" />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{postList.length} Posts</Text>
        </View>

        <View style={{ padding: 20 , alignItems:'center'}}>
          <Entypo name="heart" size={30} color="black" />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{totalPostLikes} Likes</Text>
        </View>

      </View>


    </View>
  );
};

export default ProfileIntro;
