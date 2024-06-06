import React from 'react';
import { Text, Pressable } from 'react-native';
import { styles } from '../styles/styles';

export default function DefaultButton({ text, onPress}) {
    return (
      <Pressable
          style={styles.button}
          onPress={onPress}
      >
          <Text style={styles.text}>{text}</Text>
      </Pressable>
    )
}