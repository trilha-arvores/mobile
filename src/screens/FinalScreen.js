import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import FilledRoundButton from '../components/FilledRoundButton';
import RoundButton from '../components/RoundButton';
import { styles } from '../styles/styles';
import { useFonts } from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { API_BASE, normalizeUrl } from '../config/api';

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing'; 

export default function FinalScreen({ route, navigation }) {
  const { tempo: time, distancia, item } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [trees, setTrees] = useState([]);

  // Referência para a view que será capturada (print)
  const viewRef = useRef();

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  const formatTime = (totalSeconds) => {
    const getSeconds = `0${totalSeconds % 60}`.slice(-2);
    const minutes = Math.floor(totalSeconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);

    if (getHours === '00') {
      return `${getMinutes}:${getSeconds}`;
    }
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const getTrees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/trails/${item.id}/trees`);
      const result = await response.json();

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
      setTrees(treeList);
    } catch (error) {
      console.error("Erro ao buscar árvores na tela final:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de árvores visitadas.");
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
        Alert.alert("Indisponível", "O compartilhamento não está disponível neste dispositivo.");
        return;
      }

      const uri = await captureRef(viewRef, {
        format: "jpg",
        quality: 0.9,
        result: "tmpfile", // Cria um arquivo temporário
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Compartilhar Conquista',
        UTI: 'public.jpeg'
      });

    } catch (error) {
      console.log('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível gerar a imagem para compartilhamento.');
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#517300" />
        <Text style={{ marginTop: 10 }}>Gerando relatório...</Text>
      </View>
    );
  }

  return (
    // viewRef captura TUDO o que está dentro desta View
    <View ref={viewRef} collapsable={false} style={{ flex: 1, backgroundColor: 'white' }}>
      
      {/* --- Imagem do Topo (Flex 2) --- */}
      <View style={{ flex: 2, backgroundColor: 'teal' }}>
        <Image
          style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
          source={{ uri: normalizeUrl(item.thumb_img) }}
        />
        <View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.3)'
        }} />
        <View style={{ position: 'absolute', bottom: 40, left: 20 }}>
          <Text style={[styles.title, { color: 'white', fontSize: 32, marginBottom: 5 }]}>
            PARABÉNS!
          </Text>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            Você concluiu a trilha {item.name}
          </Text>
        </View>
      </View>

      {/* --- Corpo Principal (Lista de Árvores) (Flex 5) --- */}
      <View style={{
        flex: 5,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: 25,
        paddingHorizontal: 20,
      }}>
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          <Text style={{ fontSize: 18, color: '#313131', fontWeight: 'bold' }}>
            RESUMO DA JORNADA
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <FontAwesome5 name="tree" size={16} color="#517300" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: '#666' }}>
              {trees.length} árvores visitadas
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#313131' }}>
          Árvores Encontradas:
        </Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {trees.map((tree, index) => (
            <View key={tree.id || index} style={localStyles.treeItemContainer}>
              <View style={localStyles.treeIconContainer}>
                <FontAwesome5 name="check" size={14} color="white" />
              </View>
              <Text style={localStyles.treeName}>
                {index + 1}. {tree.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* --- Rodapé com Estatísticas e Botões (Flex 2.5) --- */}
      <View style={localStyles.bottomContainer}>
        
        {/* Bloco de Estatísticas */}
        <View style={localStyles.statsRow}>
          
          <View style={localStyles.statBlock}>
            <Text style={localStyles.statLabel}>DISTÂNCIA</Text>
            <Text style={localStyles.statValueBebas}>{distancia}</Text>
            <Text style={localStyles.statUnit}>KM</Text>
          </View>

          <View style={localStyles.verticalDivider} />

          <View style={localStyles.statBlock}>
            <Text style={localStyles.statLabel}>TEMPO TOTAL</Text>
            <Text style={localStyles.statValueBebas}>{formatTime(time)}</Text>
            <Text style={localStyles.statUnit}> </Text>
          </View>

        </View>

        {/* Bloco de Botões */}
        <View style={localStyles.buttonsRow}>
          <FilledRoundButton
            text='INÍCIO'
            onPress={() => navigation.popToTop()}
          />
          <RoundButton
            style={styles.button}
            text='COMPARTILHAR'
            textStyle={{fontSize: 10}}
            onPress={handleShare}
          />
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  treeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  treeIconContainer: {
    backgroundColor: '#517300',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  treeName: {
    fontSize: 16,
    color: '#313131',
  },
  bottomContainer: {
    flex: 2.5,
    backgroundColor: '#fdfdfd',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  statBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  statLabel: {
    color: '#666',
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  statValueBebas: {
    fontFamily: 'BebasNeue',
    fontSize: 52,
    color: '#313131',
    lineHeight: 55,
    includeFontPadding: false,
  },
  statUnit: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -5,
  },
  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#e0e0e0',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
});