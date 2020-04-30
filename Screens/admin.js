import React from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert , BackHandler} from 'react-native';
import * as SecureStore from 'expo-secure-store';

function checkCredentials(user, password)
{
  if(user=='' && password=='')
  {
    return true;
  }
  else{
    return false;
  }
}


export default function Admin(props){
  const [value, onChangeText] = React.useState('');
  const [pass, onChangePass] = React.useState('');
  const {navigation}=props;

 
    return (
      <View style={{backgroundColor:'cornflowerblue'}}>
        <View
          style={{
            marginTop: '15%',
            marginBottom: '40%',
            marginLeft: '5%',
            borderRadius: 50,
            borderWidth: 2,
            backgroundColor: 'white',
            width: '90%',
            height: '81%',
            marginRight: '20%',
          }}
        >
          <View style={{flexDirection:'row'}}>
            <Text
            style={
              {
                marginTop: '40%',
                marginLeft: '15%',
                fontSize:20,
                fontWeight:'bold', 
              }}>
                Name :
            </Text>
            <TextInput
              style={{
                marginTop: '40%',
                marginLeft: '5%',
                borderRadius: 5,
                borderWidth: 1,
                borderBottomColor: 'black',
                width: '50%'
              }}
              onChangeText={text=>{onChangeText(text)}}
              placeholder="Admin name here.."
              value={value}
            />
          </View>

          <View style={{flexDirection:'row'}}>
            <Text
            style={
              {
                marginTop: '10%',
                marginLeft: '4%',
                fontSize:20,
                fontWeight:'bold', 
              }}>
                Password :
            </Text>
            <TextInput
              style={{
                marginTop: '10%',
                marginLeft: '5%',
                borderRadius: 5,
                borderWidth: 1,
                borderBottomColor: 'black',
                width: '50%'
              }}
              onChangeText={text=>{onChangePass(text)}}
              placeholder="password name here.."
              secureTextEntry={true}
              value={pass}
            />
          </View>

          <View>
            <TouchableOpacity style={
              {
                borderWidth:2,
                borderRadius:5,
                marginLeft:'30%',
                marginRight: '30%',
                marginTop: '20%',
                backgroundColor:'dodgerblue'
              }
            }
            onPress={()=>{
              if(checkCredentials(value, pass))
              {
                navigation.navigate('list');
              }
              else{
                Alert.alert("Wrong Credentials");
              }
            }}>
                <Text style={{fontWeight:'bold', fontSize: 30}}>  Submit</Text>
            </TouchableOpacity>
          </View>

          <View 
          style={{marginTop: '71%'}}>
            <Text style={{color:'red'}}> Disclaimer * This functionality is only for admins. Do not try to violate the privacy.</Text>
          </View>

        </View>
      </View>
    );
}
