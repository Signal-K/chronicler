import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import type { HiveData } from '../../types/hive';
import { HexagonalHive } from './HexagonalHive';

interface HiveGridProps {
  hives: HiveData[];
  onHivePress: (position: { q: number; r: number }, hive: HiveData | null) => void;
  maxRadius?: number; // How many hexagon rings to show (default 2)
}

export function HiveGrid({ hives, onHivePress, maxRadius = 1 }: HiveGridProps) {
  const hiveSize = 110; // Even larger hives to fill screen
  const spacing = 0; // No spacing - perfect honeycomb fit

  // Convert axial coordinates (q, r) to pixel coordinates for pointy-top hexagons
  const axialToPixel = (q: number, r: number): { x: number; y: number } => {
    // Pointy-top hexagon math (rotated 30 degrees from flat-top)
    const x = hiveSize * Math.sqrt(3) * (q + r / 2);
    const y = hiveSize * (3 / 2) * r;
    
    return { x, y };
  };

  // Simpler hexagonal ring generation - just 1-2 rings max (7-19 hives)
  const generateSimpleHexRing = (radius: number): { q: number; r: number }[] => {
    const positions: { q: number; r: number }[] = [];
    
    // Center
    positions.push({ q: 0, r: 0 });
    
    // Ring 1 (6 hexagons around center) - total 7 hives
    if (radius >= 1) {
      positions.push({ q: 1, r: 0 });
      positions.push({ q: 1, r: -1 });
      positions.push({ q: 0, r: -1 });
      positions.push({ q: -1, r: 0 });
      positions.push({ q: -1, r: 1 });
      positions.push({ q: 0, r: 1 });
    }
    
    return positions;
  };

  const hexPositions = generateSimpleHexRing(maxRadius);

  // Find hive data for a given position, return null if empty
  const getHiveAtPosition = (q: number, r: number): HiveData | null => {
    const existingHive = hives.find(h => h.position?.q === q && h.position?.r === r);
    return existingHive || null;
  };

  // Calculate bounds for centering
  const bounds = hexPositions.reduce(
    (acc, pos) => {
      const pixel = axialToPixel(pos.q, pos.r);
      return {
        minX: Math.min(acc.minX, pixel.x),
        maxX: Math.max(acc.maxX, pixel.x),
        minY: Math.min(acc.minY, pixel.y),
        maxY: Math.max(acc.maxY, pixel.y),
      };
    },
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  const offsetX = -bounds.minX + hiveSize + spacing;
  const offsetY = -bounds.minY + hiveSize + spacing;
  const gridWidth = bounds.maxX - bounds.minX + hiveSize * 2 + spacing * 2;
  const gridHeight = bounds.maxY - bounds.minY + hiveSize * 2 + spacing * 2;

  const screenWidth = Dimensions.get('window').width;
  const centerOffsetX = (screenWidth - gridWidth) / 2;

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.grid, { width: gridWidth, height: gridHeight, marginLeft: Math.max(0, centerOffsetX) }]}>
        {hexPositions.map((pos) => {
          const pixel = axialToPixel(pos.q, pos.r);
          const hiveData = getHiveAtPosition(pos.q, pos.r);
          
          return (
            <View
              key={`${pos.q}-${pos.r}`}
              style={[
                styles.hexContainer,
                {
                  left: pixel.x + offsetX - hiveSize,
                  top: pixel.y + offsetY - hiveSize,
                },
              ]}
            >
              <HexagonalHive
                hive={hiveData}
                size={hiveSize}
                onPress={() => onHivePress(pos, hiveData)}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginTop: 60, // Right below GameHeader (no space for quality banner blocking)
  },
  scrollContent: {
    paddingVertical: 40,
    paddingBottom: 140, // Space for bottom navigation
  },
  grid: {
    position: 'relative',
  },
  hexContainer: {
    position: 'absolute',
  },
});
