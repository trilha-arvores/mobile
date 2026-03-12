import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';
import DistanceComponent from '../components/DistanceComponent';
import TimeComponent from '../components/TimeComponent';
import Compass from '../components/Compass';
import FilledRoundButton from '../components/FilledRoundButton';
import RoundButton from '../components/RoundButton';
import * as Location from 'expo-location';
import { useSuspendedTrail } from '../context/SuspendedTrailContext';
import { API_BASE } from '../config/api';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '../styles/Colors';

function parseCoordinate(value, fallback) {
  const normalized = String(value ?? '').replace(',', '.');
  const parsed = parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDistance(value) {
  const normalized = String(value ?? '').replace(',', '.');
  const parsed = parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTreeList(result) {
  if (Array.isArray(result)) return result;
  if (typeof result !== 'object' || result === null) return [];

  const values = Object.values(result);
  if (values.length > 0 && values[0]?.name) return values;
  if (Array.isArray(result.rows)) return result.rows;
  if (Array.isArray(result.data)) return result.data;

  return [];
}

function LegendDot({ color, label }) {
  return (
    <View style={localStyles.legendItem}>
      <View style={[localStyles.dot, { backgroundColor: color }]} />
      <Text style={localStyles.legendText}>{label}</Text>
    </View>
  );
}

export default function AtividadeScreen({ route, navigation }) {
  const { suspendTrail, clearSuspendedTrail } = useSuspendedTrail();
  const mapRef = useRef(null);
  const { width } = useWindowDimensions();

  const item = route.params.item;

  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const [time, setTime] = useState(0);
  const [distancia, setDistancia] = useState(0);

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const totalTrees = Number(item?.n_trees) || data.length || 0;

  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState('checking');
  const [gpsReady, setGpsReady] = useState(false);

  const currentTree = useMemo(() => {
    if (!Array.isArray(data) || data.length <= arvore) return null;
    return data[arvore];
  }, [data, arvore]);

  const treeLabel = currentTree
    ? `N${currentTree.esalq_id || '-'} - ${currentTree.name}`
    : 'Aguardando dados da proxima arvore';

  const progressValue = useMemo(() => {
    if (!totalTrees) return 0;
    return Math.min(arvore / totalTrees, 1);
  }, [arvore, totalTrees]);
  const progressBarWidth = useMemo(() => Math.max(width - 36, 180), [width]);

  const focusOnTree = useCallback((tree, duration = 900) => {
    if (!tree || !mapRef.current) return;

    const latitude = parseCoordinate(tree.latitude || tree.lat, -22.71);
    const longitude = parseCoordinate(tree.longitude || tree.lng || tree.lon, -47.63);

    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0022,
      },
      duration,
    );
  }, []);

  const getTrees = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const url = `${API_BASE}/trails/${item.id}/trees`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}.`);
      }

      const result = await response.json();
      const treeList = normalizeTreeList(result);
      setData(treeList);

      if (treeList.length === 0) {
        setErrorMsg('Nao encontramos checkpoints para esta trilha no momento.');
      }
    } catch (error) {
      console.error('Erro no getTrees:', error);
      setErrorMsg(`Nao foi possivel carregar os checkpoints. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [item.id]);

  useEffect(() => {
    if (route.params?.suspended) {
      const suspendedState = route.params.suspended;

      setArvore(suspendedState.arvore ?? 0);
      setTime(suspendedState.time ?? 0);
      setDistancia(suspendedState.distancia ?? 0);

      if (Array.isArray(suspendedState.data) && suspendedState.data.length > 0) {
        setData(suspendedState.data);
        setLoading(false);
      } else {
        getTrees();
      }

      setStart(true);
      return;
    }

    getTrees();
  }, [route.params?.suspended, getTrees]);

  useEffect(() => {
    let subscription;
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (!mounted) return;

        setLocStatus(status);
        if (status !== 'granted') return;

        const last = await Location.getLastKnownPositionAsync({});
        if (mounted && last?.coords) {
          setCoords(last.coords);
          setGpsReady(true);
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1000,
            distanceInterval: 0,
          },
          (loc) => {
            if (!mounted) return;
            setCoords(loc.coords);
            setGpsReady(true);
          },
        );
      } catch (error) {
        console.log('GPS error', error);
      }
    })();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    focusOnTree(currentTree);
  }, [currentTree, focusOnTree]);

  useEffect(() => {
    if (route.params?.sucess) {
      setArvore((prev) => Math.min(prev + 1, totalTrees));
      setDistancia((prev) => prev + parseDistance(data[arvore + 1]?.distance ?? 0));
      navigation.setParams({ sucess: null });
    }
  }, [route.params?.sucess, arvore, data, navigation, totalTrees]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && arvore >= totalTrees && totalTrees > 0) {
      setStart(false);
      setFinish(true);

      setTimeout(() => {
        navigation.navigate('Final', {
          tempo: time,
          distancia: distancia.toFixed(2),
          item,
        });
      }, 450);
    }
  }, [arvore, data, distancia, item, navigation, time, totalTrees]);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', () => {
      if (finish || arvore >= totalTrees) {
        clearSuspendedTrail();
        return;
      }

      suspendTrail({
        trailId: item?.id,
        arvore,
        time,
        distancia,
        data,
        timestamp: Date.now(),
      });
    });

    return unsub;
  }, [navigation, finish, arvore, time, distancia, data, totalTrees, clearSuspendedTrail, suspendTrail, item?.id]);

  const handleTimeUpdate = (newTime) => {
    setTime(newTime);
  };

  const handleScanPress = () => {
    if (!currentTree) {
      Alert.alert('Aguarde', 'Ainda estamos preparando o proximo checkpoint.');
      return;
    }

    navigation.navigate('Escanear', {
      tree: currentTree,
      trail_id: item.id,
      position: arvore,
    });
  };

  const locationMessage =
    locStatus !== 'granted'
      ? 'Permita acesso a localizacao para acompanhar o mapa em tempo real.'
      : coords
        ? 'Localizacao ativa.'
        : 'Obtendo localizacao atual...';

  const defaultLatitude = parseCoordinate(data?.[0]?.latitude || data?.[0]?.lat, -22.71);
  const defaultLongitude = parseCoordinate(data?.[0]?.longitude || data?.[0]?.lng, -47.63);

  if (isLoading) {
    return (
      <SafeAreaView style={localStyles.centeredState}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={localStyles.loadingText}>Carregando checkpoints da trilha...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={localStyles.screen}>
      <View style={localStyles.topPanel}>
        <View style={localStyles.topLine}>
          <Text style={localStyles.topTitle}>Checkpoint {Math.min(arvore + 1, totalTrees || 1)} de {totalTrees || '-'}</Text>
          <View style={[localStyles.activityTag, start && gpsReady ? localStyles.activeTag : localStyles.pausedTag]}>
            <Text style={localStyles.activityTagText}>{start && gpsReady ? 'EM ATIVIDADE' : 'PAUSADO'}</Text>
          </View>
        </View>

        <Text style={localStyles.nextLabel}>Proxima arvore</Text>
        <Text style={localStyles.nextValue} numberOfLines={1}>
          {treeLabel}
        </Text>

        <View style={localStyles.locationRow}>
          <FontAwesome5 name="map-marker-alt" size={13} color={colors.green} />
          <Text style={localStyles.locationText}>{locationMessage}</Text>
        </View>

        {(errorMsg || data.length === 0) && (
          <Pressable style={localStyles.errorBanner} onPress={getTrees}>
            <Text style={localStyles.errorBannerTitle}>Nao foi possivel carregar checkpoints.</Text>
            <Text style={localStyles.errorBannerSubtitle}>Toque para tentar novamente.</Text>
          </Pressable>
        )}
      </View>

      <View style={localStyles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          showsCompass
          rotateEnabled
          pitchEnabled={false}
          showsUserLocation={locStatus === 'granted'}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          initialRegion={{
            latitude: defaultLatitude,
            longitude: defaultLongitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {Array.isArray(data) &&
            data.map((tree, index) => {
              const latitude = parseCoordinate(tree.latitude || tree.lat, NaN);
              const longitude = parseCoordinate(tree.longitude || tree.lng || tree.lon, NaN);

              if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

              let pinColor = '#2f6f8f';
              let statusKey = 'next';
              if (index < arvore) {
                pinColor = colors.green;
                statusKey = 'visited';
              }
              if (index === arvore) {
                pinColor = colors.red;
                statusKey = 'current';
              }

              return (
                <Marker
                  key={`tree-${tree.id || index}-${statusKey}`}
                  coordinate={{ latitude, longitude }}
                  title={`${index + 1}. ${tree.name}`}
                  pinColor={pinColor}
                  opacity={index > arvore ? 0.65 : 1}
                />
              );
            })}
        </MapView>

        <View style={localStyles.legendCard} pointerEvents="none">
          <LegendDot color={colors.red} label="Atual" />
          <LegendDot color={colors.green} label="Visitada" />
          <LegendDot color="#2f6f8f" label="Proximas" />
        </View>

        <Pressable
          style={localStyles.centerButton}
          onPress={() => focusOnTree(currentTree, 650)}
          accessibilityRole="button"
          accessibilityLabel="Centralizar mapa no proximo checkpoint"
        >
          <FontAwesome5 name="crosshairs" size={18} color={colors.white} />
        </Pressable>
      </View>

      <View style={localStyles.bottomPanel}>
        <View style={localStyles.metricsRow}>
          <DistanceComponent distance={distancia.toFixed(2)} />
          <View style={localStyles.verticalDivider} />
          <TimeComponent start={start && gpsReady} getTime={handleTimeUpdate} initialTime={time} />
        </View>

        <View style={localStyles.progressWrap}>
          <Text style={localStyles.progressText}>Arvores visitadas: {arvore} / {totalTrees}</Text>
          <Progress.Bar
            progress={progressValue}
            width={progressBarWidth}
            height={13}
            borderRadius={8}
            color={colors.green}
            unfilledColor="#e6ebe8"
            borderWidth={0}
          />
        </View>

        <View style={localStyles.actionsRow}>
          {finish || arvore >= totalTrees ? (
            <FilledRoundButton
              text="FINALIZAR"
              onPress={() => navigation.navigate('Final', { tempo: time, distancia, item })}
            />
          ) : (
            <>
              <FilledRoundButton
                text={start ? 'PAUSAR' : 'RETOMAR'}
                onPress={() => setStart((prev) => !prev)}
                accessibilityLabel={start ? 'Pausar cronometro' : 'Retomar cronometro'}
              />

              <Compass />

              <RoundButton
                text="ESCANEAR QR"
                onPress={handleScanPress}
                disabled={!currentTree}
                accessibilityLabel="Abrir camera para escanear QR Code"
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  topPanel: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.mutedSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  topTitle: {
    flex: 1,
    color: colors.black,
    fontSize: 15,
    fontWeight: '800',
  },
  activityTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activityTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: colors.black,
  },
  activeTag: {
    backgroundColor: '#e7f0d6',
    borderWidth: 1,
    borderColor: '#c9d8a6',
  },
  pausedTag: {
    backgroundColor: '#fff4d9',
    borderWidth: 1,
    borderColor: '#f0d89f',
  },
  nextLabel: {
    marginTop: 7,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  nextValue: {
    marginTop: 2,
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
  locationRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorBanner: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f4c2c2',
    backgroundColor: '#fff1f1',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  errorBannerTitle: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 13,
  },
  errorBannerSubtitle: {
    marginTop: 2,
    color: colors.black,
    fontSize: 12,
  },
  mapContainer: {
    flex: 5,
    backgroundColor: colors.mutedSurface,
    overflow: 'hidden',
    position: 'relative',
  },
  legendCard: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#dce2df',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '600',
  },
  centerButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.white,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bottomPanel: {
    flex: 2.9,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#e1e7e4',
    borderRadius: 12,
    backgroundColor: '#fbfcfb',
    paddingVertical: 4,
  },
  verticalDivider: {
    width: 1,
    marginVertical: 10,
    backgroundColor: colors.border,
  },
  progressWrap: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  progressText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    gap: 8,
  },
});
