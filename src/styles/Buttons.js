import React from 'react';
import { StyleSheet } from 'react-native';
import * as Colors from './Colors'
import * as Typography from './Typography'

export const roundedCorners = {
    borderRadius: 4
}

export const squared = {
    height: 'undefined', 
    aspectRatio: 1, 
}

export const round = {
    borderRadius: 50,
    width: 90,
    height: 90
}

export const small = {
    width: 100
}

export const medium = {
    width: 200
}

export const baseButton = {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
}

export const styles = StyleSheet.create({
    mediumGreen: {
        baseButton,
        medium,
        roundedCorners,
        backgroundColor: Colors.colors.green,
        margin: 5,
    },
    smallGrey: {
        baseButton,
        small,
        roundedCorners,
        color: Colors.colors.white
    },
    roundGreenButton: {
        baseButton,
        round,
        color: Colors.colors.green
    },
    roundImage: {
        flex: 1,
        squared,
        width: '100%',
        roundedCorners
    }
});