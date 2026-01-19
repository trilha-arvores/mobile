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
import * as Location from 'expo-location';
import { useSuspendedTrail } from '../context/SuspendedTrailContext';

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
  const { suspendTrail, clearSuspendedTrail } = useSuspendedTrail();

  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const [time, setTime] = useState(0.0);
  const [distancia, setDistancia] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [degree, setDegree] = useState(0);

  const item = route.params.item;
  const TRAIL_API_BASE_URL = 'http://200.144.255.186:2281';

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState('checking');
  const [nextDistance, setNextDistance] = useState(null); 
  const [gpsReady, setGpsReady] = useState(false);      

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

  // GPS otimizado: fix inicial rápido + watch fluido
  useEffect(() => {
    let sub;
    let mounted = true;
    (async () => {
      try {
        // Permissão
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocStatus(status);
        if (status !== 'granted') return;

        try {
          const services = await Location.hasServicesEnabledAsync();
          if (!services) { await Location.enableNetworkProviderAsync(); }
        } catch {}

        const last = await Location.getLastKnownPositionAsync({});
        if (mounted && last?.coords) {
          setCoords(last.coords);
          setGpsReady(true);
        }

        try {
          const quick = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
            timeout: 5000,
            maximumAge: 10000
          });
          if (mounted && quick?.coords) {
            setCoords(quick.coords);
            setGpsReady(true);
          }
        } catch {}

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1000,   // 1s
            distanceInterval: 0   // 1m
          },
          (loc) => {
            if (!mounted) return;
            setCoords(loc.coords);
            if (!gpsReady) setGpsReady(true);
          }
        );
      } catch (e) {
        console.log('GPS error', e);
      }
    })();
    return () => { mounted = false; sub?.remove(); };
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

  // se abrir via "retomar", restaure o estado inicial
  useEffect(() => {
    if (route.params?.suspended) {
      const s = route.params.suspended;
      setArvore(s.arvore ?? 0);
      setTime(s.time ?? 0);
      setDistancia(s.distancia ?? 0);
      setData(s.data ?? []);
      setStart(true);
      // etc conforme seus campos
    }
  }, [route.params?.suspended]);

  // antes de sair: se não finalizou, salva em memória
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (finish) {
        clearSuspendedTrail();
        return;
      }
      // se não finalizou, grava o estado atual (não bloqueia navegação)
      const stateToSave = {
        trailId: item?.id,
        arvore,
        time,
        distancia,
        data,
        timestamp: Date.now(),
      };
      suspendTrail(stateToSave);
    });
    return unsub;
  }, [navigation, finish, arvore, time, distancia, data]);

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
                {nextDistance != null && (
                  <Text style={styles.subtitle}>
                    Distância até a árvore {treeLabel}
                    {treeId ? ` (Nº ${treeId})` : ''}: {fmtMeters(nextDistance)}
                  </Text>
                )}  
              </>
            ) : (
              <Text style={styles.subtitle}>Obtendo localização...</Text>
            )}
          </View>

          <View style={{ flex: 5, backgroundColor: 'whitesmoke' }}>
            <ZoomableImage 
              source={{ uri: item.map_img.replace('localhost', '192.168.0.12') }}
              // initialZoom={0.3}  // Start at 0.5x zoom instead of default 1x
              // minZoom={0.3}      // Allow zooming out further
              // contentWidth={800}  // Adjust based on your actual image dimensions
              // contentHeight={600}
              style={{ height: '100%', width: 'undefined', aspectRatio: 1, resizeMode: 'cover' }}
              // style={{ width: '100%', height: '100%', resizeMode: 'cover'}}
            />
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
                <TimeComponent start={start && gpsReady} getTime={getTime} />
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