import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

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
  bottledHoney?: { id: string; type: string; color: string; amount: number }[];
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
  seeds: { tomato: 5, sunflower: 5, blueberry: 5, lavender: 5 },
  harvested: { tomato: 0, sunflower: 0, blueberry: 0, lavender: 0 },
  items: { glass_bottle: 10, honey_bottles: 0 }, // Give players some starting glass bottles
  bottledHoney: [], // Array of bottled honey with types
};

export function useGameState() {
  const [plots, setPlots] = useState<PlotData[]>(INITIAL_PLOTS);
  const [inventory, setInventory] = useState<InventoryData>(INITIAL_INVENTORY);
  const [selectedAction, setSelectedAction] = useState<Tool>(null);
  const [selectedPlant, setSelectedPlant] = useState<string>('tomato');
  const [loaded, setLoaded] = useState(false);
  const lastPlotsTsRef = useRef<number>(0);
  const lastInventoryTsRef = useRef<number>(0);

  // Load from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [plotsData, inventoryData, plotsTs, inventoryTs] = await Promise.all([
          AsyncStorage.getItem('plots'),
          AsyncStorage.getItem('inventory'),
          AsyncStorage.getItem('plots_updated_at'),
          AsyncStorage.getItem('inventory_updated_at'),
        ]);

        if (plotsData) {
          setPlots(JSON.parse(plotsData));
        }

        if (inventoryData) {
          setInventory(JSON.parse(inventoryData));
        }

        lastPlotsTsRef.current = plotsTs ? Number(plotsTs) : 0;
        lastInventoryTsRef.current = inventoryTs ? Number(inventoryTs) : 0;
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
    if (!loaded) return;

    let cancelled = false;

    const savePlots = async () => {
      try {
        const [storedString, storedTsString] = await Promise.all([
          AsyncStorage.getItem('plots'),
          AsyncStorage.getItem('plots_updated_at'),
        ]);

        const storedTs = storedTsString ? Number(storedTsString) : 0;

        // If storage has a newer version, adopt it instead of overwriting
        if (storedTs > lastPlotsTsRef.current && storedString) {
          setPlots(JSON.parse(storedString));
          lastPlotsTsRef.current = storedTs;
          return;
        }

        const currentString = JSON.stringify(plots);

        // If storage already matches our state, skip writing
        if (storedString === currentString) {
          return;
        }

        const now = Date.now();
        await AsyncStorage.setItem('plots', currentString);
        await AsyncStorage.setItem('plots_updated_at', String(now));
        lastPlotsTsRef.current = now;
      } catch (e) {
        console.error('Failed to save plots', e);
      }
    };

    savePlots();

    return () => {
      cancelled = true;
    };
  }, [plots, loaded]);
  
  // Save inventory to storage (only after initial load)
  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;

    const saveInventory = async () => {
      try {
        const [storedString, storedTsString] = await Promise.all([
          AsyncStorage.getItem('inventory'),
          AsyncStorage.getItem('inventory_updated_at'),
        ]);

        const storedTs = storedTsString ? Number(storedTsString) : 0;

        if (storedTs > lastInventoryTsRef.current && storedString) {
          setInventory(JSON.parse(storedString));
          lastInventoryTsRef.current = storedTs;
          return;
        }

        const currentString = JSON.stringify(inventory);
        if (storedString === currentString) return;

        const now = Date.now();
        await AsyncStorage.setItem('inventory', currentString);
        await AsyncStorage.setItem('inventory_updated_at', String(now));
        lastInventoryTsRef.current = now;
      } catch (e) {
        console.error('Failed to save inventory', e);
      }
    };

    saveInventory();

    return () => {
      cancelled = true;
    };
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
