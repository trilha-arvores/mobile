import React from 'react';
import { Text, View, ImageBackground, Image, ScrollView } from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { LinearGradient } from "expo-linear-gradient"
import { styles } from '../styles/styles';
import RoundButton from '../components/RoundButton';
import FilledRoundButton from '../components/FilledRoundButton';
import DistanceComponent from '../components/DistanceComponent';
import StaticTimeComponent from '../components/StaticTimeComponent';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFonts } from 'expo-font';



export default function FinalScreen({ route, navigation }) {
  const item = route.params.item;
  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue.ttf'),
  });
  return (
    <>
      <View style={{ flex: 5, backgroundColor: 'yellow' }}>
        <Image style={{ height: '100%', width: 'undefined', resizeMode: 'cover' }}
          // style={styles.roundImage}
          source={{uri: item.thumb_img.replace('localhost', '192.168.0.12')}}
        />
      </View>

      <View style={
        {
          flex: 2, flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center', backgroundColor: 'white',
        }}>
        <View>
          <View style={{
            flex: 2,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: '#fdfdfd',
            borderWidth: 1,
            borderColor: '#313131',
          }}>
            <View style={{
              flex: 3,
              width: '100%',
              justifyContent: 'center',
              borderBottomWidth: 1,
            }}>
              <View style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                // justifyContent: 'center'
              }}>
                <DistanceComponent distance={item.distance.toFixed(2)} />
                <View style={{ borderWidth: 0.5, height: '100%', backgroundColor: '#313131' }} />
                <StaticTimeComponent time={route.params.tempo}/>
              </View>
            </View>
            <View style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text style={{fontWeight: 'bold'}}>
                PARABÉNS! TRILHA COMPLETA
              </Text>
            </View>
            <View style={{
              flex: 3,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingVertical: 10,
              paddingHorizontal: 100,
              borderTopWidth: 1,
              borderColor: '#313131',
            }}>
              <FilledRoundButton
                text={<FontAwesome5 name="share-square" color="#517300"/>}
                options={{fontSize: 50}} //compartilhar
              />
              <RoundButton
                style={styles.button}
                text={<FontAwesome5 name="home" color="white" />} //inicio
                onPress={() => {
                  navigation.navigate('Home');
                }
                }>
              </RoundButton>
            </View>
          </View>
        </View>
      </View >


    </>


  )
}