import React from 'react';
import { Image, Dimensions } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const ZoomableImage = ({ source, style }) => {
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <ReactNativeZoomableView
      maxZoom={8}
      minZoom={0.5}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      style={{ width: '100%', height: '100%' }}
    >
      <Image
        source={source}
        style={{ width: screenWidth, height: '100%', resizeMode: 'contain' }}
      />
    </ReactNativeZoomableView>
  );
};

export default ZoomableImage;