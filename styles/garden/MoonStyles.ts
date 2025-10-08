import { StyleSheet } from 'react-native';

export const moonStyles = StyleSheet.create({
  moonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  moonDark: {
    position: 'absolute',
    backgroundColor: '#2C3E50', // Dark gray for moon's dark side
  },
  moonLight: {
    position: 'absolute',
    backgroundColor: '#F8F9FA', // Light gray/white for illuminated side
    overflow: 'hidden',
  },
  moonGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(248, 249, 250, 0.2)',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});