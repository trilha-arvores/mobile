import React from 'react';
import { Text, View } from 'react-native';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';
import { useFonts } from 'expo-font';


const options = {
  container: {
    backgroundColor: 'transparent',
    fontSize: 40,
    flex: 3,
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: 'BebasNeue',
    fontSize: 50,
    color: '#313131',
    fontStyle: 'bold',
  }
};

export default function TimeComponent({ start, getTime }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text style={{ color: '#313131', flex: 1, letterSpacing: 1.5 }}>
        TEMPO
      </Text>
      <StopWatch options={options} start={start} getTime={getTime}/>
    </View>
  )
}