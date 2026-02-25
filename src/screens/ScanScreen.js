import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { useCodeScanner, Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ChangeColorButton from '../components/ChangeColorButton';
import DefaultButton from '../components/DefaultButton';
import { colors } from '../styles/Colors';

const ERROR = -1;
const WAITING = 0;
const SUCCESS = 1;

export default function ScanScreen({ route, navigation }) {
  const device = useCameraDevice('back');
  const [scanState, setScanState] = useState(WAITING);
  const { hasPermission, requestPermission } = useCameraPermission();

  const tree = route.params?.tree || {};

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const extractIdFromQR = (qrValue) => {
    if (!qrValue) return '';
    const stringValue = String(qrValue).trim();

    if (stringValue.toLowerCase().includes('esalq_id')) {
      const parts = stringValue.split('=');
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }

    return stringValue;
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (scanState !== WAITING) return;
      if (!codes.length) return;

      const rawValue = codes[0].value;
      const scannedId = extractIdFromQR(rawValue);

      const targetEsalqId = String(tree.esalq_id).trim();
      const targetId = String(tree.id).trim();

      if (scannedId === targetEsalqId || scannedId === targetId) {
        setScanState(SUCCESS);

        setTimeout(() => {
          navigation.navigate({
            name: 'Atividade',
            params: { sucess: true },
            merge: true,
          });
        }, 1300);
      } else {
        setScanState(ERROR);

        setTimeout(() => {
          setScanState(WAITING);
        }, 1800);
      }
    },
  });

  const status = useMemo(() => {
    if (scanState === SUCCESS) {
      return {
        color: colors.green,
        text: 'Checkpoint confirmado. Voltando para a trilha...',
      };
    }

    if (scanState === ERROR) {
      return {
        color: colors.red,
        text: 'QR Code incorreto. Confira o nome da arvore e tente novamente.',
      };
    }

    return {
      color: colors.yellow,
      text: `Escaneie o QR Code da arvore: ${tree.name || 'checkpoint atual'}`,
    };
  }, [scanState, tree.name]);

  if (!hasPermission) {
    return (
      <SafeAreaView style={localStyles.permissionScreen}>
        <Text style={localStyles.permissionTitle}>Permissao de camera necessaria</Text>
        <Text style={localStyles.permissionText}>
          Para validar checkpoints por QR Code, permita o uso da camera no dispositivo.
        </Text>
        <DefaultButton
          text="PERMITIR CAMERA"
          onPress={requestPermission}
          style={localStyles.permissionButton}
          accessibilityLabel="Solicitar permissao da camera"
        />
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={localStyles.permissionScreen}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={localStyles.permissionText}>Carregando camera...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={localStyles.screen}>
      <View style={localStyles.topBanner}>
        <ChangeColorButton text={status.text} color={status.color} />
      </View>

      <View style={localStyles.cameraWrapper}>
        <Camera style={StyleSheet.absoluteFill} device={device} isActive codeScanner={codeScanner} />

        <View style={localStyles.overlay} pointerEvents="none">
          <View style={localStyles.frame}>
            <View style={localStyles.cornerTopLeft} />
            <View style={localStyles.cornerTopRight} />
            <View style={localStyles.cornerBottomLeft} />
            <View style={localStyles.cornerBottomRight} />
          </View>
          <Text style={localStyles.overlayText}>Centralize o QR Code dentro da moldura.</Text>
        </View>
      </View>

      <View style={localStyles.footerHelp}>
        <Text style={localStyles.footerText}>Dica: use boa iluminacao para leitura mais rapida.</Text>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBanner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  frame: {
    width: 270,
    height: 270,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 36,
    height: 36,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.green,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 36,
    height: 36,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.green,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 36,
    height: 36,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.green,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 36,
    height: 36,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.green,
    borderBottomRightRadius: 16,
  },
  overlayText: {
    marginTop: 14,
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerHelp: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  footerText: {
    color: '#dedede',
    fontSize: 13,
    textAlign: 'center',
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  permissionTitle: {
    color: colors.black,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 6,
  },
  permissionButton: {
    marginTop: 20,
    width: '100%',
    maxWidth: 320,
  },
});
