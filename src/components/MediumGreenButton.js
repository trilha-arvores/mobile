import React from 'react';
import { Text, Pressable } from 'react-native';
import { Buttons } from '../styles';

export default function MediumGreenButton({ text, onPress}) {
    return (
      <Pressable
          style={Buttons.styles.mediumGreen}
          onPress={onPress}
      >
          <Text>{text}</Text>
      </Pressable>
    )
}