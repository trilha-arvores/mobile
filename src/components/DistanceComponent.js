import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { colors } from '../styles/Colors';

export default function DistanceComponent({ distance }) {
  const [fontsLoaded] = useFonts({
    BebasNeue: require('../assets/fonts/BebasNeue.ttf'),
  });

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.label}>DISTANCIA</Text>
      <View style={localStyles.valueWrap}>
        <Text style={[localStyles.value, fontsLoaded && localStyles.valueBebas]}>{distance}</Text>
        <Text style={localStyles.unit}>KM</Text>
      </View>
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
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  value: {
    fontSize: 34,
    color: colors.black,
    fontWeight: '700',
  },
  valueBebas: {
    fontFamily: 'BebasNeue',
    fontSize: 48,
    fontWeight: '400',
    lineHeight: 52,
  },
  unit: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
});
