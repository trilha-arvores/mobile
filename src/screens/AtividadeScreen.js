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
import { API_BASE} from '../config/api';


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

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState('checking');
  const [gpsReady, setGpsReady] = useState(false);      

  const getTrees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/trails/${item.id}/trees`);
      const trees = await response.json();
      setData(trees);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar árvores.");
    } finally {
      setLoading(false);
    }
  };

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


  useEffect(() => {
    if (route.params?.sucess) {
      setArvore(prev => prev + 1);
      
      const nextDist = data[arvore + 1]?.distance ?? 0;
      setDistancia(prev => prev + nextDist);

      navigation.setParams({ sucess: null });
    }
  }, [route.params?.sucess]);

  useEffect(() => {
    if (data.length > 0 && arvore >= item.n_trees) {
      setStart(false); 
      setFinish(true); 
      
      setTimeout(() => {
        navigation.navigate('Final', { 
          'tempo': time, 
          'distancia': distancia.toFixed(2), 
          'item': item 
        });
      }, 500);
    }
  }, [arvore, data]); 

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
                {}
                {currentTree && (
                  <Text style={styles.subtitle}>
                    Próxima árvore: {treeLabel}
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