import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function TimeComponent({ start, getTime, initialTime = 0 }) {
  // Estado local para contar os segundos de forma segura
  const [seconds, setSeconds] = useState(initialTime);

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  useEffect(() => {
    if (getTime) {
        getTime(seconds);
    }
  }, [seconds]);

  useEffect(() => {
    let interval = null;

    if (start) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [start]);

  // Formata o tempo para HH:MM:SS
  const formatTime = (totalSeconds) => {
    const getSeconds = `0${totalSeconds % 60}`.slice(-2);
    const minutes = Math.floor(totalSeconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text style={{ color: '#313131', flex: 1, letterSpacing: 1.5 }}>
        TEMPO
      </Text>
      <View style={{
                backgroundColor: 'transparent',
                flex: 3,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
          <Text style={{
            fontFamily: fontsLoaded ? 'BebasNeue' : null,
            fontSize: 50,
            color: '#313131',
            fontWeight: 'bold',
          }}>
            {formatTime(seconds)}
          </Text>
      </View>
    </View>
  );
}