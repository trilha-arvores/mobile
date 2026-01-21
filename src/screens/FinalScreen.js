import React, { useRef } from 'react';
import { Text, View, Image } from 'react-native';
import ViewShot from "react-native-view-shot"; 
import * as Sharing from 'expo-sharing'; 
import FilledRoundButton from '../components/FilledRoundButton';
import RoundButton from '../components/RoundButton';
import DistanceComponent from '../components/DistanceComponent';
import StaticTimeComponent from '../components/StaticTimeComponent';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFonts } from 'expo-font';
import { styles } from '../styles/styles';

export default function FinalScreen({ route, navigation }) {
  const item = route.params.item;
  const viewShotRef = useRef(); 

  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });

  const handleShare =   async () => {
    try {
      const uri = await viewShotRef.current.capture();
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Compartilhar Conquista',
          UTI: 'public.jpeg'
        });
      } else {
        alert("Compartilhamento não disponível neste dispositivo.");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <ViewShot 
      ref={viewShotRef} 
      style={{ flex: 1, backgroundColor: 'white' }} 
      options={{ format: "jpg", quality: 0.9 }}
    >
      <View style={{ flex: 5, backgroundColor: 'whitesmoke' }}>
        <Image 
          style={{ height: '100%', width: 'undefined', resizeMode: 'cover' }}
          source={{uri: item.thumb_img.replace('localhost', '192.168.0.12')}}
        />
      </View>

      <View style={{
          flex: 2, flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center', backgroundColor: 'white',
        }}>
        <View style={{width: '100%'}}> 
          <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 1,
            paddingVertical: 10,
            borderColor: '#ddd'
          }}>
            <View style={{
              height: 50, 
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <DistanceComponent distance={Number(route.params.distancia || item.distance).toFixed(2)} />
              <View style={{ borderWidth: 0.5, height: '80%', backgroundColor: '#313131', marginHorizontal: 15 }} />
              <StaticTimeComponent time={route.params.tempo}/>
            </View>
          </View>

          <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 10
          }}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              PARABÉNS! TRILHA COMPLETA
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            paddingVertical: 20,
            paddingHorizontal: 60, 
            borderTopWidth: 1,
            borderColor: '#313131',
          }}>
            <FilledRoundButton
              text={<FontAwesome5 name="share-square" color="#517300" size={30}/>}
              options={{fontSize: 50}}
              onPress={handleShare}
            />
            <RoundButton
              style={styles.button}
              text={<FontAwesome5 name="home" color="white" size={30}/>}
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
          </View>
        </View>
      </View>
    </ViewShot>
  )
}