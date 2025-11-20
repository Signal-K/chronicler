import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useBeeManager } from '../../hooks/useBeeManager';
import type { InventoryData, PlotData } from '../../hooks/useGameState';
import { usePlotActions } from '../../hooks/usePlotActions';
import { BeeGameObject } from '../garden/BeeGameObject';
import { GardenGrid } from '../garden/GardenGrid';

type HomeContentProps = {
  plots: PlotData[];
  setPlots: React.Dispatch<React.SetStateAction<PlotData[]>>;
  inventory: InventoryData;
  setInventory: React.Dispatch<React.SetStateAction<InventoryData>>;
  selectedAction: 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null;
  selectedPlant: string;
  consumeWater: () => Promise<boolean>;
  incrementPollinationFactor?: (amount: number) => void;
  isDaytime?: boolean;
  pollinationFactor?: number;
  hiveCount?: number;
  updateHiveBeeCount?: (count: number) => void;
};

export function HomeContent({
  plots,
  setPlots,
  inventory,
  setInventory,
  selectedAction,
  selectedPlant,
  consumeWater,
  incrementPollinationFactor,
  isDaytime = true,
  pollinationFactor = 0,
  hiveCount = 1,
  updateHiveBeeCount,
}: HomeContentProps) {
  const [, setShowHarvestAnimation] = React.useState(false);
  const [, setHarvestReward] = React.useState({ cropEmoji: '', cropCount: 0, seedCount: 0 });

  // Bee management system
  const { activeBees, despawnBee, setHiveBeeCountUpdater } = useBeeManager({
    pollinationFactor,
    hiveCount,
    isDaytime,
  });

  // Connect hive bee count updater
  React.useEffect(() => {
    if (updateHiveBeeCount) {
      setHiveBeeCountUpdater(updateHiveBeeCount);
    }
  }, [updateHiveBeeCount, setHiveBeeCountUpdater]);
  
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
    incrementPollinationFactor,
  });

  return (
    <>
      {/* Bee Game Objects - managed as individual entities */}
      {activeBees.map((bee) => (
        <BeeGameObject
          key={bee.id}
          beeId={bee.id}
          onDespawn={despawnBee}
        />
      ))}

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
