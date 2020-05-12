


//   =======  npm i @adrianso/react-native-nearby-api 

// mannual imlement krna ho to yha se dekh lena 

//v=>     https://www.npmjs.com/package/@adrianso/react-native-nearby-api 

import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { NearbyAPI } from '@adrianso/react-native-nearby-api';
import AsyncStorage from '@react-native-community/async-storage';

const nearbyAPI = new NearbyAPI(true);
const API_KEY = 'AIzaSyC_Yd6l3azEiYZY7amYGcJfJAb_vRNJAeg';
const user=AsyncStorage.getItem('user');
const App = () => {
    const [isConnected, setConnected] = useState(false);
    const [nearbyMessage, setNearbyMessage] = useState('Ready');
    const [isPublishing, setPublishing] = useState(false);
    const [isSubscribing, setSubscribing] = useState(false);

    useEffect(() => {
        nearbyAPI.onConnected((message) => {
            console.log(message);
            nearbyAPI.isConnected((connected) => {
                setNearbyMessage(`Connected - ${message}`);
                setConnected(connected);
            });
        });

        nearbyAPI.onDisconnected((message) => {
            console.log(message);
            setConnected(false);
            setNearbyMessage(`Disconnected - ${message}`);
        });

        nearbyAPI.onFound((message) => {
            console.log('Message Found!');
            console.log(message);
            setNearbyMessage(`Message - ${message}`);
        });

        nearbyAPI.onLost((message) => {
            console.log('Message Lost!');
            console.log(message);
            setNearbyMessage(`Message Lost - ${message}`);
        });

        nearbyAPI.onDistanceChanged((message, value) => {
            console.log('Distance Changed!');
            console.log(message, value);
            setNearbyMessage(`Distance Changed - ${message} - ${value}`);
        });

        nearbyAPI.onPublishSuccess((message) => {
            console.log('Message sucessfully published.');
            nearbyAPI.isPublishing((status) => {
                setNearbyMessage(`Publish Success - ${message}`);
                setPublishing(status);
            });
        });

        nearbyAPI.onPublishFailed((message) => {
            console.log(message);
            nearbyAPI.isPublishing((status) => {
                setNearbyMessage(`Publish Failed - ${message}`);
                setPublishing(status);
            });
        });

        nearbyAPI.onSubscribeSuccess(() => {
            nearbyAPI.isSubscribing((status) => {
                setNearbyMessage('Subscribe Success');
                setSubscribing(status);
            });
        });

        nearbyAPI.onSubscribeFailed(() => {
            nearbyAPI.isSubscribing((status) => {
                setNearbyMessage('Subscribe Failed');
                setSubscribing(status);
            });
        });
    }, []);

    const handleConnectPress = () => {
        if (isConnected) {
            nearbyAPI.disconnect();
            nearbyAPI.isConnected((connected) => {
                setNearbyMessage('Disconnected');
                setConnected(connected);
            });
        } else {
            nearbyAPI.connect(API_KEY);
        }
    };

    const handlePublishPress = () => {
        if (!isPublishing) {
            console.log('Publishing...');
            nearbyAPI.publish(`Hello World! - ${user}`);
        } else {
            console.log('Unpublishing...');
            nearbyAPI.unpublish();
            nearbyAPI.isPublishing((status) => {
                setNearbyMessage('unpublished');
                setPublishing(status);
            });
        }
    };

    const handleSubscribePress = () => {
        if (!isSubscribing) {
            console.log('Subscribing...');
            nearbyAPI.subscribe();
            nearbyAPI.isSubscribing((status) => {
                setNearbyMessage('Subscribed');
                setSubscribing(status);
            });
        } else {
            nearbyAPI.unsubscribe();
            nearbyAPI.isSubscribing((status) => {
                setNearbyMessage('unsubscribed');
                setSubscribing(status);
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                Welcome to react-native-nearby-api test app!
      </Text>
            <Text style={styles.instructions}>
                Is Connected: {isConnected.toString()}
            </Text>
            <Text style={styles.instructions}>
                Is Publishing: {isPublishing.toString()}
            </Text>
            <Text style={styles.instructions}>
                Is Subscribing: {isSubscribing.toString()}
            </Text>
            <Text style={styles.instructions}>Message: {nearbyMessage}</Text>
            <TouchableOpacity onPress={handleConnectPress}>
                <Text style={styles.connectButton}>
                    {isConnected ? 'DISCONNECT' : 'CONNECT'}
                </Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity onPress={handlePublishPress}>
                <Text style={styles.connectButton}>
                    {isPublishing ? 'UNPUBLISH' : 'PUBLISH'}
                </Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity onPress={handleSubscribePress}>
                <Text style={styles.connectButton}>
                    {isSubscribing ? 'UNSUBSCRIBE' : 'SUBSCRIBE'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    connectButton: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    seperator: {
        height: 32,
    },
});
