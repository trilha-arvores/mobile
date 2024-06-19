import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView, Image, toFixed } from 'react-native';
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
  const [time, setTime] = useState(0.0);
  const [distancia, setDistancia] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const item = route.params.item;  


  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  const getTrees = async () => {
    try {
      const response = await fetch('http://192.168.0.12:5000/trails/' + item.id + '/trees');
      const trees = await response.json();
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
        setDistancia(n => n + data[arvore].distance);
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
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ flex: 5, backgroundColor: 'whitesmoke' }}>
        <ZoomableImage source={require('../assets/mapa.jpg')} />
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
            <TimeComponent start={start} getTime={getTime}/>
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
          paddingHorizontal: 100,
          borderTopWidth: 1,
          borderColor: '#313131',
        }}>
          {!finish ?
            <>
              <FilledRoundButton
                text={start ? 'PAUSAR' : 'RETOMAR'}
                onPress={() => setStart(!start)}
              />
              <RoundButton
                style={styles.button}
                text='CAMERA'
                onPress={() => {
                  navigation.navigate('Escanear');
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