import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function SobreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o Projeto</Text>
     <Text style={styles.memberTitle}>USP Sustentável</Text>
     <Image
         source={require('../assets/USP-sustentavel.png')}
         style={styles.uspLogo}
         resizeMode="contain"
       />
      <Text style={styles.description}>
Este projeto, fruto de uma parceria entre representantes da USP São Carlos e a ESALQ,
visa integrar a comunidade com o campus de Piracicaba. 
Nosso objetivo é valorizar a mata rica e singular do local, transformando-a em um recurso para
promover a saúde e o bem-estar. A iniciativa é um convite para que todos 
possam conhecer as maravilhas naturais deste magnífico campus, como uma forma de retribuir à comunidade o valioso patrimônio que a natureza nos proporciona.
      </Text>
      
      <Text style={styles.memberTitle}>Integrantes:</Text>
      <Text style={styles.member}>Simone do Rocio Senger de Souza: Professora Orientadora, ICMC-USP</Text>
      <Text style={styles.member}>Luciana Duque Silva: Professora Orientadora, ESALQ-USP</Text>
      <Text style={styles.member}>Jefferson Lordello Polizel: Co-orientador, ESALQ-USP</Text>
      <Text style={styles.member}>João Victor de Almeida: Membro Desenvolvedor, EESC/ICMC - USP</Text>
      <Text style={styles.member}>Vitor Amorim Fróis: Membro Desenvolvedor, ICMC - USP</Text>
      <Text style={styles.member}>Yvis Freire Silva Santos: Membro Desenvolvedor, ICMC - USP</Text>
      <Text style={styles.member}>Davi Fagundes Ferreira: Membro Desenvolvedor, ICMC - USP</Text>
      <Text style={styles.member}>Pedro Rossi: Membro Desenvolvedor ICMC, - USP</Text>
      <Text style={styles.member}>Miller Matheus Lima: Membro Desenvolvedor, ICMC - USP</Text>


      <Text style={styles.footer}>
        Agradecemos a todos que contribuíram para a realização deste projeto!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  memberTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  member: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
   uspLogo: {
   width: 260,                 // ajuste se precisar
   height: 120,
   alignSelf: 'center',        // centraliza a imagem
   marginBottom: 16,
 },
});


