import React from 'react';
import { Text, Pressable } from 'react-native';
import { styles } from '../styles/styles';

export default function FilledRoundButton({ text, onPress }) {
    return (
        <Pressable
            style={styles.filledRoundButton}
            onPress={onPress}
        >
            <Text style={{
                color: '#517300',
                fontWeight: 'bold',
            }}>{text}</Text>
        </Pressable>
    )
}