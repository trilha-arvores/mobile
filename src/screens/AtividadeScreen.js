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
// GPS (única adição de libs)
import * as Location from 'expo-location';

// Helpers (apenas para distância)
const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a)); // metros
};
const fmtMeters = m => (m >= 1000 ? (m / 1000).toFixed(2) + ' km' : m.toFixed(1) + ' m');
const getTreeCoords = (t) => {
  if (!t) return null;
  const latitude = Number(t.latitude ?? t.lat);
  const longitude = Number(t.longitude ?? t.lng ?? t.lon);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
  return null;
};

export default function AtividadeScreen({ route, navigation }) {
  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const [time, setTime] = useState(0.0);
  const [distancia, setDistancia] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [degree, setDegree] = useState(0);

  // mantém como estava
  const item = route.params.item;
  const TRAIL_API_BASE_URL = 'http://200.144.255.186:2281';

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  // GPS (única adição de estado)
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState('checking');
  const [nextDistance, setNextDistance] = useState(null); // distância até a próxima árvore

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

  // GPS (único efeito adicionado)
  useEffect(() => {
    let sub;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocStatus(status);
        if (status !== 'granted') return;

        const first = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setCoords(first.coords);

        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 2000, distanceInterval: 5 },
          (loc) => setCoords(loc.coords)
        );
      } catch (e) {
        console.log('GPS error', e);
      }
    })();
    return () => { sub?.remove(); };
  }, []);

  // Recalcula a distância até a próxima árvore sempre que posição, índice ou dados mudarem
  useEffect(() => {
    const target = data?.[arvore];
    const tc = getTreeCoords(target);
    if (coords && tc) {
      setNextDistance(haversineMeters(coords.latitude, coords.longitude, tc.latitude, tc.longitude));
    } else {
      setNextDistance(null);
    }
  }, [coords, arvore, data]);

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
        { 'tempo': time, 'distancia': distancia.toFixed(2), 'item': item }
      );
    }
  }, [arvore])

  function getTime(time) { setTime(time); };

  // árvore alvo (a próxima a escanear)
  const currentTree = data?.[arvore];
  const treeLabel = currentTree?.name ?? `Árvore ${arvore + 1}`;
  const treeId = currentTree?.esalq_id ?? currentTree?.id;

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size={'large'}/>
      ) : (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ padding: 8, backgroundColor: '#f1f5f4' }}>
            {locStatus !== 'granted' ? (
              <Text style={{ color: '#555' }}>Permita acesso à localização para ver suas coordenadas.</Text>
            ) : coords ? (
              <>
                {/* <Text style={{ color: '#1e88e5' }}>
                  Sua posição: Lat {coords.latitude.toFixed(6)} | Lon {coords.longitude.toFixed(6)}
                </Text> */}
                {nextDistance != null && (
                  <Text style={styles.subtitle}>
                    Distância até a árvore {treeLabel}
                    {treeId ? ` (ID ${treeId})` : ''}: {fmtMeters(nextDistance)}
                  </Text>
                )}
              </>
            ) : (
              <Text>Obtendo localização...</Text>
            )}
          </View>

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
              <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                <DistanceComponent distance={distancia.toFixed(2)} />
                <View style={{ borderWidth: 0.5, height: '100%', backgroundColor: '#313131' }} />
                <TimeComponent start={start} getTime={getTime} />
              </View>
            </View>
            <View style={{
              flex: 1.3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 3
            }}>
              <Text style={{ color: '#313131', flex: 1, letterSpacing: 1.5 }}>
                ÁRVORES VISITADAS: {arvore}
              </Text>
              <Progress.Bar progress={arvore / item.n_trees} width={300} height={15} color={'#313131'} />
            </View>
            <View style={{
              flex: 3, flexDirection: 'row', justifyContent: 'space-around', width: '100%',
              paddingVertical: 10, paddingHorizontal: 50, borderTopWidth: 1, borderColor: '#313131',
            }}>
              {!finish ?
                <>
                  <FilledRoundButton text={start ? 'PAUSAR' : 'RETOMAR'} onPress={() => setStart(!start)} />
                  <Compass text={'BÚSSOLA'} />
                  <RoundButton
                    style={styles.button}
                    text='CAMERA'
                    onPress={() => {
                      navigation.navigate('Escanear', { 'tree': data[arvore], 'trail_id': item.id, 'position': arvore });
                    }}
                  />
                </> :
                <FilledRoundButton
                  text='FINALIZAR'
                  onPress={() =>
                    navigation.navigate('Final', { 'tempo': time, 'distancia': distancia, 'item': item })
                  }
                />}
            </View>
          </View>
        </View>
      )}
    </>
  )
}