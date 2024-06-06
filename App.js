import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen'
import FinalScreen from './src/screens/FinalScreen'
import AtividadeScreen from './src/screens/AtividadeScreen'
import IniciarScreen from './src/screens/IniciarScreen'
import ScanScreen from './src/screens/ScanScreen'
import TrilhasScreen from './src/screens/TrilhasScreen'

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
