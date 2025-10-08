import { StyleSheet } from 'react-native';

export const toolbarIconStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    minWidth: 70,
  },
  selectedContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowOpacity: 0.4,
  },
  icon: {
    fontSize: 24,
  },
  selectedIcon: {
    opacity: 0.8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 'bold',
  },
});