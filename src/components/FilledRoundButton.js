import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { styles } from '../styles/styles';
import { colors } from '../styles/Colors';

export default function FilledRoundButton({
  text,
  onPress,
  textStyle,
  style,
  disabled = false,
  accessibilityLabel,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filledRoundButton,
        style,
        (pressed || disabled) && styles.roundButtonPressed,
        disabled && localStyles.disabled,
      ]}
    >
      <Text style={[localStyles.text, textStyle]}>{text}</Text>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  text: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  disabled: {
    opacity: 0.55,
  },
});
