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
  plotInteractive: {
    width: 80,
    height: 60,
    borderRadius: 20,
    zIndex: 1000, // Much higher zIndex
  },
  plotHighlight: {
    position: 'absolute',
    width: 84,
    height: 64,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    zIndex: 5,
  },
  plotArrow: {
    position: 'absolute',
    fontSize: 24,
    color: '#4A90E2',
    zIndex: 15,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  wateredOverlay: {
    position: 'absolute',
    width: 80,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 100, 0.3)',
    zIndex: 8,
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