import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { styles } from '../styles/styles';
import DefaultButton from '../components/DefaultButton';

function TrilhaCard ({ item, navigation }) {
    return (
      <View style={styles.item}>
        <DefaultButton
          text={item.title}
          onPress={() => navigation.navigate('Iniciar', { item })}
        />
      </View>
    );
  };

export default function TrilhasScreen ({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
  
    const getMovies = async () => {
      try {
        const response = await fetch('https://reactnative.dev/movies.json');
        const json = await response.json();
        setData(json.movies);
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
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? (
          <ActivityIndicator />
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