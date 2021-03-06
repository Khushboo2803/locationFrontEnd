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
    AppState
} from "react-native";
import fun from '../functions/fun';
import React, { Component } from "react";
import db from '../functions/dbhandler.js';
import * as SecureStore from 'expo-secure-store';
import * as Animatable from 'react-native-animatable';

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
            text:''
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
        let result = await SecureStore.getItemAsync('user');
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
                toValue: event.endCoordinates.height + 10
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: duration,
                toValue: 1
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: duration,
                toValue: 1
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
                toValue: 0
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: duration,
                toValue: 0
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: event.duration,
                toValue: 0
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
        await SecureStore.setItemAsync('user', user);
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
                    [{text: 'Yes', onPress: () => {this.startLocation(phone_number), this.props.navigation.navigate('loggedIn')}},
                {text: 'No', onPress: ()=>{console.log("ok"), SecureStore.deleteItemAsync('user')}}]
                );
            
        }
        else{
                await db.addData(phone_number);
                this.startLocation(phone_number);
                this.props.navigation.navigate('loggedIn');
        }
    }

    increaseHeightOfLogin = () => {

        this.setState({ placeholderText: '92123456789' })
        Animated.timing(this.loginHeight, {
            toValue: SCREEN_HEIGHT,
            duration: 500
        }).start(() => {

            this.refs.textInputMobile.focus()
        })
    }

    decreaseHeightOfLogin = () => {
        Keyboard.dismiss()
        Animated.timing(this.loginHeight, {
            toValue: 150,
            duration: 500
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
                            style={{height:25, width:25}}
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
                                                height:35, width:35, marginLeft:3
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
                            marginLeft:'85%', height:40, width:40, marginBottom:'20%'
                        }}
                        />
                    </TouchableOpacity>
                        <Animatable.View
                            animation="zoomIn" iterationCount={1}
                            style={{ backgroundColor: 'white', height: 100, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius:8}}>
                            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Trails</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 19 }}> &</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Trial</Text>
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
                                            fontSize: 24, color: 'gray',
                                            position: 'absolute',
                                            bottom: titleTextBottom,//animated
                                            left: titleTextLeft,//animated
                                            opacity: titleTextOpacity//animated
                                        }}
                                    >
                                        Enter your number..
                                </Animated.Text>


                                    <Image
                                        source={require('../assets/india.png')}
                                        style={{ height: 24, width: 24, resizeMode: 'contain' }}
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
                                            paddingHorizontal: 10

                                        }}>+91</Text>

                                        <TextInput
                                            keyboardType="numeric"
                                            ref="textInputMobile"
                                            style={{ flex: 1, fontSize: 20 }}
                                            placeholder={this.state.placeholderText}
                                            underlineColorAndroid="transparent"
                                            onChangeText={text=>this.setText(text)}
                                            defaultValue={this.state.text}
                                        />
                                    </Animated.View>

                                    
                                </Animated.View>
                            </TouchableOpacity>
                            
                        </Animated.View>
                        <View
                            style={{
                                height: 70,
                                backgroundColor: 'white',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                borderTopColor: '#e8e8ec',
                                borderTopWidth: 1,
                                paddingHorizontal: 25,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#5a7fdf', fontWeight: 'bold', fontSize:20
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
