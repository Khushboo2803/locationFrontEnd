

import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { NearbyAPI } from '@adrianso/react-native-nearby-api';
import AsyncStorage from '@react-native-community/async-storage';
const nearbyAPI = new NearbyAPI(true);
const API_KEY = 'AIzaSyC_Yd6l3azEiYZY7amYGcJfJAb_vRNJAeg';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isConnected: false,
      nearbyMessage: null,
      connectText: "CONNECT",
      isPublishing: false,
      isSubscribing: false,
      user: ''
    };
  }

  componentDidMount() {

    AsyncStorage.getItem('user').then((result)=>{
        this.setState({user: result})
    });
    console.log("Mounting ", NearbyAPI);
    nearbyAPI.onConnected(message => {
      console.log(message);
      console.log("connected");
      nearbyAPI.isConnected((connected, error) => {
        this.setState({
          nearbyMessage: `Connected - ${message}`,
          isConnected: connected
        });
      });
    });
    nearbyAPI.onDisconnected(message => {
      console.log(message);
      this.setState({
        isConnected: false,
        nearbyMessage: `Disconnected - ${message}`
      });
    });
    nearbyAPI.onFound(message => {
      console.log("Message Found!");
      console.log(message);
      this.setState({ nearbyMessage: `Message Found - ${message}` });
    });
    nearbyAPI.onLost(message => {
      console.log("Message Lost!");
      console.log(message);
      this.setState({ nearbyMessage: `Message Lost - ${message}` });
    });
    nearbyAPI.onDistanceChanged((message, value) => {
      console.log("Distance Changed!");
      console.log(message, value);
      this.setState({
        nearbyMessage: `Distance Changed - ${message} - ${value}`
      });
    });
    nearbyAPI.onPublishSuccess(message => {
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `Publish Success - ${message}`,
          isPublishing: status
        });
      });
    });
    nearbyAPI.onPublishFailed(message => {
      console.log(message);
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `Publish Failed - ${message}`,
          isPublishing: status
        });
      });
    });
    nearbyAPI.onSubscribeSuccess(() => {
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `Subscribe Success`,
          isSubscribing: status
        });
      });
    });
    nearbyAPI.onSubscribeFailed(() => {
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `Subscribe Failed`,
          isSubscribing: status
        });
      });
    });

    this._connectPress();
    Alert.alert("publish", "start publishing to send message to nearby devices",[
        {
            text: "ok",
            onPress: ()=>{this._publishPress();}
        }
    ])
    
  }

  _connectPress = () => {
      nearbyAPI.connect(API_KEY);
  };

  _publishPress = () => {
      nearbyAPI.publish(`Hello from - ${this.state.user}`);
  };

  _subscribePress = () => {
    if (!this.state.isSubscribing) {
      nearbyAPI.subscribe();
    } else {
      nearbyAPI.unsubscribe();
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `unsubscribed`,
          isSubscribing: status
        });
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          React-native-nearby-api test!
        </Text>
        <Text style={styles.instructions}>
          Is Connected: {`${this.state.isConnected}`}
        </Text>
        <Text style={styles.instructions}>
          Is Publishing: {`${this.state.isPublishing}`}
        </Text>
        <Text style={styles.instructions}>
          Is Subscribing: {`${this.state.isSubscribing}`}
        </Text>
        <Text style={styles.instructions}>{this.state.nearbyMessage}</Text>
        <View style={{ height: 32 }} />
        <TouchableOpacity onPress={this._subscribePress}>
          <Text style={styles.connectButton}>
            {this.state.isSubscribing ? "UNSUBSCRIBE" : "SUBSCRIBE"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  connectButton: {
    fontSize: 30,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});