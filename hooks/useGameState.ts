import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type PlotData = {
  state: 'empty' | 'tilled' | 'planted' | 'growing';
  growthStage: number;
  cropType: string | null;
  needsWater: boolean;
  plantedAt?: number;
  lastWateredAt?: number;
};

export type Tool = 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | 'bottle' | null;

export type InventoryData = {
  coins: number;
  water: number;
  seeds: Record<string, number>;
  harvested: Record<string, number>;
  items?: Record<string, number>; // For bottles, tools, etc.
};

const INITIAL_PLOTS: PlotData[] = Array(6).fill(null).map(() => ({
  state: 'empty' as const,
  growthStage: 0,
  cropType: null,
  needsWater: false,
}));

const INITIAL_INVENTORY: InventoryData = {
  coins: 100,
  water: 100,
  seeds: { tomato: 5, pumpkin: 5, wheat: 5, potato: 5 },
  harvested: { tomato: 0, pumpkin: 0, wheat: 0, potato: 0 },
  items: { glass_bottle: 0, bottled_nectar: 0 },
};

export function useGameState() {
  const [plots, setPlots] = useState<PlotData[]>(INITIAL_PLOTS);
  const [inventory, setInventory] = useState<InventoryData>(INITIAL_INVENTORY);
  const [selectedAction, setSelectedAction] = useState<Tool>(null);
  const [selectedPlant, setSelectedPlant] = useState<string>('tomato');
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [plotsData, inventoryData] = await Promise.all([
          AsyncStorage.getItem('plots'),
          AsyncStorage.getItem('inventory'),
        ]);
        
        if (plotsData) {
          setPlots(JSON.parse(plotsData));
        }
        
        if (inventoryData) {
          setInventory(JSON.parse(inventoryData));
        }
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoaded(true);
      }
    };
    
    loadData();
  }, []);

  // Save plots to storage (only after initial load)
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('plots', JSON.stringify(plots));
    }
  }, [plots, loaded]);
  
  // Save inventory to storage (only after initial load)
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [inventory, loaded]);

  // Growth timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPlots(currentPlots => {
        const now = Date.now();
        return currentPlots.map(plot => {
          if (plot.state !== 'planted' && plot.state !== 'growing') {
            return plot;
          }

          const timeSinceAction = plot.lastWateredAt
            ? now - plot.lastWateredAt
            : plot.plantedAt
            ? now - plot.plantedAt
            : 0;

          // Random time between 9-12 seconds (9000-12000ms) before plant needs water
          const waterNeededTime = 9000 + Math.random() * 3000;
          
          if (timeSinceAction >= waterNeededTime && plot.growthStage < 5) {
            if (!plot.needsWater && plot.growthStage > 0) {
              return {
                ...plot,
                needsWater: true,
                state: 'growing' as const
              };
            }
          }

          return plot;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resetGame = () => {
    setPlots(INITIAL_PLOTS);
    setInventory(INITIAL_INVENTORY);
    AsyncStorage.removeItem('plots');
    AsyncStorage.removeItem('inventory');
  };

  return {
    plots,
    setPlots,
    inventory,
    setInventory,
    selectedAction,
    setSelectedAction,
    selectedPlant,
    setSelectedPlant,
    resetGame,
  };
}
