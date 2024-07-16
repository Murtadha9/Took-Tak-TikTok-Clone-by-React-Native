import { View, Text, FlatList } from 'react-native'
import React from 'react'
import VideoThumbnail from '../Home/VideoThumbnail'

const UserPostList = ({postList , GetLatestVideo , loading}) => {
  return (
    <View>
       <FlatList
          data={postList}
          numColumns={2}
          style={{ display: "flex" }}
          onRefresh={GetLatestVideo}
          refreshing={loading}
         // onEndReached={() => setLoadCount(loadCount + 7)}
          
          renderItem={({ item , index }) => (
            <VideoThumbnail video={item} key={item.id} refreshData={()=>GetLatestVideo()}/>
          )}
        />
    </View>
  )
}

export default UserPostList