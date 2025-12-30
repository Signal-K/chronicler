import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { PlotData, Tool } from '../../hooks/useGameState';
import { SimplePlot } from '../placeables/SimplePlot';
import { GardenFence } from './GardenFence';

interface GardenGridProps {
  plots: PlotData[];
  selectedTool: Tool;
  onPlotPress: (index: number) => void;
  baseIndex?: number;
}

export function GardenGrid({ plots, selectedTool, onPlotPress, baseIndex = 0 }: GardenGridProps) {
  return (
    <View style={styles.gardenWrapper}>
      <View style={styles.gardenContainer}>
        <GardenFence />
        
        {/* Garden grid */}
        <View style={styles.grid}>
          {plots.map((plot, index) => {
            const globalIndex = (baseIndex ?? 0) + index;
            return (
              <SimplePlot
                key={globalIndex}
                index={index}
                plot={plot}
                selectedTool={selectedTool}
                onPress={() => onPlotPress(index)}
                seedIndex={globalIndex}
                displayNumber={globalIndex + 1}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gardenWrapper: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    borderWidth: 10,
    borderColor: '#22c55e',
    padding: 12,
    alignSelf: 'center',
  },
  gardenContainer: {
    position: 'relative',
    padding: 20,
    backgroundColor: '#86efac',
    borderRadius: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: 360,
    gap: 16,
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    borderWidth: 4,
    borderColor: '#22c55e',
    borderRadius: 8,
  },
});
