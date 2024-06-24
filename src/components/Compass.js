import React, { useState, useEffect } from 'react';
import { Text, Pressable, View, StyleSheet, TouchableOpacity, Image, PermissionsAndroid } from 'react-native';
// import { styles } from '../styles/styles';
import { Magnetometer } from 'expo-sensors';
import FilledRoundButton from '../components/FilledRoundButton';
import { styles } from '../styles/styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';



export default function Compass({ text }) {

    const [subscription, setSubscription] = useState(null);
    const [magnetometer, setMagnetometer] = useState(0);

    Magnetometer.setUpdateInterval(100);

    const _angle = (magnetometer) => {
        let angle = 0;
        if (magnetometer) {
            let { x, y, z } = magnetometer;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }
        return Math.round(angle);
    };

    const _degree = (magnetometer) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    const _subscribe = () => {
        setSubscription(
            Magnetometer.addListener(result => {
                setMagnetometer(_angle(result));
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    return (
        <View
            style={[styles.filledRoundButton, { backgroundColor: 'white', elevation: 0, transform: [{ rotate: 360 - magnetometer + 'deg' }] }]}
        >
            {/* <Text style={{
                color: '#517300',
                fontWeight: 'bold',
            }}><FontAwesome5 name="arrow-up" /></Text> */}
            <Image
                style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 1,

                }}
                source={require('../assets/icompass.png')}
            />
        </View>
    );
}