import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { API_BASE, normalizeUrl } from '../config/api';
import { useSuspendedTrail } from '../context/SuspendedTrailContext';
import { colors } from '../styles/Colors';

function TrilhaCard({ item, onPress, isSuspended }) {
  return (
    <Pressable
      style={({ pressed }) => [localStyles.card, pressed && localStyles.cardPressed]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir trilha ${item.name}`}
    >
      <Image style={localStyles.cover} source={{ uri: normalizeUrl(item.thumb_img) }} />

      <View style={localStyles.content}>
        <View style={localStyles.titleRow}>
          <Text style={localStyles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          {isSuspended && (
            <View style={localStyles.suspendedTag}>
              <Text style={localStyles.suspendedTagText}>PAUSADA</Text>
            </View>
          )}
        </View>

        <View style={localStyles.metaRow}>
          <View style={localStyles.metaItem}>
            <FontAwesome5 name="tree" size={14} color={colors.green} />
            <Text style={localStyles.metaText}>{item.n_trees} arvores</Text>
          </View>
          <View style={localStyles.metaItem}>
            <FontAwesome5 name="running" size={14} color={colors.green} />
            <Text style={localStyles.metaText}>{item.distance} km</Text>
          </View>
        </View>

        <Text style={localStyles.hint}>Toque para iniciar ou retomar a atividade.</Text>
      </View>
    </Pressable>
  );
}

export default function TrilhasScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const { suspended, clearSuspendedTrail } = useSuspendedTrail();

  const loadTrails = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/trails/`);

      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}.`);
      }

      const json = await response.json();
      setData(Array.isArray(json) ? json : []);
    } catch (error) {
      const msg = `Nao foi possivel carregar as trilhas.\n\nDetalhes: ${error.message}`;
      setErrorMsg(msg);
      Alert.alert('Erro de conexao', msg);
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTrails();
  }, [loadTrails]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTrails({ silent: true });
  };

  const handleTrailPress = (item) => {
    if (suspended && String(suspended.trailId) === String(item.id)) {
      Alert.alert('Trilha em andamento', 'Voce tem uma trilha pausada. Como deseja continuar?', [
        {
          text: 'Iniciar do zero',
          onPress: () => {
            clearSuspendedTrail();
            navigation.navigate('Iniciar', { item });
          },
          style: 'destructive',
        },
        {
          text: 'Retomar trilha',
          onPress: () => {
            navigation.navigate('Atividade', { item, suspended });
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]);
      return;
    }

    navigation.navigate('Iniciar', { item });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={localStyles.centeredState}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={localStyles.stateText}>Carregando trilhas disponiveis...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={localStyles.screen}>
      <View style={localStyles.headerBlock}>
        <Text style={localStyles.headerTitle}>Escolha sua trilha</Text>
        <Text style={localStyles.headerSubtitle}>Veja distancia, numero de checkpoints e toque para comecar.</Text>
      </View>

      {errorMsg ? (
        <Pressable style={localStyles.errorCard} onPress={() => loadTrails()}>
          <Text style={localStyles.errorTitle}>Falha ao atualizar trilhas</Text>
          <Text style={localStyles.errorText}>Toque aqui para tentar novamente.</Text>
        </Pressable>
      ) : null}

      <FlatList
        data={data}
        keyExtractor={({ id }) => String(id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={localStyles.emptyState}>
            <FontAwesome5 name="tree" size={22} color={colors.green} />
            <Text style={localStyles.emptyTitle}>Nenhuma trilha encontrada</Text>
            <Text style={localStyles.emptyText}>Puxe a lista para baixo para atualizar.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TrilhaCard
            item={item}
            onPress={handleTrailPress}
            isSuspended={Boolean(suspended && String(suspended.trailId) === String(item.id))}
          />
        )}
      />
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
  stateText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  headerBlock: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerTitle: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  errorCard: {
    marginHorizontal: 18,
    marginTop: 6,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#f3c5c5',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  errorTitle: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: colors.black,
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 22,
    paddingTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e2e8e5',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 7,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardPressed: {
    opacity: 0.95,
  },
  cover: {
    width: '100%',
    height: 140,
    backgroundColor: colors.mutedSurface,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    color: colors.black,
    fontSize: 18,
    fontWeight: '800',
  },
  suspendedTag: {
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#fff8e6',
  },
  suspendedTagText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '600',
  },
  hint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#f9fbfa',
  },
  emptyTitle: {
    marginTop: 8,
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
