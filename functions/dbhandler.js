import React from 'react';
import {Alert} from 'react-native';
import axios from 'axios';
var api=axios.create({baseURL: 'https://protected-tor-40257.herokuapp.com'});
var address = new Array();
var k=0;
class dbFun extends React.Component
{
    

    isExist = async(phone_number) =>{

        try{
            const response = await api.get('/Check' , 
            {
                params: {'phone_number': phone_number}
            });
            
            if(response.data=="exist")
            {
                console.log("returning true data");
                return true;
            }
            else{
                console.log("returning false");
                return false;
            }
           
        }
        catch(err)
        {
            Alert.alert("err.message");
        }
    }


    addData= async(phone_number)=>
    {
        try{
                const response = await api.get('/Register' , 
                {
                    params: {'phone_number':phone_number}
                });
                console.log(response.data, k);
                k=k+1;
                if(response.data=="success")
                {
                Alert.alert("Successfully registered");}
            }
            catch(err)
            {
                Alert.alert(err.message);
            }
    }

    updateAddress = async(phone_number, address) =>{
        try{
            const response=await api.get('/Update',{
                params: {'phone_number' : phone_number , 'address': address}
            });
            console.log(response.data);
        }
        catch(err)
        {
            Alert.alert(err.message);
        }
        
    }

    getAddress = async(phone_number) =>{
        try{
            
            const response=await api.get('/Signin',{
                params: {'phone_number' : phone_number}

            });
            const address1 = response.data.address;
            return address1;
        }
        catch(err)
        {
            
            console.log(err.message);
        }
        
    }


}
const classObj = new dbFun();
export default classObj;