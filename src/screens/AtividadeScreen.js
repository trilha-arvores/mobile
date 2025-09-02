import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView, Image, toFixed, ActivityIndicator } from 'react-native';
import { styles } from '../styles/styles';
import DefaultButton from '../components/DefaultButton';
import RoundButton from '../components/RoundButton';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';
import * as Progress from 'react-native-progress';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import ZoomableImage from '../components/ZoomableImage';
import DistanceComponent from '../components/DistanceComponent';
import TimeComponent from '../components/TimeComponent';
import Compass from '../components/Compass';
import { useFonts } from 'expo-font';
import FilledRoundButton from '../components/FilledRoundButton';
import CompassHeading from 'react-native-compass-heading';
import { Platform } from 'react-native';
// import RoundButton from '../components/RoundButton';


export default function AtividadeScreen({ route, navigation }) {
  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const [time, setTime] = useState(0.0);
  const [distancia, setDistancia] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [degree, setDegree] = useState(0);
  //const TRAIL_API_BASE_URL = __DEV__ ? 'http://192.168.0.12:5000' : 'https://ALGUMACOISA.COM';
  // const TRAIL_API_BASE_URL = __DEV__
  // ? Platform.OS === 'android'
  //   ? 'http://10.0.2.2:5000'   // Android emulator
  //   : 'http://localhost:5000'  // iOS simulator ou expo web
  // : 'https://seu-domínio.com';
   const item = route.params.item;

  const TRAIL_API_BASE_URL = 'http://200.144.255.186:2281';  


  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  const getTrees = async () => {
    try {
      setLoading(true);
      const response = await fetch(TRAIL_API_BASE_URL + '/trails/' + item.id + '/trees');
      const trees = await response.json();
      console.log(trees);
      setData(trees);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrees();
  }, []);

  React.useEffect(() => {
    if (route.params?.sucess) {
      if (route.params.sucess) {
        setArvore(n => n + 1);
        const distance = data[arvore + 1] != null && data[arvore + 1].distance != null ? data[arvore + 1].distance : 0;
        setDistancia(n => n + distance);
      }
      route.params.sucess = false;
    }
  }, [route.params?.sucess]);

  React.useEffect(() => {
    if (arvore == item.n_trees) {
      setStart(false);
      setFinish(true);
      navigation.navigate(
        'Final',
        {
          'tempo': time,
          'distancia': distancia.toFixed(2),
          'item': item
        }
      );
    }
  }, [arvore])

  function getTime(time) {
    setTime(time);
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size={'large'}/>
      ) : (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 5, backgroundColor: 'whitesmoke' }}>
            <ZoomableImage source={{ uri: item.map_img.replace('localhost', '192.168.0.12') }} />
          </View>
          <View style={{
            flex: 2.5,
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
                <DistanceComponent distance={distancia.toFixed(2)} />
                <View style={{ borderWidth: 0.5, height: '100%', backgroundColor: '#313131' }} />
                <TimeComponent start={start} getTime={getTime} />
              </View>
            </View>
            <View style={{
              flex: 1.3,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 3
            }}>
              <Text style={{ color: '#313131', flex: 1, letterSpacing: 1.5 }}>
                ÁRVORES VISITADAS: {arvore}
              </Text>
              <Progress.Bar progress={arvore / item.n_trees} width={300} height={15} color={'#313131'} />
            </View>
            <View style={{
              flex: 3,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingVertical: 10,
              paddingHorizontal: 50,
              borderTopWidth: 1,
              borderColor: '#313131',
            }}>
              {!finish ?
                <>
                  <FilledRoundButton
                    text={start ? 'PAUSAR' : 'RETOMAR'}
                    onPress={() => setStart(!start)}
                  />
                  <Compass text={'BÚSSOLA'} />
                  <RoundButton
                    style={styles.button}
                    text='CAMERA'
                    onPress={() => {
                      navigation.navigate('Escanear', { 'tree': data[arvore], 'trail_id': item.id, 'position': arvore });
                    }
                    }>
                  </RoundButton>
                </> :
                <FilledRoundButton
                  text='FINALIZAR'
                  onPress={() =>
                    navigation.navigate(
                      'Final',
                      {
                        'tempo': time,
                        'distancia': distancia,
                        'item': item
                      }
                    )
                  }
                />}
            </View>
          </View>
        </View>
      )
      }
    </>
  )
}