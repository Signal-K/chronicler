import { StyleSheet } from 'react-native';

export const grassTerrainStyles = StyleSheet.create({
  grassTerrain: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%', // Covers bottom 45% of display
    backgroundColor: 'transparent', // Changed from green to transparent since we're using sprites
  },
  grassTile: {
    position: 'absolute',
    opacity: 0.9, // Slight transparency to blend better
  },
});