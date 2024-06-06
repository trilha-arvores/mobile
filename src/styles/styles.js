import React from 'react';
import { StyleSheet } from 'react-native';

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
      marginVertical: 5,
      
      // justifyContent: 'space-between',
      // flexDirection: 'column',
    },
    title: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 30,
      // letterSpacing: 1,
      fontFamily: 'Open Sans'
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
    card : {
      // width: '90%',
      height: 100,
      // flex: 1,
      marginHorizontal: 20,
      marginVertical: 5,
      padding: 10,
      justifyContent: 'center',
      borderRadius: 4,
      // elevation: 1,
      // height: 80,
      backgroundColor: 'grey',
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
});