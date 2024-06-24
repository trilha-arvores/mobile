import React from 'react';
import { Text, Pressable } from 'react-native';
import { styles } from '../styles/styles';

export default function ChangeColorButton({ text, color }) {
    return (
      <Pressable
          style={[styles.button, {backgroundColor: color}]}
      >
          <Text style={[styles.text, {textAlign: 'center'}]}>{text}</Text>
      </Pressable>
    )
}