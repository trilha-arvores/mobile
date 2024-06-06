import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles/styles';
import DefaultButton from '../components/DefaultButton';

export default function IniciarScreen ({ route, navigation }) {
  const item = route.params.item;
  return (
    <View>
      <Text style={styles.item}>
        {item.title}, {item.releaseYear}
      </Text>
      <DefaultButton
        text='Iniciar'
        onPress={() => navigation.navigate('Atividade', { item })}
      />
    </View>
  )
}