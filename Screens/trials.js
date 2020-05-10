import React,{useState, useRef, useEffect} from 'react';
import { Animated, View, StyleSheet, Alert, PanResponder, Text, Image, TouchableOpacity, ActivityIndicator, BackHandler, ImageBackground, Dimensions } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import fun from '../functions/fun.js';
import db from '../functions/dbhandler.js';
import styles from './style.js';
var address=[];
var blank=[];

async function checkifExist(text, props)
 {
     if(text<999999999 || text>9999999999)
     {
         Alert.alert('Invalid Number');
         return;
     }
     const response = await db.isExist(text);
     if(response)
     {    
         const { navigation } = props;
         address=await db.getAddress(text)
         const cord = [];
         address.forEach(async (data) => {
             data = JSON.parse(data);
             cord.push({ latitude: data.lat, longitude: data.lon }); 
         });
         BackHandler.removeEventListener("hardwareBackPress", backAction);
         navigation.navigate('location', { address, cord });
     }
     else{
         const { navigation } = props;
             Alert.alert("no such user", "This number hasn't registered yet",
             [{text:'ok'}]);
             return ;
         }
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

export default function main(props)
{
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, []);

    const [text, setText] = useState('');
    return(
        <ImageBackground
            source={require('../assets/search.jpg')}
            style={{
                height:Dimensions.get('window').height,
                width:Dimensions.get('window').width,
            }}
        >
            <View style={{
                
                flexDirection:'row',
                borderWidth:3,
                height:60,
                marginLeft:'5%',
                marginRight:'2%',
                marginTop:(Dimensions.get('window').height)*0.50,
                borderRadius:15,
                backgroundColor:'white'
            }}>
                <Image
                    source={require('../assets/search-icon.png')}
                    style={{
                        height:48,
                        width:48,
                        marginLeft:'2%'
                    }}
                />
            <TextInput
                      style={{
                         fontSize:18,
                         backgroundColor:'white',
                         fontFamily:'monospace',
                         width:'80%'
                      }}
                      placeholder="Type phone number here!"
                      onChangeText={text => setText(text)}
                      defaultValue={text}
                      placeholderTextColor="black"
                      keyboardType="numeric"
                   />
            </View>
            <TouchableOpacity onPress={
                          ()=>{
                              checkifExist(text, props)}  
                          }>
                <Image source={require('../assets/search-button.jpg')}
                style={{
                    height:'29%', width: '52%',
                    borderRadius:120,
                    backgroundColor:'transparent',
                    marginLeft:(Dimensions.get('window').width)*0.25,
                    marginTop:'6%',
                    borderColor:'olivedrab',
                    borderWidth:5
                }} />
            </TouchableOpacity>
        </ImageBackground>
    );
}