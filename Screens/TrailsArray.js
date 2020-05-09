import React, {useState} from 'react';
import {Text, ScrollView, TouchableOpacity, View, Alert, Button, StyleSheet} from 'react-native';
import styles from './style.js';
import fun from '../functions/fun.js';
var arr=[];
var addressName=[];

async function showDetails(location) {  
  location = JSON.parse(location);
  const response = await fun.getValue(location.lat, location.lon); 
  Alert.alert("Address", response);
}
export default function Array({ route, navigation })
{
    var [cord] = useState('');
    const [text, setText] = useState('');

    
    arr = route.params.address; 
    cord = route.params.cord; 
 
        if(arr.length==0)
        {
            return(
                <Text style={
                    {
                        color:'red', 
                        fontSize:30, 
                        marginTop: 30
                    }
                }>
                This user has not allowed to access location yet. 
                Go back and check new number
                </Text>
                );  
        }
        else{
            return(
          <ScrollView style={{marginTop:35}}>
            <TouchableOpacity style={styles.butText} onPress={()=>{navigation.navigate('map', { arr, cord })}}>
              <Text style={{fontSize:20, color:'white'}}>  Click to view on Map!</Text>
            </TouchableOpacity>
            <Text style={{marginTop:10}}>-----------------------------------------------------------------------------------------</Text>
              {
               
            arr.map((item, key) => (
 
              <TouchableOpacity
                            key={key}
                            onPress={() => showDetails(item)} 
                        >
                <Text style={styles.TextStyle} > lat = {JSON.parse(item).lat} </Text>
                <Text style={styles.TextStyle} > lon = {JSON.parse(item).lon} </Text>
                <Text style={styles.TextStyle} > Time = {JSON.parse(item).timestamp} </Text>
                <View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />
              </TouchableOpacity>
 
            ))
          }
          </ScrollView>
                );  
        }
    
     
}