import React, { useState } from 'react';
import {
  View, AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { styles } from '../styles/styles';
import { colors } from '../styles/Colors';
import { useCodeScanner, Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ChangeColorButton from '../components/ChangeColorButton';
import { check } from 'react-native-permissions';

const ERROR = -1;
const WAITING = 0;
const SUCCESS = 1;

export default function ScanScreen({ route, navigation }) {
  const device = useCameraDevice('back');
  const [scanState, setScanState] = useState(WAITING);
  const [text, setText] = useState('Escaneie o código');
  const [color, setColor] = useState('yellow');
  const [isLoading, setLoading] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const TRAIL_API_BASE_URL = 'http://192.168.0.12:5000';
  const tree = route.params.tree;
  const trail_id = route.params.trail_id;
  const position = route.params.position;


  const checkQRCode = async (qrcode) => {
    try {
      setLoading(true);
      console.log(qrcode);
      const response = await fetch(TRAIL_API_BASE_URL + '/trails/' + trail_id + '/validate-qr', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qr_data: qrcode,
          player_pos: position,
        }),
      });
      console.log(response.status);
      return response.status;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (scanState == WAITING) {
        const firstCode = codes[0];
        console.log(`Scanned ${firstCode.value} codes!`)
        checkQRCode(firstCode.value).then(
          (response) => {
            console.log('sucesso!' + response);
            if (response === 200) {
              setScanState(SUCCESS);
              navigation.navigate({
                name: 'Atividade',
                params: { sucess: true },
                merge: true
              })
            } else {
              setScanState(ERROR);
            }
          }
        )
        setTimeout(() => {
          setScanState(WAITING)
        }, 3000);
      }
    }
  })

  React.useEffect(() => {
    if (device) {
      Camera.requestCameraPermission()
        .then(result => {
          console.log('requestCameraPermission: ', result);
        })
        .catch(err => {
          console.log('requestCameraPermission Err: ', err);
        });
    }
  }, [device]);

  React.useEffect(() => {
    console.log({ scanState });
    switch (scanState) {
      case WAITING:
        setColor(colors.yellow);
        setText('Escaneie o QR Code');
        break;
      case ERROR:
        setColor(colors.red);
        setText('Erro!');
        break;
      case SUCCESS:
        setColor(colors.green);
        setText('Código escaneado com sucesso!');
        break;
    }
  }, [scanState])



  return (
    <>
      <View style={[styles.item, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ChangeColorButton
          text={text}
          color={color}
        />
      </View>
      <View style={{ flex: 9 }}>
        {isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <Camera style={StyleSheet.absoluteFill} device={device} codeScanner={codeScanner} isActive={true} />
        )}
      </View>
    </>
  )
}

AppRegistry.registerComponent('X', () => ScanScreen);