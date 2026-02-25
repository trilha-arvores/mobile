import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { styles } from '../styles/styles';

export default function DefaultButton({
  text,
  onPress,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        (pressed || disabled) && styles.buttonPressed,
        disabled && localStyles.disabled,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  disabled: {
    opacity: 0.55,
  },
});
