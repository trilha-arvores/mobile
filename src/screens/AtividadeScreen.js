import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Alert } from 'react-native';
import { styles } from '../styles/styles';
import RoundButton from '../components/RoundButton';
import * as Progress from 'react-native-progress';
import ZoomableImage from '../components/ZoomableImage';
import DistanceComponent from '../components/DistanceComponent';
import TimeComponent from '../components/TimeComponent';
import Compass from '../components/Compass';
import { useFonts } from 'expo-font';
import FilledRoundButton from '../components/FilledRoundButton';
import * as Location from 'expo-location';
import { normalizeUrl } from '../config/api';
import { useSuspendedTrail } from '../context/SuspendedTrailContext';

const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a)); 
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
      setData(trees);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Inicialização (Restaura ou Carrega)
  useEffect(() => {
    if (route.params?.suspended) {
      const s = route.params.suspended;
      setArvore(s.arvore ?? 0);
      setTime(s.time ?? 0);
      setDistancia(s.distancia ?? 0);
      if (s.data && s.data.length > 0) {
        setData(s.data);
        setLoading(false);
      } else {
        getTrees();
      }
      setStart(true);
    } else {
      getTrees();
    }
  }, []); 

  // Lógica de GPS
  useEffect(() => {
    let sub;
    let mounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocStatus(status);
        if (status !== 'granted') return;

        const last = await Location.getLastKnownPositionAsync({});
        if (mounted && last?.coords) {
          setCoords(last.coords);
          setGpsReady(true);
        }

        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 1000, distanceInterval: 0 },
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

  // Cálculo de distância
  useEffect(() => {
    const target = data?.[arvore];
    const tc = getTreeCoords(target);
    if (coords && tc) {
      setNextDistance(haversineMeters(coords.latitude, coords.longitude, tc.latitude, tc.longitude));
    } else {
      setNextDistance(null);
    }
  }, [coords, arvore, data]);

  useEffect(() => {
    if (route.params?.sucess) {
      setArvore(prev => {
        const novoValor = prev + 1;
        return novoValor;
      });
      
      const nextDist = data[arvore + 1]?.distance ?? 0;
      setDistancia(prev => prev + nextDist);

      navigation.setParams({ sucess: null });
    }
  }, [route.params?.sucess]);

  useEffect(() => {
    if (data.length > 0 && arvore >= item.n_trees) {
      setStart(false); // Para o timer
      setFinish(true); // Marca como finalizado
      
      // Aguarda um breve momento para o usuário ver a barra cheia e navega
      setTimeout(() => {
        navigation.navigate('Final', { 
          'tempo': time, 
          'distancia': distancia.toFixed(2), 
          'item': item 
        });
      }, 500);
    }
  }, [arvore, data]); // Monitora 'arvore'

  // Salva estado ao sair (se não finalizou)
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (finish || arvore >= item.n_trees) {
        clearSuspendedTrail();
        return;
      }
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

  function getTime(t) { setTime(t); };
  const currentTree = data?.[arvore];
  const treeLabel = currentTree?.name ?? `Árvore ${arvore + 1}`;

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size={'large'}/>
      ) : (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ padding: 8, backgroundColor: '#f1f5f4' }}>
            {locStatus !== 'granted' ? (
              <Text style={{ color: '#555' }}>Permita acesso à localização.</Text>
            ) : coords ? (
              <>
                {nextDistance != null && (
                  <Text style={styles.subtitle}>
                    Distância até {treeLabel}: {fmtMeters(nextDistance)}
                  </Text>
                )}  
              </>
            ) : (
              <Text style={styles.subtitle}>Obtendo localização...</Text>
            )}
          </View>

          <View style={{ flex: 5, backgroundColor: 'whitesmoke' }}>
            <ZoomableImage 
              source={{ uri: normalizeUrl(item.map_img) }} 
              style={{ height: '100%', width: 'undefined', aspectRatio: 1, resizeMode: 'cover' }}
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
            <View style={{ flex: 3, width: '100%', justifyContent: 'center', borderBottomWidth: 1 }}>
              <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                <DistanceComponent distance={distancia.toFixed(2)} />
                <View style={{ borderWidth: 0.5, height: '100%', backgroundColor: '#313131' }} />
                <TimeComponent start={start && gpsReady} getTime={getTime} initialTime={time} /> 
              </View>
            </View>
            <View style={{ flex: 1.3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 3 }}>
              <Text style={{ color: '#313131', flex: 1, letterSpacing: 1.5 }}>
                ÁRVORES VISITADAS: {arvore} / {item.n_trees}
              </Text>
              <Progress.Bar progress={arvore / item.n_trees} width={300} height={15} color={'#313131'} />
            </View>
            <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 10, paddingHorizontal: 50, borderTopWidth: 1, borderColor: '#313131' }}>
              {/* Se já finalizou, mostra o botão Finalizar (caso a navegação automática falhe ou seja cancelada) */}
              {(finish || arvore >= item.n_trees) ? 
                <FilledRoundButton
                  text='FINALIZAR'
                  onPress={() =>
                    navigation.navigate('Final', { 'tempo': time, 'distancia': distancia, 'item': item })
                  }
                />
               :
                <>
                  <FilledRoundButton text={start ? 'PAUSAR' : 'RETOMAR'} onPress={() => setStart(!start)} />
                  <Compass text={'BÚSSOLA'} />
                  <RoundButton
                    style={styles.button}
                    text='CAMERA'
                    onPress={() => {
                      navigation.navigate('Escanear', { 
                        'tree': data[arvore], 
                        'trail_id': item.id, 
                        'position': arvore 
                      });
                    }}
                  />
                </>
              }
            </View>
          </View>
        </View>
      )}
    </>
  )
}