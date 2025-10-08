import { StyleSheet } from 'react-native';

export const weatherHUDStyles = StyleSheet.create({
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
});