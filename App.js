import React from 'react';
import axios from 'axios';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import MainScreen from './Screens/main.js';
import listView from './Screens/trials.js';
import locationTrack from './Screens/TrailsArray.js';
import Animate from './Screens/Animate.js';
import Admin from './Screens/admin.js';
import MapViewScreen from './Screens/MapView.js';
import login from './Screens/bluetooth.js';
const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false }}>
          <Stack.Screen name="home" component={MainScreen} />
          <Stack.Screen name="list" component={listView}/>
          <Stack.Screen name="loggedIn" component={login}/>
          <Stack.Screen name="admin" component={Admin}/>
          <Stack.Screen name="location" component={locationTrack}/>
          <Stack.Screen name="map" component={MapViewScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
