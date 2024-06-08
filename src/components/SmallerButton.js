import React from 'react';
import { Text, Pressable } from 'react-native';
import { styles } from '../styles/styles';

export default function SmallerButton({ text, onPress}) {
    return (
      <Pressable
          style={styles.smallerButton}
          onPress={onPress}
      >
          <Text>{text}</Text>
      </Pressable>
    )
}