import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

interface HoneyBottleProps {
  color: string; // Hex color for honey type
  lightness?: number; // 0-1, optional, for further light/dark adjustment
}

export function HoneyBottle({ color, lightness = 1 }: HoneyBottleProps) {
  // Optionally adjust color lightness
  // For now, just use the color prop directly
  return (
    <View style={styles.container}>
      <Svg width={32} height={48}>
        {/* Bottle outline */}
        <Ellipse cx={16} cy={44} rx={12} ry={4} fill="#e5e7eb" />
        <Rect x={6} y={8} width={20} height={32} rx={10} fill="#f3f4f6" stroke="#a3a3a3" strokeWidth={1.5} />
        {/* Honey fill */}
        <Defs>
          <LinearGradient id="honeyGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.95 * lightness} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.7 * lightness} />
          </LinearGradient>
        </Defs>
        <Rect x={8} y={12} width={16} height={24} rx={8} fill="url(#honeyGradient)" />
        {/* Bottle cap */}
        <Rect x={12} y={4} width={8} height={8} rx={2} fill="#a16207" />
      </Svg>
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
});
