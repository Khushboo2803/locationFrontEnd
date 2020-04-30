import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet, Alert, PanResponder, Text, Image, TouchableOpacity, ActivityIndicator, BackHandler } from "react-native";
import * as SecureStore from 'expo-secure-store';


async function deleteToken()
{
    await SecureStore.deleteItemAsync('user');
    const res= await SecureStore.getItemAsync('user');
    
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

export default function App(props) {

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  const { navigation } = props;
  
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }
      ]),
      onPanResponderRelease: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
      }
    })
  ).current;
   
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }}
        {...panResponder.panHandlers}
      >
        <View>
          <Image source={require('../assets/image2.png')}
          style={{height:190, width:190, marginLeft:'5%'}}></Image>
        </View>
        <View style={{flexDirection:'column'}}>
          
          <Text style={{fontSize:16, color:'blue'}}> We are fetching your location..</Text>
          <ActivityIndicator size="large" color="#0000ff" />  
        </View>
        
      </Animated.View>

      <View style={{flexDirection:'row'}}>
      <TouchableOpacity 
        style={{
            borderWidth: 2,
            marginTop: '5%',
            width: '30%',
            borderRadius: 4,
            height: 40,
            backgroundColor: 'cornflowerblue',
            marginLeft: '2%'
        }}
        onPress={()=>{deleteToken(), navigation.navigate('home')}}
      >
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
        }}>  Sign-Out</Text>
      </TouchableOpacity>
      
      </View>
    </View>
  );

  BackHandler.removeEventListener("hardwareBackPress");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
