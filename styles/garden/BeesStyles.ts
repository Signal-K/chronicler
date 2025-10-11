import { StyleSheet } from 'react-native';

export const beesStyles = StyleSheet.create({
  beeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sleepingBee: {
    position: 'absolute',
    width: 32,
    height: 20,
    borderRadius: 16,
    backgroundColor: '#B8860B', // Darker bee when sleeping
  },
  sleepIndicator: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Bee head - brown/dark yellow
  beeHead: {
    position: 'absolute',
    width: 24,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#B8860B', // Dark golden rod
  },
  // Large compound eyes - dark red/brown
  beeEye: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B0000', // Dark red
  },
  // Antennae - thin dark lines
  antenna: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#654321', // Dark brown
  },
  // Thorax - fuzzy middle section
  beeThorax: {
    position: 'absolute',
    width: 24,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DAA520', // Golden rod - fuzzy appearance
  },
  // Abdomen - main body with yellow base
  beeAbdomen: {
    position: 'absolute',
    width: 36,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700', // Gold
  },
  // Black stripes on abdomen
  beeStripe: {
    position: 'absolute',
    width: 36,
    height: 4,
    backgroundColor: '#000000',
  },
  // Large forewings - translucent with veining
  beeWingLarge: {
    position: 'absolute',
    width: 32,
    height: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.3)', // Subtle brown veining
  },
  // Smaller hindwings
  beeWingSmall: {
    position: 'absolute',
    width: 20,
    height: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.2)',
  },
  // Six legs - thin and jointed
  beeLeg: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: '#654321', // Dark brown
  },
});