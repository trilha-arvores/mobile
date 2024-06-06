import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../components/DefaultButton';

export default function FinalScreen ({ route, navigation }) {
    return (
      <View>
        <Text>
          Parabains! Voce terminou a corrida de {route.params.distancia} em {route.params.tempo}
        </Text>
        <DefaultButton
          text='Compartilhar'
        />
        <DefaultButton
          text='Início'
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    )
  }