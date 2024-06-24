import React from 'react';
import { Text, View, Image, ScrollView, PermissionsAndroid } from 'react-native';
import { styles } from '../styles/styles';
import DefaultButton from '../components/DefaultButton';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import RoundButton from '../components/RoundButton';


export default function IniciarScreen({ route, navigation }) {
  const item = route.params.item;
  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'red' }}>
      <View style={{ flex: 3.5, backgroundColor: 'yellow' }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <Image style={{ height: '100%', width: 'undefined', aspectRatio: 1, resizeMode: 'cover' }}
            // style={styles.roundImage}
            source={{uri: item.thumb_img.replace('localhost', '172.26.196.22')}}
          />
        </ScrollView>
      </View>
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white' }}>
        <View style={styles.subCard}>
          <Text style={{ fontStyle: 'italic', fontSize: 12, textAlign: 'center' }}>
            A Trilha do {item.name} é agradável para fazer com a familia?
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={styles.cardSubtitle}>
              <FontAwesome5 name="tree" color="#517300" /> {item.n_trees} Árvores
            </Text>
            <Text style={styles.cardSubtitle}>
              <FontAwesome5 name="running" color="#517300" /> {item.distance} Km
            </Text>
          </View>
        </View>
        <View style={{marginBottom: 15}}>
          <RoundButton
            text='INICIAR'
            onPress={() => navigation.navigate('Atividade', { item })}
          />
        </View>
      </View>
    </View>
  )
}