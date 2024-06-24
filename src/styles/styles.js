import React from 'react';
import { StyleSheet } from 'react-native'; 
import FilledRoundButton from '../components/FilledRoundButton';

export const styles = StyleSheet.create({
    homeContainer: {
      backgroundColor: 'white',
      flex: 1,
      paddingBottom: 70,
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'column',
    },
    cardContainer: {
      backgroundColor: 'white',
      flex: 1,
      alignItems: 'strech',
      paddingVertical: 5,
      // justifyContent: 'space-between',
      // flexDirection: 'column',
    },
    title: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 30,
      textAlign: 'center'
    },
    subtitle: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 20,
      textAlign: 'center'
    },
    item: {
      marginVertical: 6,
    },
    text: {
      lineHeight: 21,
      // fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
      fontSize: 16
    },
    roundImage: {
      width: '25%', 
      height: 'undefined', 
      aspectRatio: 1, 
      borderRadius: 4,
      resizeMode: 'contain'
    },
    card : {
      flex: 1,
      flexDirection: 'column',
      // borderWidth: 1,
      marginHorizontal: 20,
      marginVertical: 10,
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderRadius: 4,
      elevation: 3,
      justifyContent: 'flex-start',
      backgroundColor: '#fdfdfd',
    }, 
    cardHeader : {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    subCard : {
      height: '80%',
      width: '90%',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
    },
    cardDescription: {
      backgroundColor: 'yellow', 
      maxHeight: 100,
      marginBottom: 10,
      padding: 3,
    },
    cardTitle : {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 20,
    },
    cardSubtitle : {
      color: 'black',
      fontSize: 16, 
      paddingHorizontal: 5,
    },
    button: {
      width: 200,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      elevation: 3,
      // height: 80,
      backgroundColor: '#517300',
    },
    smallerButton : {
      width: 100,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      elevation: 3,
      // height: 80,
      backgroundColor: 'black',
    },
    roundButton : {
      width: 90,
      height: 90,
      // borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      elevation: 3,
      marginHorizontal: 20,
      // height: 80,
      backgroundColor: '#517300',
    },
    filledRoundButton : {
      width: 90,
      height: 90,
      borderWidth: 1,
      borderColor: '#517300',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      elevation: 3,
      marginHorizontal: 20,
      // height: 80,
      backgroundColor: 'white',
    },

    activityComponent : {
      backgroundColor: 'transparent',
      fontSize: 40,
      flex: 3, flexDirection: 'row',
      justifyContent: 'center',
    },
    activityComponentTitle : {
      color: '#313131', 
      flex: 1
    }

});