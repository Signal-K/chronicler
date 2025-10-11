import { StyleSheet } from 'react-native';

export const gardenPlotsStyles = StyleSheet.create({
  // Uniform squircle-shaped plots using sand sprite
  plotContainer: {
    position: 'absolute',
    width: 120,
    height: 90,
    borderRadius: 30, // Squircle shape (rounded rectangle)
    overflow: 'hidden', // Ensures sprite stays within bounds
  },
  plotInteractive: {
    width: 120,
    height: 90,
    borderRadius: 30,
    zIndex: 1000, // Much higher zIndex
  },
  plotHighlight: {
    position: 'absolute',
    width: 126,
    height: 96,
    borderRadius: 33,
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
    width: 120,
    height: 90,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 100, 0.3)',
    zIndex: 8,
  },
  tilledOverlay: {
    position: 'absolute',
    width: 120,
    height: 90,
    borderRadius: 30,
    backgroundColor: 'rgba(92, 51, 23, 0.5)',
    zIndex: 9,
  },
  // Hide flower elements across all screens to remove flower dots
  flowerContainer: {
    display: 'none',
  },
  flower: {
    display: 'none',
    // kept keys to avoid runtime undefined style references
    width: 0,
    height: 0,
    borderRadius: 0,
  },
  pinkFlower: {
    display: 'none',
  },
  orangeFlower: {
    display: 'none',
  },
  purpleFlower: {
    display: 'none',
  },
  yellowFlower: {
    display: 'none',
  },
  redFlower: {
    display: 'none',
  },
  blueFlower: {
    display: 'none',
  },
  // Single hatch line element; we'll position and rotate multiples programmatically
  tilledHatchLine: {
    position: 'absolute',
    width: 4,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 0,
    zIndex: 10,
  },
  // Image inside plot wrapper should fill completely
  plotImage: {
    width: 120,
    height: 90,
    borderRadius: 30,
  },
  // hide flower center as well
  flowerCenter: {
    display: 'none',
    width: 0,
    height: 0,
    borderRadius: 0,
  },
});