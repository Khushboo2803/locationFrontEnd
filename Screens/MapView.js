import React, {useState} from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Animatable from 'react-native-animatable';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
    Keyboard,
    Platform, 
    BackHandler,
    Alert
} from "react-native"
import styles from './style.js';
import fun from '../functions/fun.js';

async function showDetails(location) {  
    location = JSON.parse(location);
    const response = await fun.getValue(location.lat, location.lon); 
    Alert.alert("Address", response);
  }

export default function Map({route, navigation}){
    var [cord] = useState('');
    var [arr] = useState('');
	arr = route.params.arr; 
    cord = route.params.cord;
    return (
        <MapView  // initializing map taking first cordinate as map stating postition
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }}
            initialRegion={{
                latitude: cord[0].latitude,
                longitude: cord[0].longitude,
                latitudeDelta: 0.0255,
                longitudeDelta: 0.0255,
            }}
        >
            {cord.map((cords, index) => (  // placing markers on map
                <Marker coordinate={cords} key={index} onPress={() => showDetails(arr[index])} />
            ))}
        </MapView>
    );
}