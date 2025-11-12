import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { GardenGrid } from '../garden/GardenGrid';
import { HoveringBees } from '../garden/HoveringBees';
import { usePlotActions } from '@/hooks/usePlotActions';
import type { PlotData, InventoryData } from '@/hooks/useGameState';

type HomeContentProps = {
  plots: PlotData[];
  setPlots: React.Dispatch<React.SetStateAction<PlotData[]>>;
  inventory: InventoryData;
  setInventory: React.Dispatch<React.SetStateAction<InventoryData>>;
  selectedAction: 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null;
  selectedPlant: string;
  consumeWater: () => Promise<boolean>;
};

export function HomeContent({
  plots,
  setPlots,
  inventory,
  setInventory,
  selectedAction,
  selectedPlant,
  consumeWater,
}: HomeContentProps) {
  const [, setShowHarvestAnimation] = React.useState(false);
  const [, setHarvestReward] = React.useState({ cropEmoji: '', cropCount: 0, seedCount: 0 });
  
  const { handlePlotPress } = usePlotActions({
    plots,
    setPlots,
    inventory,
    setInventory,
    selectedAction,
    selectedPlant,
    consumeWater,
    setHarvestReward,
    setShowHarvestAnimation,
    setSelectedAction: () => {},
  });

  return (
    <>
      {/* Hovering Bees */}
      <HoveringBees isDaytime={true} count={5} />

      {/* Garden with fence */}
      <ScrollView contentContainerStyle={styles.content}>
        <GardenGrid 
          plots={plots}
          selectedTool={selectedAction}
          onPlotPress={handlePlotPress}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
