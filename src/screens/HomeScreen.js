import React from 'react';
import { View, BackHandler } from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { styles } from '../styles/styles';

export default function HomeScreen ({ navigation }) {
    return (
      <>
        <View style={styles.item}>
          <DefaultButton
            text='Lista de Trilhas'
            onPress={() => navigation.navigate('Trilhas')}
          />
        </View>
        <View style={styles.item}>
          <DefaultButton
            text='Sair'
            onPress={() => BackHandler.exitApp()}
          />
        </View>
      </>
    );
  };