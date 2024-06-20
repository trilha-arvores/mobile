import React from 'react';
import {
  View, AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import DefaultButton from '../components/DefaultButton';
import { useCodeScanner, Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';


export default function ScanScreen({ route, navigation }) {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const checkQRCode = (code) => {
    return true;
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      const firstCode = codes[0];
      const check = checkQRCode(firstCode);
      console.log(`Scanned ${firstCode.value} codes!`)
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



  return (
    <Camera style={StyleSheet.absoluteFill} device={device} codeScanner={codeScanner} isActive={true} />
  )
}

AppRegistry.registerComponent('X', () => ScanScreen);