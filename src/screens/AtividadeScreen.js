import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { styles } from '../styles/styles';
import RoundButton from '../components/RoundButton';
import * as Progress from 'react-native-progress';
import DistanceComponent from '../components/DistanceComponent';
import TimeComponent from '../components/TimeComponent';
import Compass from '../components/Compass';
import { useFonts } from 'expo-font';
import FilledRoundButton from '../components/FilledRoundButton';
import * as Location from 'expo-location';
import { useSuspendedTrail } from '../context/SuspendedTrailContext';
import { API_BASE } from '../config/api';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function AtividadeScreen({ route, navigation }) {
  const { suspendTrail, clearSuspendedTrail } = useSuspendedTrail();
  const mapRef = useRef(null);

  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const [time, setTime] = useState(0.0);
  const [distancia, setDistancia] = useState(0);
  
  const [data, setData] = useState([]); 
  const [isLoading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
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
      setErrorMsg(null);
      const url = `${API_BASE}/trails/${item.id}/trees`;
      console.log(`[DEBUG] Buscando: ${url}`);
      
      const response = await fetch(url);
      const result = await response.json();
      console.log("[DEBUG] Resposta processada:", Object.keys(result));

      let treeList = [];

      if (Array.isArray(result)) {
        treeList = result;
      } else if (typeof result === 'object' && result !== null) {
        const values = Object.values(result);
        if (values.length > 0 && values[0].name) {
             treeList = values;
        } else if (Array.isArray(result.rows)) {
             treeList = result.rows;
        } else if (Array.isArray(result.data)) {
             treeList = result.data;
        }
      }

      setData(treeList);

      if (treeList.length === 0) {
        setErrorMsg("Lista vazia retornada pela API.");
      }

    } catch (error) {
      console.error("Erro no getTrees:", error);
      setErrorMsg(`Erro: ${error.message}`);
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
      
      if (s.data && Array.isArray(s.data) && s.data.length > 0) {
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
        if (mounted && last?.coords) { setCoords(last.coords); setGpsReady(true); }
        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 1000, distanceInterval: 0 },
          (loc) => { if (!mounted) return; setCoords(loc.coords); if (!gpsReady) setGpsReady(true); }
        );
      } catch (e) { console.log('GPS error', e); }
    })();
    return () => { mounted = false; sub?.remove(); };
  }, []);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && mapRef.current) {
      const targetTree = data[arvore];
      if (targetTree) {
        const latStr = String(targetTree.latitude || targetTree.lat || '').replace(',', '.');
        const lngStr = String(targetTree.longitude || targetTree.lng || targetTree.lon || '').replace(',', '.');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {
          mapRef.current.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }, 1000);
        }
      }
    }
  }, [arvore, data]);

  useEffect(() => {
    if (route.params?.sucess) {
      setArvore(prev => prev + 1);
      const nextDist = data[arvore + 1]?.distance ?? 0;
      setDistancia(prev => prev + nextDist);
      navigation.setParams({ sucess: null });
    }
  }, [route.params?.sucess]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && arvore >= item.n_trees) {
      setStart(false); 
      setFinish(true); 
      setTimeout(() => {
        navigation.navigate('Final', { 'tempo': time, 'distancia': distancia.toFixed(2), 'item': item });
      }, 500);
    }
  }, [arvore, data]); 

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (finish || arvore >= item.n_trees) { clearSuspendedTrail(); return; }
      const stateToSave = { trailId: item?.id, arvore, time, distancia, data, timestamp: Date.now() };
      suspendTrail(stateToSave);
    });
    return unsub;
  }, [navigation, finish, arvore, time, distancia, data]);

  // Função segura para atualizar tempo
  const handleTimeUpdate = (newTime) => {
      setTime(newTime);
  };
  
  const currentTree = (Array.isArray(data) && data.length > arvore) ? data[arvore] : null;
  const treeLabel = currentTree?.name ?? `Carregando...`;
  const initialLat = -22.71; 
  const initialLng = -47.63;

  return (
    <>
      {isLoading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'}/>
            <Text>Carregando dados...</Text>
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          
          {(errorMsg || data.length === 0) && (
             <View style={{ backgroundColor: '#ffebee', padding: 5, alignItems: 'center' }}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                   {errorMsg ? errorMsg : `NENHUMA ÁRVORE ENCONTRADA`}
                </Text>
             </View>
          )}

          <View style={{ padding: 8, backgroundColor: '#f1f5f4' }}>
            {locStatus !== 'granted' ? (
              <Text style={{ color: '#555' }}>Permita acesso à localização.</Text>
            ) : coords ? (
              <>
                {currentTree ? (
                  <Text style={styles.subtitle}>Próxima: {treeLabel}</Text>
                ) : (
                  <Text style={styles.subtitle}>Carregando...</Text>
                )}  
              </>
            ) : (
              <Text style={styles.subtitle}>Obtendo localização...</Text>
            )}
          </View>

          <View style={{ flex: 5, backgroundColor: 'whitesmoke', overflow: 'hidden' }}>
             <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={false} 
                showsMyLocationButton={false}
                toolbarEnabled={false}
                initialRegion={{
                  latitude: parseFloat(data?.[0]?.latitude || data?.[0]?.lat || initialLat),
                  longitude: parseFloat(data?.[0]?.longitude || data?.[0]?.lng || initialLng),
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
             >
                {Array.isArray(data) && data.map((tree, index) => {
                  const latStr = String(tree.latitude || tree.lat || '').replace(',', '.');
                  const lngStr = String(tree.longitude || tree.lng || tree.lon || '').replace(',', '.');
                  const lat = parseFloat(latStr);
                  const lng = parseFloat(lngStr);
                  
                  if (isNaN(lat) || isNaN(lng)) return null;

                  let pinColor = 'blue'; 
                  if (index < arvore) pinColor = 'green';
                  if (index === arvore) pinColor = 'red'; 

                  return (
                    <Marker
                      key={`tree-${tree.id || index}`}
                      coordinate={{ latitude: lat, longitude: lng }}
                      title={`${index + 1}. ${tree.name}`}
                      pinColor={pinColor}
                      opacity={index > arvore ? 0.6 : 1}
                    />
                  );
                })}
             </MapView>
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
                
                {}
                <TimeComponent 
                    start={start && gpsReady} 
                    getTime={handleTimeUpdate} 
                    initialTime={time} 
                /> 

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
                        const safeTree = (data && data.length > arvore) 
                                        ? data[arvore] 
                                        : { id: 0, esalq_id: 0, name: 'Modo Teste' };
                        
                        navigation.navigate('Escanear', { 
                            'tree': safeTree, 
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