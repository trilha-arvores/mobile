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

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Início', headerShown: false }}
        />
        <Stack.Screen
          name="Trilhas"
          component={TrilhasScreen}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Iniciar"
          component={IniciarScreen}
          options={({ route }) => ({ 
            title: route.params.item.name,
            headerTitleAlign: 'center'
          })
          }
        />
        <Stack.Screen
          name="Atividade"
          component={AtividadeScreen}
          options={({ route }) => ({ 
            title: route.params.item.name,
            headerTitleAlign: 'center'
          })
          }
        />
        <Stack.Screen
          name="Final"
          component={FinalScreen}
          options={({ route }) => ({ 
            title: route.params.item.name,
            headerTitleAlign: 'center'
          })
          }
        />
        <Stack.Screen
          name="Escanear"
          component={ScanScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
