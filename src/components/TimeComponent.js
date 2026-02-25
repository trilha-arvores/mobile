import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { colors } from '../styles/Colors';

export default function TimeComponent({ start, getTime, initialTime = 0 }) {
  const [seconds, setSeconds] = useState(initialTime);
  const [fontsLoaded] = useFonts({
    BebasNeue: require('../assets/fonts/BebasNeue.ttf'),
  });

  useEffect(() => {
    if (getTime) {
      getTime(seconds);
    }
  }, [seconds, getTime]);

  useEffect(() => {
    let interval = null;

    if (start) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [start]);

  const formatTime = (totalSeconds) => {
    const getSeconds = `0${totalSeconds % 60}`.slice(-2);
    const minutes = Math.floor(totalSeconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.label}>TEMPO</Text>
      <Text style={[localStyles.value, fontsLoaded && localStyles.valueBebas]}>{formatTime(seconds)}</Text>
      <Text style={localStyles.hint}>{start ? 'Em andamento' : 'Pausado'}</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: colors.black,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '700',
  },
  value: {
    fontSize: 34,
    color: colors.black,
    fontWeight: '700',
    marginTop: 4,
  },
  valueBebas: {
    fontFamily: 'BebasNeue',
    fontSize: 48,
    fontWeight: '400',
    lineHeight: 52,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -2,
  },
});
