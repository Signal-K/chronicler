import { StyleSheet } from 'react-native';

export const gardenPlotsStyles = StyleSheet.create({
  // Uniform squircle-shaped plots using sand sprite
  plotContainer: {
    position: 'absolute',
    width: 80,
    height: 60,
    borderRadius: 20, // Squircle shape (rounded rectangle)
    overflow: 'hidden', // Ensures sprite stays within bounds
  },
  flowerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flower: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pinkFlower: {
    backgroundColor: '#FF69B4',
  },
  orangeFlower: {
    backgroundColor: '#FF4500',
  },
  purpleFlower: {
    backgroundColor: '#9370DB',
  },
  yellowFlower: {
    backgroundColor: '#FFD700',
  },
  redFlower: {
    backgroundColor: '#DC143C',
  },
  blueFlower: {
    backgroundColor: '#4169E1',
  },
  flowerCenter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
});