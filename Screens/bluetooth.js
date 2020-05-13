import React , {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerItemList, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Animate from './Animate.js';
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity, ScrollView, State } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feed from './ble.js';

const Width=Dimensions.get('window').width;
const Height=Dimensions.get('window').height;
const CustomDrawerView = (props) =>{
  const [user, setUser] = useState('0');
  
  React.useEffect(()=>{
  AsyncStorage.getItem('user').then(
      (result)=>{
        setUser(result);
        }
    )
  })
 
  return(  
    
    <SafeAreaView>
    <ScrollView>
      <View style={{height:150}}>
        <Image 
          source={require('../assets/mask.jpg')}
          style={{height:130, width:130, alignItems:'center', marginLeft:'20%', marginTop:'5%',
          borderBottomLeftRadius:30,
          borderTopRightRadius:29  
      }}
        />
        
      </View>
      <View>
      <Text style={{
        fontSize: 20,
        marginLeft:'22%',
        fontFamily:'monospace',
        fontWeight:'bold',
        color: 'teal'
      }}>
        {user}
      </Text>
      </View>
      <DrawerItemList {...props} />
    </ScrollView>
  </SafeAreaView>
  );
}

 function Article() {
   return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text>socio graph Screen</Text>
     </View>
   );
 }


const Drawer = createDrawerNavigator();

export default function App(props) {
    const { navigation } = props;
  return (
      
    <Drawer.Navigator
     drawerStyle={{
       backgroundColor:'beige',
       width: 240
     }}
     drawerContent={props=> <CustomDrawerView {...props} />}
    >
    <Drawer.Screen name="Home screen" component={Animate} />
    <Drawer.Screen name="NearBy Bluetooth" component={Feed} />
    <Drawer.Screen name="Social graph" component={Article} />
    
  </Drawer.Navigator>

  );
}
