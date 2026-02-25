import React from 'react';
import {
  View,
  BackHandler,
  Image,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/styles';
import { colors } from '../styles/Colors';

export default function HomeScreen({ navigation }) {
  const handleExit = () => {
    Alert.alert('Sair do aplicativo?', 'Voce pode voltar quando quiser continuar a trilha.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => BackHandler.exitApp() },
    ]);
  };

  return (
    <SafeAreaView style={localStyles.screen}>
      <View style={localStyles.heroSection}>
        <ImageBackground
          style={localStyles.heroImage}
          source={require('../assets/flamboyant-laranja-esalq.jpg')}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.10)', 'rgba(0,0,0,0.15)', 'rgba(253,253,253,0.95)', colors.white]}
            style={localStyles.heroGradient}
          >
            <View style={localStyles.heroTextBlock}>
              <Text style={localStyles.heroEyebrow}>CORRIDA GUIADA</Text>
              <Text style={localStyles.heroText}>Mapa ao vivo e checkpoints em QR Code pelas arvores.</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={styles.homeContainer}>
        <Image style={localStyles.logo} source={require('../assets/icon.png')} />

        <Text style={[styles.title, localStyles.title]}>Trilha das Arvores</Text>
        <Text style={localStyles.description}>
          Escolha uma trilha e siga os checkpoints no mapa. O app salva seu progresso para retomar depois.
        </Text>

        <View style={localStyles.actions}>
          <DefaultButton
            text="LISTA DE TRILHAS"
            onPress={() => navigation.navigate('Trilhas')}
            accessibilityLabel="Abrir lista de trilhas"
            style={localStyles.actionButton}
          />
          <DefaultButton
            text="SOBRE O PROJETO"
            onPress={() => navigation.navigate('Sobre')}
            accessibilityLabel="Abrir informacoes do projeto"
            style={localStyles.actionButton}
          />
          <DefaultButton
            text="SAIR"
            onPress={handleExit}
            accessibilityLabel="Sair do aplicativo"
            style={[localStyles.actionButton, localStyles.exitButton]}
          />
        </View>

        <Text style={localStyles.footer}>(c) Trilha das Arvores e YouthMappers</Text>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heroSection: {
    height: '37%',
    minHeight: 240,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroTextBlock: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  heroEyebrow: {
    color: colors.green,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 4,
  },
  heroText: {
    color: colors.black,
    fontSize: 15,
    lineHeight: 21,
    maxWidth: 360,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    marginBottom: 6,
  },
  description: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
    marginBottom: 18,
  },
  actions: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    maxWidth: 320,
  },
  exitButton: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  footer: {
    marginTop: 18,
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
