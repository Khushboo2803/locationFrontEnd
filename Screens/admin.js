import React from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert , BackHandler, Image, Dimensions, KeyboardAvoidingView, ImageBackground} from 'react-native';
import * as SecureStore from 'expo-secure-store';



const device_width= Dimensions.get('window').width;
const device_height=Dimensions.get('window').height;
export default class admin extends React.Component
{
  constructor(props){
    super(props);
    this.state={
      showPass:true,
      press:false,
      user:'',
      pass:'',
      text:''
    };
    this.showPass=this.showPass.bind(this);
  }

  checkCredentials(user, password)
{
  if(user=='Khushboo' && password=='280397')
  {
    return true;
  }
  else{
    return false;
  }
}
  changeUser(name)
  {
    this.state.text=name;
  }
  changePass(pass)
  {
    this.state.pass=pass;
  }

  showPass(){
    this.state.press===false ? this.setState({showPass: false, press: true}): this.setState({showPass: true, press: false});
  }
  render(){
    return(
      <ImageBackground source={require('../assets/admin.jpg')}
      style={{
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
      }}>
  
        <KeyboardAvoidingView behavior="padding"
        style={{
          flex: 1,
          alignItems:'center'
        }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mintcream',
              borderWidth: .5,
              borderColor: '#000',
              height: 40,
              borderRadius: 5 ,
              margin: 10,
              marginTop: '60%',
              width: '90%'
            }}
          >
          <Image source={require('../assets/user.png')} 
          style={{
            height:30,
            width:30
          }}/>
            <TextInput
            style={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              flex:1,
              color: 'black',
              fontFamily: 'monospace'
            }}
            placeholder="Enter your name here.. "
            placeholderTextColor="darkgray"
            underlineColorAndroid="transparent"
            onChangeText={text=>{this.changeUser(text)}}
            defaultValue={this.state.text}
          />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mintcream',
              borderWidth: .5,
              borderColor: '#000',
              height: 40,
              borderRadius: 5 ,
              margin: 10,
              marginTop: '9%',
              width: '90%'
            }}
          >
          <Image source={require('../assets/pass.png')} 
          style={{
            height:30,
            width:30
          }}/>
            <TextInput
            style={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              flex:1,
              color: 'black',
              fontFamily: 'monospace'
            }}
            placeholder="Enter password here.. "
            placeholderTextColor="darkgray"
            underlineColorAndroid="transparent"
            onChangeText={text=>{this.changePass(text)}}
            defaultValue={this.state.pass}
            secureTextEntry={true}
          />
          </View>

          <View>
            <TouchableOpacity onPress={()=>{
              if(this.checkCredentials(this.state.text, this.state.pass))
                             {
                               this.props.navigation.navigate('list');
                             }
                             else{
                               Alert.alert("Wrong Credentials");
                             }
                           }
            }>
              <Image
                source={require('../assets/submit.jpg')}
                style={{
                  height:110, 
                  width:110,
                  borderRadius:65,
                  marginTop:'30%',
                  borderWidth:5,
                  borderColor:'olivedrab'
                }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
  
      </ImageBackground>
    );
  }
  
}