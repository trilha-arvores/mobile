import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    homeContainer: {
      backgroundColor: colors.white,
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: 40,
      paddingTop: 12,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    cardContainer: {
      backgroundColor: colors.white,
      flex: 1,
      paddingVertical: 8,
    },
    title: {
      fontWeight: 'bold',
      color: colors.black,
      fontSize: 30,
      textAlign: 'center'
    },
    subtitle: {
      fontWeight: 'bold',
      color: colors.black,
      fontSize: 18,
      textAlign: 'center'
    },
    item: {
      marginVertical: 6,
      width: '100%',
      alignItems: 'center',
    },
    text: {
      letterSpacing: 0.2,
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    roundImage: {
      width: 88,
      height: 88,
      borderRadius: 12,
      resizeMode: 'cover'
    },
    card : {
      marginHorizontal: 16,
      marginVertical: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      justifyContent: 'flex-start',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: '#e4e9e5',
      elevation: 2,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
    },
    cardPressed: {
      opacity: 0.96,
    }, 
    cardHeader : {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    subCard : {
      flex: 1,
      justifyContent: 'space-between',
      marginLeft: 12,
    },
    cardDescription: {
      backgroundColor: colors.yellow, 
      maxHeight: 100,
      marginBottom: 10,
      padding: 6,
      borderRadius: 6,
    },
    cardTitle : {
      textAlign: 'left',
      fontWeight: 'bold',
      color: colors.black,
      fontSize: 20,
    },
    cardSubtitle : {
      color: colors.black,
      fontSize: 15, 
    },
    button: {
      minWidth: 220,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.green,
      borderWidth: 1,
      borderColor: colors.green,
      elevation: 2,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
    },
    buttonPressed: {
      opacity: 0.88,
    },
    smallerButton : {
      width: 100,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: colors.black,
    },
    roundButton : {
      width: 86,
      height: 86,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 43,
      backgroundColor: colors.green,
      borderWidth: 1,
      borderColor: colors.green,
      elevation: 2,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
    },
    filledRoundButton : {
      width: 86,
      height: 86,
      borderWidth: 1,
      borderColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 43,
      backgroundColor: colors.white,
      elevation: 2,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    roundButtonPressed: {
      opacity: 0.88,
    },

    activityComponent : {
      backgroundColor: 'transparent',
      fontSize: 38,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    activityComponentTitle : {
      color: colors.black, 
      flex: 1,
    }
});
