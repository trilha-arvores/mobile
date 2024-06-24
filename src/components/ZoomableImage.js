import React from 'react';
import { ScrollView, Image } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import DefaultButton from '../components/DefaultButton';

export default function ZoomableImage({ source }) {
    return (
        <>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <ReactNativeZoomableView
                    maxZoom={2}
                    minZoom={0.5}
                    zoomStep={0.5}
                    initialZoom={1}
                    pinchToZoomInSensitivity={3}
                    pinchToZoomOutSensitivity={3}
                    movementSensibility={5}
                    doubleTapZoomToCenter={false}
                    resizeMode={'cover'}
                    bindToBorders={false}>
                    <Image style={{ height: '100%', width: 'undefined', aspectRatio: 1, resizeMode: 'cover' }}
                        source={source}
                    />
                </ReactNativeZoomableView>

            </ScrollView>
        </>
    )
}