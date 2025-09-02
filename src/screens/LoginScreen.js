import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
      />
      <Button
        title="Entrar"
        color = '#517300'
        onPress={() => { 
          navigation.navigate('Perfil')
          /* TODO: implementar login, primeiro só ir
          para a area de user, depois implementar conversar
          com o back-end */
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10
  }
});