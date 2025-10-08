import { StyleSheet } from 'react-native';

export const gardenViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Light sky blue
  },
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#87CEEB',
  },
  skyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    opacity: 0.6,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
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
  cloudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cloudCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
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
  beeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  beeBody: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
  },
  beeWing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  hud: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  hudContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  hudText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  hudSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  navIconContainer: {
    marginBottom: 5,
  },
  navIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});