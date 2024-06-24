import React from 'react';
import { Text, Pressable } from 'react-native';
import { Buttons } from '../styles';

export default function SmallGreyButton({ text, onPress}) {
    return (
      <Pressable
          style={Buttons.styles.smallGrey}
          onPress={onPress}
      >
          <Text>{text}</Text>
      </Pressable>
    )
}