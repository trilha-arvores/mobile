import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, Component } from 'react';
import { StyleSheet, Text, View, Button, Pressable, BackHandler, ScrollView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Timer } from 'react-native-stopwatch-timer';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';
import * as Progress from 'react-native-progress';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Início' }}
        />
        <Stack.Screen
          name="Trilhas"
          component={TrilhasScreen}
        />
        <Stack.Screen
          name="Iniciar"
          component={IniciarScreen}
        />
        <Stack.Screen
          name="Atividade"
          component={AtividadeScreen}
        />
        <Stack.Screen
          name="Final"
          component={FinalScreen}
        />
        <Stack.Screen
          name="Escanear"
          component={ScanScreen}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <>
      <View style={styles.item}>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Trilhas')
          }
        >
          <Text style={styles.text}>Lista de Trilhas</Text>
        </Pressable>
      </View>
      <View style={styles.item}>

        <Pressable
          style={styles.button}
          title="Sair"
          onPress={() =>
            BackHandler.exitApp()
          }
        >
          <Text style={styles.text}>Sair</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 3,
    marginVertical: 0,
    marginHorizontal: 0
  },
  text: {
    color: 'white',
    fontSize: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 10,
    elevation: 0,
    height: 80,
    backgroundColor: '#2f4538',
  },
});

const TrilhasScreen = ({ navigation }) => {
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

  const TrilhaCard = item => {
    return (
      <View style={styles.item}>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Iniciar', { item })
          }
        >
          <Text style={styles.text}>{item.title}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => TrilhaCard(item)}
        />
      )}
    </View>
  );
};

const IniciarScreen = ({ route, navigation }) => {
  const item = route.params.item;
  return (
    <View>
      <Text style={styles.item}>
        {item.title}, {item.releaseYear}
      </Text>
      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.navigate('Atividade', { item })
        }
      >
        <Text style={styles.text}>Iniciar</Text>
      </Pressable>
    </View>
  )
}

const AtividadeScreen = ({ route, navigation }) => {
  // let timer = TestApp();
  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [arvore, setArvore] = useState(0);
  const nArvores = 3;

  return (
    <View>
      <Text>
        corrida
      </Text>
      <StopWatch start={start} />
      {!finish ?
        <Pressable
          style={styles.button}
          onPress={() =>
            setStart(!start)
          }>
          <Text style={styles.text}>
            {start ? 'Pausar' : 'Retomar'}
          </Text>
        </Pressable> :
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Final', {'tempo': '20m30s', 'distancia': '2km'})
          }>
          <Text style={styles.text}>
            Finalizar
          </Text>
        </Pressable>}
      {!finish ?
        <Pressable
          style={styles.button}
          onPress={() => {
            navigation.push('Escanear');
            setArvore(arvore + 1);
            if (arvore >= nArvores) {
              setStart(false);
              setFinish(true);
            }
          }
          }>
          <Text style={styles.text}>
            Camera
          </Text>
        </Pressable> :
        <View></View>}
      <Progress.Bar progress={arvore / nArvores} width={200} />
    </View>
  )
}

const FinalScreen = ({ route, navigation }) => {
  return (
    <View>
      <Text>
        Parabains! Voce terminou a corrida de {route.params.distancia} em {route.params.tempo}
      </Text>
    </View>
  )
}

const ScanScreen = ({ route, navigation }) => {
  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.pop()
        }
      >
        <Text style={styles.text}>
          Clique para escanear
        </Text>
      </Pressable>
    </View>
  )
}

