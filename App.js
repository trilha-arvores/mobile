import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import FinalScreen from './src/screens/FinalScreen';
import AtividadeScreen from './src/screens/AtividadeScreen';
import IniciarScreen from './src/screens/IniciarScreen';
import ScanScreen from './src/screens/ScanScreen';
import TrilhasScreen from './src/screens/TrilhasScreen';
import UserScreen from './src/screens/UserScreen';
import SobreScreen from './src/screens/SobreScreen';
import { SuspendedTrailProvider } from './src/context/SuspendedTrailContext';
import { colors } from './src/styles/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SuspendedTrailProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerShadowVisible: false,
            headerTintColor: colors.green,
            headerTitleStyle: {
              color: colors.black,
              fontWeight: '700',
              fontSize: 17,
            },
            contentStyle: {
              backgroundColor: colors.white,
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Inicio', headerShown: false }}
          />
          <Stack.Screen name="Trilhas" component={TrilhasScreen} options={{ title: 'Trilhas Disponiveis' }} />
          <Stack.Screen
            name="Iniciar"
            component={IniciarScreen}
            options={({ route }) => ({
              title: route.params?.item?.name || 'Iniciar trilha',
            })}
          />
          <Stack.Screen
            name="Atividade"
            component={AtividadeScreen}
            options={({ route }) => ({
              title: route.params?.item?.name || 'Atividade',
            })}
          />
          <Stack.Screen
            name="Final"
            component={FinalScreen}
            options={({ route }) => ({
              title: route.params?.item?.name || 'Resultado',
            })}
          />
          <Stack.Screen
            name="Escanear"
            component={ScanScreen}
            options={({ route }) => ({
              title: route.params?.tree?.name || 'Escanear checkpoint',
            })}
          />
          <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre o Projeto' }} />
          <Stack.Screen name="Perfil" component={UserScreen} options={{ title: 'Perfil do Usuario' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SuspendedTrailProvider>
  );
}
