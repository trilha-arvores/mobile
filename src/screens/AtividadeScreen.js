import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView, Image } from 'react-native';
import { styles } from '../styles/styles';
import DefaultButton from '../components/DefaultButton';
import RoundButton from '../components/RoundButton';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';
import * as Progress from 'react-native-progress';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import ZoomableImage from '../components/ZoomableImage';
import DistanceComponent from '../components/DistanceComponent';
import TimeComponent from '../components/TimeComponent';
import { useFonts } from 'expo-font';
import FilledRoundButton from '../components/FilledRoundButton';
// import RoundButton from '../components/RoundButton';



export default function AtividadeScreen({ route, navigation }) {
  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const nArvores = 3;

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

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
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ flex: 5, backgroundColor: 'whitesmoke' }}>
        <ZoomableImage source={require('../assets/mapa.jpg')} />
      </View>
      <View style={{
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fdfdfd',
        borderWidth: 1,
        borderColor: '#313131',
      }}>
        <View style={{
          flex: 3,
          width: '100%',
          justifyContent: 'center',
          borderBottomWidth: 1,
        }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            // justifyContent: 'center'
          }}>
            <DistanceComponent distance={' 1.8'}/>
            <View style={{ borderWidth: 0.5, height: '100%', backgroundColor: '#313131' }} />
            <TimeComponent start={start} />
          </View>
        </View>
        <View style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row'
        }}>
          <Progress.Bar progress={arvore / nArvores} width={300} height={15} color={'#313131'} />
        </View>
        <View style={{
          flex: 3,
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 100,
          borderTopWidth: 1,
          borderColor: '#313131',
        }}>
          {!finish ?
            <FilledRoundButton
              text={start ? 'PAUSAR' : 'RETOMAR'}
              onPress={() => setStart(!start)}
            /> :
            <FilledRoundButton
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
            <RoundButton
              style={styles.button}
              text='CAMERA'
              onPress={() => {
                navigation.navigate('Escanear');
              }
              }>
            </RoundButton> :
            <View></View>}
        </View>
      </View>
    </View>
  )
}