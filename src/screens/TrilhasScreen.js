import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Pressable, Image, Platform, Alert } from 'react-native';
import { styles } from '../styles/styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { API_BASE, normalizeUrl } from '../config/api';
import { useSuspendedTrail } from '../context/SuspendedTrailContext';

// Modifiquei para receber 'onPress' em vez de navigation direto
function TrilhaCard({ item, onPress }) {
  return (
    <View>
      <Pressable
        style={styles.card}
        onPress={() => onPress(item)}
      >
        <View style={styles.cardHeader}>
          <Image
            style={styles.roundImage}
            source={{ uri: normalizeUrl(item.thumb_img) }}
          />
          <View style={styles.subCard}>
            <Text style={styles.cardTitle}>
              {item.name}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
              <Text style={styles.cardSubtitle}>
                <FontAwesome5 name="tree" color="#517300" /> {item.n_trees} Árvores
              </Text>
              <Text style={styles.cardSubtitle}>
                <FontAwesome5 name="running" color="#517300" /> {item.distance} Km
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default function TrilhasScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  // [NOVO] Acessa o contexto
  const { suspended, clearSuspendedTrail } = useSuspendedTrail();

  const TRAIL_API_BASE_URL = API_BASE;
  
  const getMovies = async () => {
    try {
      const response = await fetch(`${API_BASE}/trails/`);
      
      if (!response.ok) {
        throw new Error(`Erro do Servidor: Status ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (error) {
      Alert.alert(
        "Erro de Conexão",
        `Não foi possível carregar as trilhas.\n\nDetalhes do erro: ${error.message}`
      );
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleTrailPress = (item) => {

    if (suspended && String(suspended.trailId) === String(item.id)) {
      Alert.alert(
        "Trilha em Andamento",
        "Você tem uma trilha pausada. O que deseja fazer?",
        [
          {
            text: "Iniciar do Zero",
            onPress: () => {
              clearSuspendedTrail(); // Limpa a memória
              navigation.navigate('Iniciar', { item }); // Vai para tela de início padrão
            },
            style: "destructive"
          },
          {
            text: "Retomar Trilha",
            onPress: () => {
              navigation.navigate('Atividade', { item, suspended: suspended });
            }
          }
        ]
      );
    } else {
      navigation.navigate('Iniciar', { item });
    }
  };

  return (
    <View style={styles.cardContainer}>
      {isLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => String(id)}
          renderItem={({ item }) => (
            <TrilhaCard 
              item={item} 
              onPress={handleTrailPress} 
            />
          )}
        />
      )}
    </View>
  );
};