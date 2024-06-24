import React from 'react';
import { StyleSheet } from 'react-native';
import * as Colors from './Colors'
import * as Typography from './Typography'

const baseCard = {
    flex: 1,
    color: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
}

export const styles = StyleSheet.create({
    cardHeader: {
        baseCard,
        height: 200,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    subCard: {
        baseCard,
        height: '80%',
        flexDirection: 'column',
    },
    cardTitle: {
        baseCard,
        fontSize: Typography.size.medium,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        baseCard,
        fontSize: Typography.size.small
    },
    cardContainer: {
        baseCard,
        backgroundColor: Colors.colors.white,
        alignItems: 'strech',
        paddingVertical: 5,
    },
    homeCard: {
        baseCard,
        backgroundColor: Colors.colors.white,
        paddingBottom: 70,
        justifyContent: 'flex-end',
        flexDirection: 'column',
    }

});