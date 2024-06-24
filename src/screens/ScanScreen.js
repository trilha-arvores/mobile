import React, { useState } from 'react';
import {
  View, AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { styles } from '../styles/styles';
import { colors } from '../styles/Colors';
import { useCodeScanner, Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ChangeColorButton from '../components/ChangeColorButton';

const ERROR = -1;
const WAITING = 0;
const SUCCESS = 1;

export default function ScanScreen({ route, navigation }) {
  const device = useCameraDevice('back');
  const [scanState, setScanState] = useState(WAITING);
  const [text, setText] = useState('Escaneie o código');
  const [color, setColor] = useState('yellow');

  const { hasPermission, requestPermission } = useCameraPermission();

  const checkQRCode = (code) => {
    return true;
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (scanState == WAITING) {
        const firstCode = codes[0];
        console.log(`Scanned ${firstCode.value} codes!`)
        if (checkQRCode(firstCode)) {
          setScanState(SUCCESS);
          navigation.navigate({
            name: 'Atividade',
            params: { sucess: true },
            merge: true
          })
        } else {
          setScanState(ERROR);
          // console.log(`Scanned ${firstCode.value} codes!`)
        }
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
        <Camera style={StyleSheet.absoluteFill} device={device} codeScanner={codeScanner} isActive={true} />
      </View>
    </>
  )
}

AppRegistry.registerComponent('X', () => ScanScreen);