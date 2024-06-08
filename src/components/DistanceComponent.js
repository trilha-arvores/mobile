import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles/styles';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';



export default function DistanceComponent({ distance }) {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ color: '#313131', flex: 1, letterSpacing: 1.5 }}>
                DISTÂNCIA
            </Text>
            <View style={{
                backgroundColor: 'transparent',
                fontSize: 40,
                flex: 3,
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={
                    {
                        fontFamily: 'BebasNeue',
                        fontSize: 50,
                    }}>{distance}</Text>
            </View>
        </View>
    )
}