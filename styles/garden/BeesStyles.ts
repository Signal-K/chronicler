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
    width: 16,
    height: 10,
    borderRadius: 8,
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
    width: 12,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#B8860B', // Dark golden rod
  },
  // Large compound eyes - dark red/brown
  beeEye: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B0000', // Dark red
  },
  // Antennae - thin dark lines
  antenna: {
    position: 'absolute',
    width: 1,
    height: 6,
    backgroundColor: '#654321', // Dark brown
  },
  // Thorax - fuzzy middle section
  beeThorax: {
    position: 'absolute',
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DAA520', // Golden rod - fuzzy appearance
  },
  // Abdomen - main body with yellow base
  beeAbdomen: {
    position: 'absolute',
    width: 18,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700', // Gold
  },
  // Black stripes on abdomen
  beeStripe: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: '#000000',
  },
  // Large forewings - translucent with veining
  beeWingLarge: {
    position: 'absolute',
    width: 16,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 69, 19, 0.3)', // Subtle brown veining
  },
  // Smaller hindwings
  beeWingSmall: {
    position: 'absolute',
    width: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 69, 19, 0.2)',
  },
  // Six legs - thin and jointed
  beeLeg: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: '#654321', // Dark brown
  },
});