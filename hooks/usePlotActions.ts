import type React from 'react';
import { canPlantCrop, getCropConfig } from '../lib/cropConfig';
import type { InventoryData, PlotData, Tool } from './useGameState';

interface UsePlotActionsParams {
  plots: PlotData[];
  setPlots: (plots: PlotData[]) => void;
  inventory: InventoryData;
  setInventory: (inventory: InventoryData) => void;
  selectedAction: Tool;
  selectedPlant: string;
  consumeWater: () => Promise<boolean>;
  setHarvestReward: (reward: { cropEmoji: string; cropCount: number; seedCount: number }) => void;
  setShowHarvestAnimation: (show: boolean) => void;
  setSelectedAction: React.Dispatch<React.SetStateAction<Tool>>;
  incrementPollinationFactor?: (amount: number) => void;
  onShowDialog?: (title: string, message: string, emoji?: string) => void;
  addHarvestToHive?: (cropId: string, amount?: number) => void; // New parameter for honey production
}

export function usePlotActions({
  plots,
  setPlots,
  inventory,
  setInventory,
  selectedAction,
  selectedPlant,
  consumeWater,
  setHarvestReward,
  setShowHarvestAnimation,
  setSelectedAction,
  incrementPollinationFactor,
  onShowDialog,
  addHarvestToHive,
}: UsePlotActionsParams) {
  
  const handleTill = (index: number, current: PlotData) => {
    if (current.state !== 'empty') {
      console.log('Cannot Till: Plot must be empty');
      return false;
    }
    
    const newPlots = [...plots];
    newPlots[index] = {
      state: 'tilled',
      growthStage: 0,
      cropType: null,
      needsWater: false,
    };
    setPlots(newPlots);
    console.log(`✅ Tilled: Plot ${index + 1} is now tilled`);
    
    // Check if any empty plots remain to till
    const remainingEmptyPlots = newPlots.some(plot => plot.state === 'empty');
    
    // Deselect till tool if no empty plots remain
    if (!remainingEmptyPlots && selectedAction === 'till') {
      setSelectedAction(null);
    }
    return true;
  };

  const handlePlant = (index: number, current: PlotData) => {
    if (current.state !== 'tilled') {
      console.log('Cannot plant: Plot must be tilled first');
      return false;
    }

    if (!canPlantCrop(selectedPlant, inventory)) {
      console.log(`No seeds: You don't have any ${selectedPlant} seeds!`);
      return false;
    }
    
    const config = getCropConfig(selectedPlant);
    if (!config) {
      console.log("Error: Invalid crop type");
      return false;
    }

    const newInventory = { ...inventory };
    if (config.plantRequirement.type === 'seed') {
      newInventory.seeds = {
        ...newInventory.seeds,
        [selectedPlant]: (newInventory.seeds[selectedPlant] || 0) - 1,
      };
    } else {
      newInventory.harvested = {
        ...newInventory.harvested,
        [selectedPlant]: (newInventory.harvested[selectedPlant] || 0) - 1,
      };
    }

    const now = Date.now();
    const newPlots = [...plots];
    newPlots[index] = {
      state: 'planted',
      growthStage: 1,
      cropType: selectedPlant,
      needsWater: false,
      plantedAt: now,
    };

    setPlots(newPlots);
    setInventory(newInventory);
    console.log(`Planted: ${config.name} planted!`);
    
    // Check if this was the last seed/crop
    const remainingCount = config.plantRequirement.type === 'seed' 
      ? newInventory.seeds[selectedPlant] || 0
      : newInventory.harvested[selectedPlant] || 0;
    
    if (remainingCount === 0 && onShowDialog) {
      const itemType = config.plantRequirement.type === 'seed' ? 'seed' : 'crop';
      onShowDialog(
        'Last One Planted! 🌱',
        `You've planted your last ${config.name} ${itemType}! Visit the shop to buy more seeds or wait for your harvest to grow more.`,
        '⚠️'
      );
    }
    
    // Check if any tilled plots remain and if player has any seeds left
    const remainingTilledPlots = newPlots.some(plot => plot.state === 'tilled');
    const hasAnySeeds = Object.values(newInventory.seeds).some(count => count > 0);
    
    // Deselect plant tool if no tilled plots remain or no seeds remain
    if ((!remainingTilledPlots || !hasAnySeeds) && selectedAction === 'plant') {
      setSelectedAction(null);
    }
    
    return true;
  };

  const handleWater = async (index: number, current: PlotData) => {
    if (current.state === 'empty' || current.state === 'tilled') {
      console.log("Cannot Water: Plot must have plants");
      return false;
    }

    const now = Date.now();
    const lastAction = current.lastWateredAt || current.plantedAt || now;
    const timeSinceAction = now - lastAction;

    if (timeSinceAction < 10000 && current.growthStage < 5) {
      const remainingSeconds = Math.ceil((10000 - timeSinceAction) / 1000);
      console.log(`Not ready: Plant doesn't need water yet. Wait ${remainingSeconds}s`);
      return false;
    }

    if (!current.needsWater && current.growthStage < 5) {
      console.log("Not ready: Plant doesn't need water yet");
      return false;
    }

    const hasWater = await consumeWater();
    if (!hasWater) {
      console.log("No water: You need to wait for your water tank to refill");
      return false;
    }

    const newStage = current.growthStage + 1;

    // Plant grows automatically to stage 5 without requiring classification
    const newPlots = [...plots];
    newPlots[index] = {
      ...current,
      growthStage: newStage,
      needsWater: false,
      lastWateredAt: now,
      state: newStage === 5 ? 'growing' : 'planted',
    };

    setPlots(newPlots);
    
    // Check if any plots remain that need watering
    const remainingWaterablePlots = newPlots.some(plot => 
      (plot.state === 'planted' || plot.state === 'growing') && 
      plot.needsWater && 
      plot.growthStage < 5
    );
    
    // Deselect water tool if no plots need watering
    if (!remainingWaterablePlots && selectedAction === 'water') {
      setSelectedAction(null);
    }
    return true;
  };

  const handleShovel = (index: number, current: PlotData) => {
    if (current.state === 'empty') {
      console.log('Nothing to Clear: Plot is already empty');
      return false;
    }
    
    const newPlots = [...plots];
    
    if (!current.cropType) {
      // Just clear tilled plot
      newPlots[index] = {
        state: 'empty',
        growthStage: 0,
        cropType: null,
        needsWater: false,
      };
      setPlots(newPlots);
      console.log('✅ Cleared: Plot has been cleared');
      return true;
    }
    
    const config = getCropConfig(current.cropType);
    if (!config) return false;
    
    // Return 1 seed
    const newInventory = { ...inventory };
    newInventory.seeds = {
      ...newInventory.seeds,
      [current.cropType]: (newInventory.seeds[current.cropType] || 0) + 1,
    };
    
    // Clear plot
    newPlots[index] = {
      state: 'empty',
      growthStage: 0,
      cropType: null,
      needsWater: false,
    };
    
    // Show harvest animation for the seed
    setHarvestReward({
      cropEmoji: config.emoji,
      cropCount: 0,
      seedCount: 1,
    });
    setShowHarvestAnimation(true);
    setPlots(newPlots);
    setInventory(newInventory);
    
    // Check if any plots remain that can be harvested or shoveled
    const remainingHarvestable = newPlots.some(plot => 
      plot.state !== 'empty' && plot.cropType !== null
    );
    
    // Deselect harvest tool only if no plots remain harvestable/shovellable
    if (!remainingHarvestable && selectedAction === 'harvest') {
      setSelectedAction(null);
    }
    return true;
  };

  const handleHarvest = async (index: number, current: PlotData) => {
    console.log('🌾 HARVEST CALLED - Plot:', index);
    
    // If plant is not fully grown, perform shovel action instead
    if (current.growthStage !== 5) {
      console.log('🪓 Plant not fully grown - performing shovel action');
      return handleShovel(index, current);
    }
    
    if (!current.cropType) {
      console.log('Cannot Harvest: No crop planted');
      return false;
    }
    
    const config = getCropConfig(current.cropType);
    if (!config) return false;
    
    console.log('✅ HARVEST VALID - Crop:', current.cropType);
    
    // Track harvest for experience system - new XP system
    try {
      const { awardHarvestXP } = await import('../lib/experienceSystem');
      const xpEvents = await awardHarvestXP(current.cropType);
      
      // Log XP gained for user feedback
      xpEvents.forEach(event => {
        console.log(`🎉 XP Gained: +${event.amount} (${event.description})`);
      });
      
      // Could show XP notification UI here in the future
    } catch (error) {
      console.error('Failed to record harvest XP:', error);
    }
    
    // Calculate rewards
    const cropCount = 3;
    const seedCount = 2;
    
    // Add to inventory
    const newInventory = { ...inventory };
    newInventory.harvested = {
      ...newInventory.harvested,
      [current.cropType]: (newInventory.harvested[current.cropType] || 0) + cropCount,
    };
    newInventory.seeds = {
      ...newInventory.seeds,
      [current.cropType]: (newInventory.seeds[current.cropType] || 0) + seedCount,
    };
    
    // Increment pollination factor on harvest
    console.log('🔍 INCREMENT FUNCTION EXISTS:', !!incrementPollinationFactor);
    if (incrementPollinationFactor) {
      console.log('🌸 CALLING INCREMENT POLLINATION FACTOR');
      incrementPollinationFactor(1);
      console.log('✅ INCREMENT CALLED');
    } else {
      console.log('❌ NO INCREMENT FUNCTION PASSED!');
    }
    
    // Add harvest to hive for honey production
    if (addHarvestToHive) {

      addHarvestToHive(current.cropType, cropCount);
    }
    
    // Show harvest animation
    setHarvestReward({
      cropEmoji: config.emoji,
      cropCount: cropCount,
      seedCount: seedCount,
    });
    setShowHarvestAnimation(true);
    
    // Clear the plot
    const newPlots = [...plots];
    newPlots[index] = {
      state: 'empty',
      growthStage: 0,
      cropType: null,
      needsWater: false,
    };
    
    setPlots(newPlots);
    setInventory(newInventory);
    
    // Check if any plots remain that can be harvested or shoveled
    const remainingHarvestable = newPlots.some(plot => 
      plot.state !== 'empty' && plot.cropType !== null
    );
    
    // Deselect harvest tool only if no plots remain harvestable/shovellable
    if (!remainingHarvestable && selectedAction === 'harvest') {
      setSelectedAction(null);
    }
    return true;
  };

  const handlePlotPress = (index: number) => {
    if (!selectedAction) {
      console.log('No Tool Selected: Please select a tool from the toolbar first');
      return;
    }

    const current = plots[index];

    switch (selectedAction) {
      case 'till':
        handleTill(index, current);
        break;
      case 'plant':
        handlePlant(index, current);
        break;
      case 'water':
        handleWater(index, current);
        break;
      case 'harvest':
        // Handle async harvest (also handles shovel for non-fully-grown plants)
        handleHarvest(index, current).catch(err => 
          console.error('Harvest error:', err)
        );
        break;
    }
  };

  return { handlePlotPress };
}
