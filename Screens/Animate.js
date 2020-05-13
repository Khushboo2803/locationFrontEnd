import React, { useRef, useEffect, useState } from "react";
import { Animated, View, StyleSheet, Alert, PanResponder, Text, Image, TouchableOpacity, ActivityIndicator, BackHandler, ImageBackground, Dimensions } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import nearble from './ble';
import fun from '../functions/fun.js';

const b=require('./ble.js');
async function deleteToken(props)
{
  const { navigation } = props;
    Alert.alert("LogOut", "Are you sure you want to logout",
    [
      {
        text:"No",
        onPress: ()=>{return}
        
      },
      {
        text:"Yes",
        onPress: async()=>{await AsyncStorage.removeItem('user');
        navigation.navigate('home');}  
      }

    ])
    
    
}
function backAction(){
    Alert.alert("Hold on!", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

const { width, height } = Dimensions.get('window');

// sizes
class BlinkingClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showText: true};
 
    // Change the state every second or the time given by User.
    setInterval(() => {
      this.setState(previousState => {
        return { showText: !previousState.showText };
      });
    }, 
    // Define any blinking time.
    1000);
  }
 
  render() {
    let display = this.state.showText ? this.props.text : ' ';
    return (
      <View>
      

      <Text style = {{ 
        textAlign: 'center',
        color: 'white',
        fontSize: 25,
        marginTop:height*0.69,
        fontFamily: 'sans-serif-light'
       }}>{display}</Text>
      </View>
    );
  }
}


export default (props) => {
  const [user, getUser]=useState('');
   useEffect(() => {
    
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  const { navigation } = props;
  
  return (
   <ImageBackground source={require('../assets/loginbg.jpg')} style={{
     height: '100%',
     width: '100%'
   }}>
    <View style={{ flex: 1 }}>
    <View style={{flexDirection:'row'}}>
    <View >
    <Image 
      source={require('../assets/slide-right.png')}
      style={{
        height:40,
        width:40,
        marginTop:0,
        marginLeft:width*0.05
      }}
    />
    <Text style={{
      fontSize:16,
      fontWeight:'bold',
      color:'darkgray',
      marginLeft:width*0.03,
      fontFamily:'monospace'
    }}>Slide this way...</Text>
    </View>
      <TouchableOpacity onPress={()=>{deleteToken(props)}}>
    <Image
      source={require('../assets/log-out.jpg')}
      style={{
        height:60,
        width:60,
        marginLeft:'50%',
        borderBottomLeftRadius:9
      }}
      />
      <Text
      style={{
        height:40,
        width:80,
        marginLeft:'50%',
        color:'red',
        fontWeight:'bold'
      }}>sign-out </Text>  
    </TouchableOpacity>  
    
    </View>
    
    <View>
        <BlinkingClass text='we are fetching your location. Stay home, stay safe!' />
    </View> 

    </View>
    </ImageBackground>
    
  );
};

