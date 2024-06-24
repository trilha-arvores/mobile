import React from 'react';
import { View, BackHandler, Image, Text, ImageBackground } from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { LinearGradient } from "expo-linear-gradient"
import { styles } from '../styles/styles';

export default function HomeScreen({ navigation }) {
  return (
    <>
      <ImageBackground
        style={{ width: '100%', height: 500 }}
        source={require('../assets/flamboyant-laranja-esalq.jpg')}>
        <LinearGradient
          colors={['transparent', 'transparent', 'white']}
          style={{ height: '100%', width: '100%' }}>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.homeContainer}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require('../assets/icon.png')}
        />
        <Text style={styles.title}>
          Trilha das Árvores
        </Text>
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
        <Text>
          &#169; Trilha das Árvores e YouthMappers
        </Text>
      </View>
    </>
  );
};