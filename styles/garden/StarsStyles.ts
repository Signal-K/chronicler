import { StyleSheet } from 'react-native';

export const starsStyles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
});