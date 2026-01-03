import React from 'react';
import type { InventoryData, PlotData, Tool } from '../../hooks/useGameState';
import type { HiveData } from '../../types/hive';
import { HomeContent } from './HomeContent';

type FarmPagerProps = {
  plots: PlotData[]; // full plots array
  setPlotsState: React.Dispatch<React.SetStateAction<PlotData[]>>;
  inventory: InventoryData;
  setInventory: React.Dispatch<React.SetStateAction<InventoryData>>;
  selectedAction: Tool;
  setSelectedAction: React.Dispatch<React.SetStateAction<Tool>>;
  selectedPlant: string;
  consumeWater: () => Promise<boolean>;
  incrementPollinationFactor: (amount: number) => void;
  isDaytime: boolean;
  pollinationFactor: number;
  hiveCount: number;
  hives: HiveData[]; // Add hives data
  updateHiveBeeCount: (count: number) => void;
  flyingBees: any[];
  onBeePress?: (beeId: string) => void;
  verticalPage: 'main' | 'expand';
};

export function FarmPager({
  plots,
  setPlotsState,
  inventory,
  setInventory,
  selectedAction,
  setSelectedAction,
  selectedPlant,
  consumeWater,
  incrementPollinationFactor,
  isDaytime,
  pollinationFactor,
  hiveCount,
  hives,
  updateHiveBeeCount,
  flyingBees,
  onBeePress,
  verticalPage,
}: FarmPagerProps) {
  const plotsPerPage = 6;
  const mainPlots = plots.slice(0, plotsPerPage);
  const expandPlots = plots.slice(plotsPerPage, plotsPerPage * 2);
  const pagePlots = verticalPage === 'main' ? mainPlots : expandPlots;

  const setPagePlots = (newPagePlots: React.SetStateAction<PlotData[]>) => {
    const incoming: PlotData[] = typeof newPagePlots === 'function'
      ? (newPagePlots as (prev: PlotData[]) => PlotData[])(plots as PlotData[])
      : newPagePlots;

    const updated: PlotData[] = [...(plots as PlotData[])];
    if (verticalPage === 'main') {
      for (let i = 0; i < plotsPerPage; i++) {
        updated[i] = incoming[i] ?? updated[i];
      }
    } else {
      for (let i = 0; i < plotsPerPage; i++) {
        updated[plotsPerPage + i] = incoming[i] ?? updated[plotsPerPage + i];
      }
    }
    setPlotsState(updated);
  };

  return (
    <HomeContent
      plots={pagePlots}
      setPlots={setPagePlots}
      totalPlots={plots.length}
      baseIndex={verticalPage === 'main' ? 0 : plotsPerPage}
      inventory={inventory}
      setInventory={setInventory}
      selectedAction={selectedAction}
      setSelectedAction={setSelectedAction}
      selectedPlant={selectedPlant}
      consumeWater={consumeWater}
      incrementPollinationFactor={incrementPollinationFactor}
      isDaytime={isDaytime}
      pollinationFactor={pollinationFactor}
      hiveCount={hiveCount}
      hives={hives}
      updateHiveBeeCount={updateHiveBeeCount}
      flyingBees={flyingBees}
      onBeePress={onBeePress}
      verticalPage={verticalPage}
    />
  );
}

export default FarmPager;
