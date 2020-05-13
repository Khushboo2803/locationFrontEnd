import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    Platform,
    BackHandler,
    AppState,
    PermissionsAndroid
} from "react-native";
import fun from '../functions/fun';
import React, { Component } from "react";
import db from '../functions/dbhandler.js';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';
import near from './ble.js';
const SCREEN_HEIGHT = Dimensions.get('window').height

class LoginScreen extends Component 
{

    static navigationOptions = {
        header: null
    }

    constructor()
    {
        super()
        this.state = {
            placeholderText: 'Enter your number....',
            appState: AppState.currentState,
            user:'',
            text:'',
            uri : require('../assets/color.jpg')
        }
    }

    UNSAFE_componentWillMount() 
    {
        this.loginHeight = new Animated.Value(150)
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
        this.keyboardHeight = new Animated.Value(0)
        this.forwardArrowOpacity = new Animated.Value(0)
        this.borderBottomWidth = new Animated.Value(0)
        AppState.addEventListener('change', this._handleAppStateChange);   
        near._connectPress;
        
        
    }

    UNSAFE_componentWillUnmount()
    {
        //console.log("exit");
    }

    _handleAppStateChange=(nextState)=>{
        this.setState({ appState: nextState })
        if (nextState === 'active') 
          		
        {
            console.log("App is in Active Foreground Mode.")
            this.showUser();
        }

        if (nextState === 'background') 
        {
            console.log("App is in Background Mode.")
            this.showUser();
        }
      }

    showUser=async()=>
    {
        var status=await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if(!status || status=="never_ask_again")
        {
          status=PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Location Permission',
              'message': 'Trails and Trial App needs access to your location ',
              'buttonNegative':'cancel',
              'buttonPositive':'grant'
            }
          )
        }
        console.log("status is ",status);

      	const bluetooth = BleManager.enableBluetooth()
  				.then((response) => {
            // Success code
            console.log('The bluetooth is already enabled or the user confirm');
            return response;
          })
          .catch((error) => {
            // Failure code
            console.log('The user refuse to enable bluetooth');
            return "error enabling bluetooth";
          });
          console.log('bluetooth is =>', bluetooth);
          
        let result =await AsyncStorage.getItem('user');
        console.log("user", result);
        if(result=='' || result==null)
        {
            this.render();
        }
        else
        {      
              this.props.navigation.navigate('loggedIn');
              await fun.startLoc(result);
        }
    }

    

    keyboardWillShow = (event) => {
        if (Platform.OS == 'android') {
            duration = 100
        }
        else {
            duration = event.duration
        }

        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: duration + 100,
                toValue: event.endCoordinates.height + 10,
                useNativeDriver: false
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: duration,
                toValue: 1,
                useNativeDriver: false
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: duration,
                toValue: 1,
                useNativeDriver: false
            })

        ]).start()
    }


    keyboardWillHide = (event) => {
        if (Platform.OS == 'android') {
            duration = 100
        }
        else {
            duration = event.duration
        }

        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: duration + 100,
                toValue: 0,
                useNativeDriver: false
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: duration,
                toValue: 0,
                useNativeDriver: false
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: event.duration,
                toValue: 0,
                useNativeDriver: false
            })
        ]).start()
    }

    startLocation=async(phone_number)=>
    {
        await fun.startLoc(phone_number);
    }
        

    checkPhone = async(phone_number) =>
    {
        if(fun.checkPhoneFormat(phone_number))
        {
            await this.checkDB(phone_number);
        }
        else
        {
            Alert.alert('Wrong format');
        }
    }

    saveUser = async(user)=>
    {
        await AsyncStorage.setItem('user', user);
    }

    setText(input)
    {
        this.setState({text:input});
        return input;
    }

    checkDB=async(phone_number)=>
    {
        const respone= await db.isExist(phone_number);
        if(respone)
        {
                
                Alert.alert(
                    "User Already exist", "Have you changed your device",
                    [{text: 'Yes', onPress: async() => {this.startLocation(phone_number), this.props.navigation.navigate('loggedIn')}},
                {text: 'No', onPress: ()=>{console.log("ok"), AsyncStorage.removeItem('user')}}]
                );
            
        }
        else{
                await db.addData(phone_number);
                this.startLocation(phone_number);
                this.props.navigation.navigate('loggedIn');
        }
    }

    increaseHeightOfLogin = () => {
        this.setState({uri: require('../assets/env.jpeg')})
        this.setState({ placeholderText: '92123456789' })
        Animated.timing(this.loginHeight, {
            toValue: SCREEN_HEIGHT,
            duration: 500,
            useNativeDriver: false
        }).start(() => {

            this.refs.textInputMobile.focus()
        })
    }

    decreaseHeightOfLogin = () => {
        this.setState({uri: require('../assets/color.jpg')})
        Keyboard.dismiss()
        Animated.timing(this.loginHeight, {
            toValue: 150,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    render() 
    {
        const headerTextOpacity = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [1, 0]
        })
        const marginTop = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [25, 100]
        })
        const headerBackArrowOpacity = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [0, 1]
        })
        const titleTextLeft = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [100, 25]
        })
        const titleTextBottom = this.loginHeight.interpolate({
            inputRange: [150, 400, SCREEN_HEIGHT],
            outputRange: [0, 0, 100]
        })
        const titleTextOpacity = this.loginHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [0, 1]
        })

        return (
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        height: 60, width: 60,
                        top: 60,
                        left: 25,
                        zIndex: 100,
                        opacity: headerBackArrowOpacity//animated
                    }}
                >
                  
                    <TouchableOpacity
                        onPress={() => 
                        { 
                        this.setState({placeholderText:'Enter your number..'}),
                        this.setState({text:''}),
                        this.decreaseHeightOfLogin()
                    }}
                    >
                        <Image 
                            source={require('../assets/back-arrow.png')}
                            style={{height:45, width:45}}
                        />
                    </TouchableOpacity>
                    
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        height: 60, width: 60,
                        right: 10,
                        bottom: this.keyboardHeight, // animated
                        opacity: this.forwardArrowOpacity,//animated
                        zIndex: 100,
                        backgroundColor: 'lightsteelblue',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 30
                    }}
                >   
                        <TouchableOpacity onPress={()=>{
                                        this.checkPhone(this.state.text);
                                        this.saveUser(this.state.text);
                                    }}>
                                        <Image
                                            source={require('../assets/right-arrow.png')}
                                            style={{
                                                height:55, width:55, marginLeft:3
                                            }}
                                        />
                        </TouchableOpacity>

                </Animated.View>

                <ImageBackground
                    source={require('../assets/bg.jpg')}
                    style={{ flex: 1 }}
                >
                    
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={()=>{fun.whatsApp()}}>
                        <Image source={require('../assets/whatsapp.png')}
                        style={{
                            marginLeft:'85%', height:40, width:40, marginBottom:'0%'
                        }}
                        />
                    </TouchableOpacity>
                         <Animatable.View
                            animation="zoomIn" iterationCount={1}
                            style={{ alignItems: 'center', justifyContent: 'center', marginTop:7}}>
                            <Text style={{ fontWeight: 'bold', fontSize: 12, fontFamily:'monospace', color:'navy' }}>Stay Home,</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 12, fontFamily:'monospace', color:'navy' }}>Stay Safe!</Text>
                        </Animatable.View> 
                        
                    </View>

                    {/** BOTTOM HALF **/}
                    <Animatable.View animation="slideInUp" iterationCount={1}>
                    
                        <Animated.View
                            style={{
                                height: this.loginHeight,//animated
                                backgroundColor: 'white',
                                
                            }}
                        >
                            <ImageBackground
                  source={this.state.uri}
                  style={{
                      width:'100%',
                      height:'100%'
                  }}
                  > 
                            <Animated.View
                                style={{
                                    opacity: headerTextOpacity,//animated
                                    alignItems: 'flex-start',
                                    paddingHorizontal: 25,
                                    marginTop: marginTop,//animated
                                }}
                            >
                                
                                <Text
                                    style={{ fontSize: 24 }}
                                >Get moving with Trails&Trial</Text>
                            </Animated.View>
                                            
                            <TouchableOpacity
                                onPress={() => this.increaseHeightOfLogin()}
                            >
                                <Animated.View
                                    style={{
                                        marginTop: marginTop,//animated
                                        paddingHorizontal: 25,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Animated.Text
                                        style={{
                                            fontSize: 26, color: 'gray',
                                            position: 'absolute',
                                            bottom: titleTextBottom,//animated
                                            left: titleTextLeft,//animated
                                            opacity: titleTextOpacity,
                                            fontFamily:'monospace',
                                            color:'navy',
                                            backgroundColor:'papayawhip',
                                            borderRadius:9,
                                            borderWidth:3
                                        }}
                                    >
                                        ..Enter your number..
                                </Animated.Text>


                                    <Image
                                        source={require('../assets/india.png')}
                                        style={{ height: 24, width: 24, resizeMode: 'contain', marginTop:10 }}
                                    />
                                    <Animated.View
                                        pointerEvents="none"
                                        style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                            borderBottomWidth: this.borderBottomWidth//animated
                                        }}
                                    >
                                        
                                        <Text style={{
                                            fontSize: 20,
                                            paddingHorizontal: 10,
                                            marginTop:10

                                        }}>+91</Text>

                                        <TextInput
                                            keyboardType="numeric"
                                            ref="textInputMobile"
                                            style={{ flex: 1, fontSize: 20, color:'navy' }}
                                            placeholder={this.state.placeholderText}
                                            underlineColorAndroid="transparent"
                                            onChangeText={text=>this.setText(text)}
                                            defaultValue={this.state.text}
                                            
                                        />
                                        
                                    </Animated.View>

                                    
                                </Animated.View>
                            </TouchableOpacity>
                            </ImageBackground>
                        </Animated.View>
                        
                        <View
                            style={{
                                height: 70,
                                backgroundColor: 'white',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                //borderTopColor: '#e8e8ec',
                                borderTopWidth: 0,
                                paddingHorizontal: 25,
                            }}
                        >
                            
                            <Text
                                style={{
                                    color: '#5a7fdf', fontWeight: 'bold', fontSize:20, fontFamily:'monospace'
                                }}
                                onPress={()=>{this.props.navigation.navigate('admin')}}
                            >
                                Proceed to check Trails..
                            </Text>      
                                        
                        </View>
                          
                    </Animatable.View>
                </ImageBackground>

            </View>
        );
    }
}

export default LoginScreen;
