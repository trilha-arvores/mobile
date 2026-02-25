import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { styles } from '../styles/styles';
import { colors } from '../styles/Colors';

export default function ChangeColorButton({ text, color }) {
  const textColor = color === colors.yellow ? colors.black : colors.white;

  return (
    <View style={[styles.button, localStyles.banner, { backgroundColor: color }]}>
      <Text style={[styles.text, localStyles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  banner: {
    minWidth: 280,
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 14,
  },
});
