import React, {useState} from 'react';
import { Text, View, Alert, TouchableOpacity, Linking, PermissionsAndroid, NativeModules, NativeEventEmitter } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import db from './dbhandler.js';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';

('react-native link @react-native-community/geolocation');

const BleManagerModule=NativeModules.BleManager;
const bleManagerEmitter= new NativeEventEmitter(BleManagerModule);

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
          latitude: null,
          longitude: null,
          address: '',
          interval: 0,
          timestamp:0,
          addresName: [{name:'',timestamp:''}]
        };
      }
      
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
      let result = await AsyncStorage.getItem('user');
      console.log(new Date().getSeconds());
      if (result == null || result == '') {
        console.log("still getting user", result);
        this.props.navigation.navigate('home');
        return clearTimeout(this.intervalId);
      }
      var status;
      if (this.state.allowed) status = 'granted';
  
      else {
        status=await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
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
      }
  
      if (!status) {
        this.setState({ allowed: false, error: 'Permission is not granted' });
        return;
      }
      else {
        this.state.allowed = true;
        //define location variable here
       
      Geolocation.getCurrentPosition(data=>{
         this.state.latitude=data.coords.latitude;
         this.state.longitude=data.coords.longitude;
         this.state.timestamp=data.timestamp;
       })
       var latitude=this.state.latitude;
       var longitude=this.state.longitude;
       console.log("location ",latitude);
        
        
         if (Math.abs(this.state.lat - latitude) > 0.001 ||
           Math.abs(this.state.lon - longitude) > 0.001) {
           addressInt = {
             lat: latitude,
             lon: longitude,
             timestamp: new Date(this.state.timestamp).toLocaleString()
           }
           await db.updateAddress(result, JSON.stringify(addressInt));
           this.state.interval = this.state.interval + 1;
           this.setState({
             lat: latitude,
             lon: longitude,
           });
         }
        this.intervalId = setTimeout(() => this.findCurrentLocationAsync(phone_number), 10 * 1000);
      }
    };  
      
      startLoc =async(phone_number) => {
        this.findCurrentLocationAsync(phone_number);
      }
      
      getValue = async (lat, lon) => {
          const key='b654b06987184cd59b409d4fc87a9318';
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