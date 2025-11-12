import type { PlotData, Tool } from '@/hooks/useGameState';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SimplePlot } from '../placeables/SimplePlot';
import { GardenFence } from './GardenFence';

interface GardenGridProps {
  plots: PlotData[];
  selectedTool: Tool;
  onPlotPress: (index: number) => void;
}

export function GardenGrid({ plots, selectedTool, onPlotPress }: GardenGridProps) {
  return (
    <View style={styles.gardenWrapper}>
      <View style={styles.gardenContainer}>
        <GardenFence />
        
        {/* Garden grid */}
        <View style={styles.grid}>
          {plots.map((plot, index) => (
            <SimplePlot
              key={index}
              index={index}
              plot={plot}
              selectedTool={selectedTool}
              onPress={() => onPlotPress(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gardenWrapper: {
    backgroundColor: '#4ade80',
    borderRadius: 8,
    borderWidth: 8,
    borderColor: '#22c55e',
    padding: 4,
  },
  gardenContainer: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#86efac',
    borderRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
    gap: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#22c55e',
    borderRadius: 8,
  },
});
