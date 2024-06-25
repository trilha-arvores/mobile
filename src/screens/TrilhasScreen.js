import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Pressable, Image } from 'react-native';
import { styles } from '../styles/styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DefaultButton from '../components/DefaultButton';

function TrilhaCard({ item, navigation }) {
  return (
    <View>
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('Iniciar', { item })}
      >
        <View style={styles.cardHeader}>
          <Image
            style={styles.roundImage}
            source={{uri: item.thumb_img.replace('localhost', '192.168.0.12')}}
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
  const TRAIL_API_BASE_URL = __DEV__ ? 'http://192.168.0.12:5000' : 'google.com';


  const getMovies = async () => {
    try {
      console.log(TRAIL_API_BASE_URL);
      const response = await fetch(TRAIL_API_BASE_URL + '/trails/');
      console.log(response);
      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={styles.cardContainer}>
      {isLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => TrilhaCard({ item, navigation })}
        />
      )}
    </View>
  );
};