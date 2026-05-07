import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DefaultButton from '../components/DefaultButton';
import { useFonts } from 'expo-font';
import { normalizeUrl } from '../config/api';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '../styles/Colors';

export default function IniciarScreen({ route, navigation }) {
  const item = route.params.item;
  const insets = useSafeAreaInsets();

  useFonts({
    BebasNeue: require('../assets/fonts/BebasNeue.ttf'),
  });

  return (
    <SafeAreaView style={localStyles.screen} edges={['bottom']}>
      <View style={localStyles.imageHeader}>
        <Image style={localStyles.image} source={{ uri: normalizeUrl(item.thumb_img) }} />
      </View>

      <View style={[localStyles.contentCard, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <ScrollView contentContainerStyle={localStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={localStyles.title}>{item.name}</Text>

          <View style={localStyles.metricsRow}>
            <View style={localStyles.metricChip}>
              <FontAwesome5 name="route" size={16} color={colors.green} />
              <Text style={localStyles.metricText}>{item.distance} km</Text>
            </View>
            <View style={localStyles.metricChip}>
              <FontAwesome5 name="tree" size={16} color={colors.green} />
              <Text style={localStyles.metricText}>{item.n_trees} checkpoints</Text>
            </View>
          </View>

          <Text style={localStyles.sectionTitle}>Como funciona</Text>
          <View style={localStyles.infoBox}>
            <Text style={localStyles.infoLine}>1. Siga o mapa ate o checkpoint indicado.</Text>
            <Text style={localStyles.infoLine}>2. Escaneie o QR Code da arvore correta.</Text>
            <Text style={localStyles.infoLine}>3. Repita ate completar todos os checkpoints.</Text>
          </View>

          <Text style={localStyles.sectionTitle}>Antes de iniciar</Text>
          <View style={localStyles.checklistBox}>
            <ChecklistItem text="Ative localizacao (GPS)." />
            <ChecklistItem text="Permita acesso a camera para leitura de QR Code." />
            <ChecklistItem text="Garanta bateria suficiente para toda a trilha." />
          </View>
        </ScrollView>

        <View style={localStyles.actionArea}>
          <DefaultButton
            text="COMECAR TRILHA"
            onPress={() => {
              navigation.replace('Atividade', { item });
            }}
            accessibilityLabel="Comecar esta trilha"
            style={localStyles.startButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ChecklistItem({ text }) {
  return (
    <View style={localStyles.checkItem}>
      <FontAwesome5 name="check-circle" size={15} color={colors.green} />
      <Text style={localStyles.checkText}>{text}</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageHeader: {
    flex: 3.7,
    backgroundColor: colors.mutedSurface,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  contentCard: {
    flex: 5,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  metricsRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricChip: {
    minWidth: 138,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fafcfb',
  },
  metricText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: colors.black,
    fontSize: 16,
    fontWeight: '800',
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6ebe8',
    backgroundColor: '#f9fbfa',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
  },
  infoLine: {
    color: colors.black,
    fontSize: 14,
    lineHeight: 21,
  },
  checklistBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0dfb8',
    backgroundColor: '#fff9ec',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkText: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
  },
  actionArea: {
    paddingTop: 10,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    maxWidth: 340,
  },
});
