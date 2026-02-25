import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { styles } from '../styles/styles';
import { colors } from '../styles/Colors';

export default function Compass() {
  const [magnetometer, setMagnetometer] = useState(0);

  const getAngle = (reading) => {
    if (!reading) return 0;

    const { x, y } = reading;
    const angle = Math.atan2(y, x);
    const angleInDeg = angle >= 0 ? angle * (180 / Math.PI) : (angle + 2 * Math.PI) * (180 / Math.PI);

    return Math.round(angleInDeg);
  };

  useEffect(() => {
    Magnetometer.setUpdateInterval(120);

    const subscription = Magnetometer.addListener((result) => {
      setMagnetometer(getAngle(result));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={localStyles.wrapper}>
      <View
        style={[
          styles.filledRoundButton,
          localStyles.compassCircle,
          { transform: [{ rotate: `${360 - magnetometer}deg` }] },
        ]}
      >
        <Image style={localStyles.image} source={require('../assets/icompass.png')} />
      </View>
      <Text style={localStyles.label}>BUSSOLA</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassCircle: {
    elevation: 0,
    shadowOpacity: 0,
  },
  image: {
    width: '92%',
    height: undefined,
    aspectRatio: 1,
  },
  label: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
