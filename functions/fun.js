import React, {useState} from 'react';
import { Text, View, Alert, TouchableOpacity, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import db from './dbhandler.js';
import Constants from 'expo-constants';
('react-native link @react-native-community/geolocation');
import * as SecureStore from 'expo-secure-store';

var phone='';
var addressInt='';
var addressArray=[];
var k=0;
var AddressName=new Array();
class fun extends React.Component
{
    constructor(props) {
        super(props);
          this.state = {
          allowed: false,
          location: null,
          error: null,
          ar: '',
          lat: 0,
          lon: 0,
          address: '',
          interval: 0,
          addresName: [{name:'',timestamp:''}]
        };
      }
      state={}
      intervalId = 0;
      addressArray = [[], [], []];
      AddressName=[];
    
    checkPhoneFormat(phone_number)
    {
        if(phone_number>999999999 && phone_number<=9999999999)
        {
            phone=phone_number;
            return true;
        }
        else
        return false;
    }

    whatsApp()
    {
      const msg=" Hey !! Khushboo has created a cool App \'Trails$Trial\'\. This App will fetch your location and help us to keep you safe from Covid-19."+
      "Download the App from the link: https://drive.google.com/drive/folders/1AXppTsolIvNvMBXle-8y3x-XiILKAdjk"+'\n'+"Because we care. <3";
      let url='whatsapp://send?text='+msg;
      Linking.openURL(url).then((data)=>
      {
        console.log('WhatsApp Opened');
      }).catch(()=>{
        Alert.alert('Make sure Whatsapp is installed on your device');
      });
    }
  
    findCurrentLocationAsync = async (phone_number) => {
        let result = await SecureStore.getItemAsync('user');
        console.log(result);
        if(result==null || result=='')
        {
          console.log("still getting user", result);
          this.props.navigation.navigate('home');
          return clearTimeout(this.intervalId);
        }
        var status;
        if (this.state.allowed) status = 'granted';

        else {
          status = await Location.requestPermissionsAsync();
          status = status.status;
        }

        if (status !== 'granted') {
          this.setState({ allowed: false, error: 'Permission is not granted' });
          return;
        } 
        else {
          this.state.allowed=true;
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });
          if(Math.abs(this.state.lat-location.coords.latitude)>0.001|| Math.abs(this.state.lon-location.coords.longitude)>0.001)
          {
            addressInt={
              lat: location.coords.latitude,
              lon: location.coords.longitude,
              timestamp: new Date(location.timestamp).toLocaleString()
            }
            db.updateAddress(result, JSON.stringify(addressInt));
            this.state.interval=this.state.interval+1;
            this.setState({
              lat: location.coords.latitude,
              lon: location.coords.longitude,
            });
        }
        this.intervalId = setTimeout(()=>this.findCurrentLocationAsync(phone_number), 10 * 1000);
        }
      };
      
      startLoc =async(phone_number) => {
        this.intervalId = setTimeout(()=>this.findCurrentLocationAsync(phone_number), 10 * 1000);
      }
      getValue = async (lat, lon) => {
          const key='';
          var url='https://api.opencagedata.com/geocode/v1/json?q='+lat+ '+' +lon+'&key='+key;
          const res=await fetch(url,{
            method: 'GET'
          })
          .then(response=>response.json())
          .then(data=>{
            const response=JSON.stringify(data.results[0].components);
            return response;
          })
          .catch((error)=>{
            Alert.alert(error);
          });
       return res;
      };
}

const classObj=new fun();
export default classObj;
