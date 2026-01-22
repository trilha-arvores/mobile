import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { styles } from '../styles/styles';
import { useFonts } from 'expo-font';
import { normalizeUrl } from '../config/api';

// Ícones
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function IniciarScreen({ route, navigation }) {
  const item = route.params.item;

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Imagem do Topo */}
      <View style={{ flex: 4, backgroundColor: 'whitesmoke' }}>
        <Image
          style={{ height: '100%', width: 'undefined', resizeMode: 'cover' }}
          source={{ uri: normalizeUrl(item.thumb_img) }}
        />
      </View>

      {/* Card de Informações */}
      <View style={{
        flex: 5,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30, // Efeito de sobreposição na imagem
        padding: 20,
        justifyContent: 'space-between'
      }}>
        
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Título e Subtítulo */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={[styles.title, { textAlign: 'center', fontSize: 28 }]}>
              {item.name}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 }}>
                  <FontAwesome5 name="route" size={20} color="#517300" style={{ marginRight: 8 }} />
                  <Text style={{ fontFamily: 'BebasNeue', fontSize: 20, color: '#313131' }}>
                    {item.distance} KM
                  </Text>
               </View>
               <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 }}>
                  <FontAwesome5 name="tree" size={20} color="#517300" style={{ marginRight: 8 }} />
                  <Text style={{ fontFamily: 'BebasNeue', fontSize: 20, color: '#313131' }}>
                    {item.n_trees} ÁRVORES
                  </Text>
               </View>
            </View>
          </View>

          {/* Descrição / Texto de Apoio */}
          <Text style={{ 
            fontSize: 16, 
            color: '#666', 
            textAlign: 'justify', 
            lineHeight: 24,
            marginBottom: 20
          }}>
            Esta trilha levará você por um passeio educativo pelas árvores mais icônicas do campus. 
            Prepare-se para caminhar, observar e aprender. Certifique-se de estar com o GPS ativado e bateria carregada.
          </Text>

          {/* Dificuldade (Opcional, visual) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', color: '#313131', marginRight: 10 }}>DIFICULDADE:</Text>
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3].map((star) => (
                <FontAwesome5 key={star} name="star" solid size={14} color="#FFD700" style={{ marginRight: 2 }} />
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Botão de Ação */}
        <View style={{ paddingTop: 10 }}>
          <DefaultButton
            text="COMEÇAR TRILHA"
            onPress={() => {
              // [CORREÇÃO] Usamos replace para remover esta tela da pilha
              // Assim, ao voltar da Atividade, o usuário cai direto na lista de Trilhas
              navigation.replace('Atividade', { item });
            }}
          />
        </View>
      </View>
    </View>
  );
}