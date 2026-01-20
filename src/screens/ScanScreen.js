import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
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
  
  // Árvore alvo vinda da navegação
  const tree = route.params?.tree || {};
  
  // Solicita permissão ao carregar
  useEffect(() => {
    requestPermission();
  }, []);


  const extractIdFromQR = (qrValue) => {
    if (!qrValue) return '';
    const stringValue = String(qrValue).trim();
    
    // Verifica se tem o padrão "esalq_id =" (maiúsculo ou minúsculo)
    if (stringValue.toLowerCase().includes('esalq_id')) {
      const parts = stringValue.split('=');
      // Pega a parte depois do igual e remove espaços
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }
    // Se não tiver o texto, retorna o valor original (caso mude o padrão no futuro)
    return stringValue;
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      // Se já processou (Sucesso ou Erro), ignora novos scans
      if (scanState !== WAITING) return;

      if (codes.length > 0) {
        const rawValue = codes[0].value;
        const scannedId = extractIdFromQR(rawValue);
        
        // IDs para comparação (garantindo que sejam strings limpas)
        const targetEsalqId = String(tree.esalq_id).trim();
        const targetId = String(tree.id).trim();

        console.log(`Lido: ${rawValue} | Extraído: ${scannedId} | Alvo: ${targetEsalqId}`);

        // Compara o ID extraído com o ID da árvore alvo
        if (scannedId === targetEsalqId || scannedId === targetId) {
          setScanState(SUCCESS);
          
          setTimeout(() => {
            // Volta para AtividadeScreen sinalizando sucesso
            navigation.navigate({
              name: 'Atividade',
              params: { sucess: true },
              merge: true,
            });
          }, 1500); // Tempo para ver a mensagem de sucesso

        } else {
          setScanState(ERROR);
          
          // Volta para estado de espera após 2 segundos
          setTimeout(() => {
            setScanState(WAITING);
          }, 2000);
        }
      }
    }
  });

  // Feedback Visual
  React.useEffect(() => {
    switch (scanState) {
      case WAITING:
        setColor(colors.yellow || '#FFD700'); 
        setText(`Procure a árvore: ${tree.name || '...'}`);
        break;
      case ERROR:
        setColor(colors.red || '#FF0000');
        setText('QR Code Incorreto! Tente outra árvore.');
        break;
      case SUCCESS:
        setColor(colors.green || '#32CD32');
        setText('Sucesso! Árvore correta.');
        break;
    }
  }, [scanState, tree.name]);

  if (!hasPermission) return (
    <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
      <Text>Sem permissão de câmera</Text>
    </View>
  );
  
  if (!device) return (
    <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
      <ActivityIndicator size="large" color="#000" />
      <Text>Carregando câmera...</Text>
    </View>
  );

  return (
    <>
      <View style={[styles.item, { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }]}>
        <ChangeColorButton
          text={text}
          color={color}
        />
      </View>
      <View style={{ flex: 9, backgroundColor: '#000' }}>
        <Camera 
          style={StyleSheet.absoluteFill} 
          device={device} 
          isActive={true} 
          codeScanner={codeScanner} 
        />
        
        {/* Mira Central (Visual Aid) */}
        <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: 'center', alignItems: 'center'
        }}>
            <View style={{
                width: 250, height: 250,
                borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
                borderRadius: 20
            }} />
        </View>
      </View>
    </>
  );
}