import React from 'react';
import { Text, Pressable } from 'react-native';
import { styles } from '../styles/styles';

export default function RoundButton({ text, onPress }) {
    return (
        <Pressable
            style={styles.roundButton}
            onPress={onPress}
        >
            <Text style={{
                color: 'white',
                fontWeight: 'bold'
            }}>{text}</Text>
        </Pressable>
    )
}