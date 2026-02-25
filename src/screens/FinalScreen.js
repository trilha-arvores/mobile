import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { useFonts } from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { API_BASE, normalizeUrl } from '../config/api';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { colors } from '../styles/Colors';

export default function FinalScreen({ route, navigation }) {
  const { tempo: time, distancia, item } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [trees, setTrees] = useState([]);
  const viewRef = useRef();

  const [fontsLoaded] = useFonts({
    BebasNeue: require('../assets/fonts/BebasNeue.ttf'),
  });

  const formatTime = (totalSeconds) => {
    const getSeconds = `0${totalSeconds % 60}`.slice(-2);
    const minutes = Math.floor(totalSeconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);

    if (getHours === '00') return `${getMinutes}:${getSeconds}`;
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const getTrees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/trails/${item.id}/trees`);

      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}.`);
      }

      const result = await response.json();

      let treeList = [];
      if (Array.isArray(result)) {
        treeList = result;
      } else if (typeof result === 'object' && result !== null) {
        const values = Object.values(result);
        if (values.length > 0 && values[0]?.name) {
          treeList = values;
        } else if (Array.isArray(result.rows)) {
          treeList = result.rows;
        } else if (Array.isArray(result.data)) {
          treeList = result.data;
        }
      }

      setTrees(treeList);
    } catch (error) {
      console.error('Erro ao buscar arvores na tela final:', error);
      Alert.alert('Erro', 'Nao foi possivel carregar a lista de arvores visitadas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrees();
  }, []);

  const handleShare = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Indisponivel', 'O compartilhamento nao esta disponivel neste dispositivo.');
        return;
      }

      const uri = await captureRef(viewRef, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Compartilhar conquista',
        UTI: 'public.jpeg',
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Nao foi possivel gerar a imagem para compartilhamento.');
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={localStyles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={localStyles.loadingText}>Gerando resumo da atividade...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View ref={viewRef} collapsable={false} style={localStyles.root}>
      <SafeAreaView style={localStyles.safeArea}>
        <View style={localStyles.heroSection}>
          <Image style={localStyles.heroImage} source={{ uri: normalizeUrl(item.thumb_img) }} />
          <View style={localStyles.heroOverlay} />
          <View style={localStyles.heroTextWrap}>
            <Text style={localStyles.heroTitle}>Parabens!</Text>
            <Text style={localStyles.heroSubtitle}>Voce concluiu a trilha {item.name}</Text>
          </View>
        </View>

        <View style={localStyles.contentCard}>
          <View style={localStyles.summaryHeader}>
            <Text style={localStyles.summaryTitle}>Resumo da jornada</Text>
            <Text style={localStyles.summarySub}>Todos os checkpoints foram finalizados.</Text>
          </View>

          <View style={localStyles.statsRow}>
            <View style={localStyles.statBlock}>
              <Text style={localStyles.statLabel}>DISTANCIA</Text>
              <Text style={[localStyles.statValue, fontsLoaded && localStyles.statValueFont]}>{distancia}</Text>
              <Text style={localStyles.statUnit}>KM</Text>
            </View>

            <View style={localStyles.verticalDivider} />

            <View style={localStyles.statBlock}>
              <Text style={localStyles.statLabel}>TEMPO</Text>
              <Text style={[localStyles.statValue, fontsLoaded && localStyles.statValueFont]}>{formatTime(time)}</Text>
              <Text style={localStyles.statUnit}>TOTAL</Text>
            </View>
          </View>

          <View style={localStyles.checkpointsHeader}>
            <FontAwesome5 name="tree" size={15} color={colors.green} />
            <Text style={localStyles.checkpointsTitle}>Arvores visitadas: {trees.length}</Text>
          </View>

          <ScrollView contentContainerStyle={localStyles.listContainer} showsVerticalScrollIndicator={false}>
            {trees.length > 0 ? (
              trees.map((tree, index) => (
                <View key={tree.id || index} style={localStyles.treeItemContainer}>
                  <View style={localStyles.treeIconContainer}>
                    <FontAwesome5 name="check" size={12} color={colors.white} />
                  </View>
                  <Text style={localStyles.treeName} numberOfLines={2}>
                    {index + 1}. {tree.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={localStyles.emptyText}>A lista de arvores nao esta disponivel no momento.</Text>
            )}
          </ScrollView>

          <View style={localStyles.actionsRow}>
            <DefaultButton
              text="VOLTAR AO INICIO"
              onPress={() => navigation.popToTop()}
              style={localStyles.actionButton}
              accessibilityLabel="Voltar para a tela inicial"
            />
            <DefaultButton
              text="COMPARTILHAR RESULTADO"
              onPress={handleShare}
              style={[localStyles.actionButton, localStyles.secondaryAction]}
              accessibilityLabel="Compartilhar resultado da trilha"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 15,
  },
  heroSection: {
    flex: 2,
    backgroundColor: colors.green,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  heroTextWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  heroSubtitle: {
    marginTop: 3,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  contentCard: {
    flex: 5,
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.white,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    color: colors.black,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  summarySub: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e7e4',
    borderRadius: 12,
    backgroundColor: '#f9fbfa',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
  statValue: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 2,
  },
  statValueFont: {
    fontFamily: 'BebasNeue',
    fontSize: 52,
    fontWeight: '400',
    lineHeight: 56,
  },
  statUnit: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    marginTop: -1,
  },
  verticalDivider: {
    width: 1,
    height: 56,
    backgroundColor: colors.border,
  },
  checkpointsHeader: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  checkpointsTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 10,
  },
  treeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 11,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#e3e9e6',
  },
  treeIconContainer: {
    backgroundColor: colors.green,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  treeName: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
  },
  actionsRow: {
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    width: '100%',
  },
  secondaryAction: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
});
