import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { colors } from '../styles/Colors';

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Sobre o Projeto</Text>
        <Text style={styles.memberTitle}>USP Sustentavel</Text>

        <Image source={require('../assets/USP-sustentavel.png')} style={styles.uspLogo} resizeMode="contain" />

        <Text style={styles.description}>
          Este projeto, fruto de uma parceria entre representantes da USP Sao Carlos e a ESALQ, visa integrar a
          comunidade com o campus de Piracicaba. Nosso objetivo e valorizar a mata rica e singular do local,
          transformando-a em um recurso para promover a saude e o bem-estar.
        </Text>

        <Text style={styles.description}>
          A iniciativa e um convite para que todos possam conhecer as maravilhas naturais do campus e aproveitar a
          corrida guiada com checkpoints em QR Code.
        </Text>

        <Text style={styles.memberTitle}>Integrantes</Text>
        <View style={styles.peopleList}>
          <Text style={styles.member}>Simone do Rocio Senger de Souza: Professora Orientadora, ICMC-USP</Text>
          <Text style={styles.member}>Luciana Duque Silva: Professora Orientadora, ESALQ-USP</Text>
          <Text style={styles.member}>Jefferson Lordello Polizel: Co-orientador, ESALQ-USP</Text>
          <Text style={styles.member}>Joao Victor de Almeida: Membro Desenvolvedor, EESC/ICMC-USP</Text>
          <Text style={styles.member}>Vitor Amorim Frois: Membro Desenvolvedor, ICMC-USP</Text>
          <Text style={styles.member}>Yvis Freire Silva Santos: Membro Desenvolvedor, ICMC-USP</Text>
          <Text style={styles.member}>Davi Fagundes Ferreira: Membro Desenvolvedor, ICMC-USP</Text>
          <Text style={styles.member}>Pedro Rossi: Membro Desenvolvedor, ICMC-USP</Text>
          <Text style={styles.member}>Miller Matheus Lima: Membro Desenvolvedor, ICMC-USP</Text>
        </View>

        <Text style={styles.footer}>Agradecemos a todos que contribuiram para a realizacao deste projeto.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    backgroundColor: colors.white,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
    color: colors.black,
    textAlign: 'justify',
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    color: colors.black,
  },
  peopleList: {
    borderWidth: 1,
    borderColor: '#e3e9e6',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f9fbfa',
    gap: 6,
  },
  member: {
    fontSize: 13,
    color: colors.black,
    lineHeight: 19,
  },
  footer: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  uspLogo: {
    width: 260,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
});
