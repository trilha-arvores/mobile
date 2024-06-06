import React from 'react';
import { View } from 'react-native';
import DefaultButton from '../components/DefaultButton';

export default function ScanScreen ({ route, navigation }) {
    return (
      <View>
        <DefaultButton
          text='Sucesso ao Escanear'
          onPress={() =>
            navigation.navigate({
              name: 'Atividade',
              params: {sucess: true},
              merge: true
            })
          }
        />
        <DefaultButton
          text='Erro ao Escanear'
          onPress={() =>
            navigation.navigate({
              name: 'Atividade',
              params: {sucess: false},
              merge: true
            })
          }
        />
      </View>
    )
  }