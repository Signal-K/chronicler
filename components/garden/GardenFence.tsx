import React from 'react';
import { StyleSheet, View } from 'react-native';

export function GardenFence() {
  return (
    <View style={styles.fenceFrame}>
      {/* Top fence */}
      <View style={styles.fenceTop}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.fencePostTop} />
        ))}
      </View>
      
      {/* Bottom fence */}
      <View style={styles.fenceBottom}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.fencePostTop} />
        ))}
      </View>
      
      {/* Left fence */}
      <View style={styles.fenceLeft}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.fencePostSide} />
        ))}
      </View>
      
      {/* Right fence */}
      <View style={styles.fenceRight}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.fencePostSide} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fenceFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fenceTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#c2410c',
    borderWidth: 3,
    borderColor: '#44403c',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fenceBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#c2410c',
    borderWidth: 3,
    borderColor: '#44403c',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fenceLeft: {
    position: 'absolute',
    top: 32,
    bottom: 32,
    left: 0,
    width: 32,
    backgroundColor: '#c2410c',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#44403c',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fenceRight: {
    position: 'absolute',
    top: 32,
    bottom: 32,
    right: 0,
    width: 32,
    backgroundColor: '#c2410c',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#44403c',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fencePostTop: {
    width: 16,
    height: 32,
    backgroundColor: '#ea580c',
    borderWidth: 2,
    borderColor: '#78350f',
    borderRadius: 8,
  },
  fencePostSide: {
    width: 32,
    height: 16,
    backgroundColor: '#ea580c',
    borderWidth: 2,
    borderColor: '#78350f',
    borderRadius: 8,
  },
});
