import React,{useState, useRef} from 'react';
import { Animated, View, StyleSheet, Alert, PanResponder, Text, Image, TouchableOpacity, ActivityIndicator, BackHandler } from "react-native";
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
        navigation.navigate('location', { address, cord });
    }
    else{
        const { navigation } = props;
            Alert.alert("no such user", "This number hasn't registered yet",
            [{text:'ok'}]);
            navigation.navigate('home');
            
        }
}

export default function showTrials(props)
{
    const {navigation}=props;
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
    const [text, setText] = useState('');
    return(
        <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }}
        {...panResponder.panHandlers}
      >
        <View>
          <Image source={require('../assets/image2.png')}
          style={{height:190, width:190, marginLeft:'25%', marginTop:'40%'}}></Image>
        </View>
        
        </Animated.View>  
        <TextInput
                     style={{
                        height: 22,
                        borderBottomWidth:3, 
                        width:'80%', 
                        borderBottomColor:'blue',
                        alignContent:'center',
                        alignItems: 'center',
                        marginTop:'10%',
                        marginLeft:'10%',
                        marginRight:'10%'
                     }}
                     placeholder="             Type your phone number here!"
                     onChangeText={text => setText(text)}
                     defaultValue={text}
                     placeholderTextColor="black"
                     keyboardType="numeric"
                  />

          <ActivityIndicator size="large" color="#0000ff" />  
        
        <View>
            <TouchableOpacity 
                style={{marginTop:'7%', 
                        marginLeft:'40%',
                        borderWidth:2,
                        width:'25%',
                        height:30,
                        borderRadius:4,
                        backgroundColor:'cornflowerblue'

                    }}
                onPress={
                         ()=>{
                             checkifExist(text, props)}  
                         }>
                             <Text style={{
                                 fontSize:18
                             }}>  Proceed</Text>
                         </TouchableOpacity>
        </View>
        
     

      
    </View>
    
    );
}