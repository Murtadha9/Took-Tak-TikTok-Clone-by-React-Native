import { View, Text } from 'react-native'
import React from 'react'

import PreviewScreen from "../Screens/Add/PreviewScreen";
import HomeScreen from '../Screens/Home/HomeScreen';
import PlayViedoList from '../Screens/Home/PlayViedoList';
import { createStackNavigator } from '@react-navigation/stack';
import OtherUserProfile from '../Screens/OtherUserProfile/OtherUserProfile';
import { useRoute } from '@react-navigation/native';

const Stack = createStackNavigator();

const HomeScreenNavigations = () => {

  

    return (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="home-screen" component={HomeScreen} />
          <Stack.Screen name="play-screen" component={PlayViedoList} />
          <Stack.Screen name="other" component={OtherUserProfile} />
        </Stack.Navigator>
      );
  
}

export default HomeScreenNavigations