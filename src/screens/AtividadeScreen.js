import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { styles } from '../styles/styles';
import DefaultButton from '../components/DefaultButton';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';
import * as Progress from 'react-native-progress';

export default function AtividadeScreen ({ route, navigation }) {
  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const nArvores = 3;

  React.useEffect(() => {
    if (route.params?.sucess) {
      if (route.params.sucess) {
        setArvore(n => n + 1);
      }
      route.params.sucess = false;
    }
  }, [route.params?.sucess]);

  React.useEffect(() => {
    if (arvore == nArvores) {
      setStart(false);
      setFinish(true);
      navigation.navigate(
        'Final', 
        {
          'tempo': '20m30s', 
          'distancia': '2km'
        }
      );
    }
  }, [arvore])

  return (
    <View>
      <Text>
        corrida
      </Text>
      <StopWatch start={start} />
      {!finish ?
        <DefaultButton
          text={start ? 'Pausar' : 'Retomar'}
          onPress={() => setStart(!start)}
        /> :
        <DefaultButton
          text='Finalizar'
          onPress={() => 
            navigation.navigate(
              'Final', 
              {
                'tempo': '20m30s', 
                'distancia': '2km'
              }
            )
          }
        />}
      {!finish ?
        <Pressable
          style={styles.button}
          onPress={() => {
            navigation.navigate('Escanear');
          }
          }>
          <Text style={styles.text}>
            Camera
          </Text>
        </Pressable> :
        <View></View>}
      <Progress.Bar progress={arvore / nArvores} width={200} />
    </View>
  )
}