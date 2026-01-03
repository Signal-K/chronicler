import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface HoneyBottleProps {
  color?: string; // Hex color for honey type (deprecated - using image instead)
  lightness?: number; // 0-1, optional (deprecated - using image instead)
}

export function HoneyBottle({ color, lightness = 1 }: HoneyBottleProps) {
  // Use Honey_Bottle.png sprite asset
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Sprites/Honey_Bottle.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 32,
    height: 48,
  },
});
