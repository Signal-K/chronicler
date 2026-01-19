import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { BottleHoneyResult, HiveData } from '../types/hive';
import { useHoneyProduction } from './useHoneyProduction';

const STORAGE_KEY = 'hives';
const HIVE_COST = 100; // Cost in coins to build a new hive
const REFRESH_SIGNAL_KEY = 'hivesRefreshSignal';

export function useHiveState() {
  const honeyProduction = useHoneyProduction();
  
  // Users start with exactly one beehive with no bees
  const [hives, setHives] = useState<HiveData[]>([{
    id: 'default-hive',
    beeCount: 0,
    createdAt: Date.now(),
    level: 1,
  }]);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const loadHives = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Initialize honey production for loaded hives
          const hivesWithHoney = parsed.map((hive: HiveData) => 
            honeyProduction.initializeHoneyProduction(hive)
          );
          setHives(hivesWithHoney);
          console.log('📂 Loaded hives from storage:', hivesWithHoney);
        }
      } catch (error) {
        console.error('Error loading hives:', error);
      } finally {
        setLoaded(true);
      }
    };
    loadHives();
  }, []);

  // Listen for refresh signals from AsyncStorage changes (e.g., from Fill Hives button)
  useEffect(() => {
    const checkForRefreshSignal = async () => {
      try {
        const signal = await AsyncStorage.getItem(REFRESH_SIGNAL_KEY);
        if (signal) {
          console.log('🐝 Refresh signal detected, reloading hives from storage');
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            // Initialize honey production for reloaded hives
            const hivesWithHoney = parsed.map((hive: HiveData) => 
              honeyProduction.initializeHoneyProduction(hive)
            );
            setHives(hivesWithHoney);
            console.log('📂 Reloaded hives from storage after refresh signal:', hivesWithHoney);
          }
          // Clear the signal after processing
          await AsyncStorage.removeItem(REFRESH_SIGNAL_KEY);
        }
      } catch (error) {
        console.error('Error checking refresh signal:', error);
      }
    };

    // Check for refresh signal periodically
    const interval = setInterval(checkForRefreshSignal, 500);
    return () => clearInterval(interval);
  }, []);


  // Save to storage whenever hives change
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(hives));
    }
  }, [hives, loaded]);

  const addBees = (count: number, hiveId?: string) => {  
    console.log(`🐝 addBees called: count=${count}, hiveId=${hiveId}`);
    if (count <= 0) {
      console.log(`🐝 Invalid count ${count}, returning`);
      return;
    };

    setHives(prev => {
      console.log(`🐝 Current hives:`, prev.map(h => `${h.id}:${h.beeCount}`));
      // Update the first hive if no ID specified, or the specified hive
      const updated = prev.map((hive, index) => {
        if (hiveId ? hive.id === hiveId : index === 0) {
          const newBeeCount = Math.max(0, hive.beeCount + count);
          console.log(`🐝 Updating hive ${hive.id}: ${hive.beeCount} + ${count} = ${newBeeCount}`);
          return {
            ...hive,
            beeCount: newBeeCount,
          };
        }
        return hive;
      });
      console.log(`🐝 Updated hives:`, updated.map(h => `${h.id}:${h.beeCount}`));
      return updated;
    });
  };

  const buildNewHive = () => {
    const newHive: HiveData = {
      id: `hive-${Date.now()}`,
      beeCount: 0,
      createdAt: Date.now(),
    };
    setHives(prev => [...prev, newHive]);
    // Built new hive
    return newHive;
  };

  const canBuildNewHive = (coinBalance: number) => {
    return coinBalance >= HIVE_COST;
  };

  const getAvailableHives = () => {
    return hives.filter(h => h.beeCount < 10);
  };

  const getTotalBeeCount = () => {
    return hives.reduce((sum, hive) => sum + hive.beeCount, 0);
  };

  const calculateBeeSpawn = (pollinationFactor: number, harvestHistory: any[], weather: any) => {
    const threshold = 5;
    if (pollinationFactor < threshold) {
      return 0;
    };

    const factorAboveThreshold = pollinationFactor - threshold;
    let beesToSpawn = factorAboveThreshold;

    const uniquePlantTypes = new Set(harvestHistory.map(h => h.plantType)).size;
    const diversityBonus = Math.floor(uniquePlantTypes * 0.5);
    beesToSpawn += diversityBonus;

    // Weather modifier
    if (weather) {
      if (weather.condition === 'sunny' && weather.temperature >= 15 && weather.temperature <= 27) {
        beesToSpawn = Math.floor(beesToSpawn * 1.5);
      } else if (weather.condition === 'rainy' || weather.temperature < 10 || weather.temperature > 30) {
        beesToSpawn = Math.floor(beesToSpawn * 0.5);
      };
    };

    const maxSpawn = 10;
    beesToSpawn = Math.min(beesToSpawn, maxSpawn);
    return beesToSpawn;
  };

  // NEW: Listen for pending bee additions from pollination milestones
  useEffect(() => {
    const checkForPendingBees = async () => {
      try {
        const pendingData = await AsyncStorage.getItem("pending_bee_addition");
        if (pendingData) {
          const pending = JSON.parse(pendingData);
          console.log('🐝 Processing pending bee addition:', pending);
          addBees(pending.count, pending.hiveId);
          await AsyncStorage.removeItem('pending_bee_addition');
          console.log('🐝 Pending bee addition processed and removed');
        }
      } catch (error: any) {
        console.error("Error processing pending bee addition: ", error);
      }
    };

    const pendingInterval = setInterval(checkForPendingBees, 1000);
    return () => clearInterval(pendingInterval);
  }, [addBees]);

  // Add harvest to hive for honey production
  const addHarvestToHive = (cropId: string, amount: number = 1, hiveId?: string) => {
    setHives(prev => {
      return prev.map((hive, index) => {
        if (hiveId ? hive.id === hiveId : index === 0) {
          return honeyProduction.addHarvest(hive, cropId, amount);
        }
        return hive;
      });
    });
  };

  // Update honey production for all hives
  const updateAllHoneyProduction = () => {
    setHives(prev => prev.map(hive => honeyProduction.updateHoneyProduction(hive)));
  };

  // Bottle honey from a hive
  const bottleHoneyFromHive = (hiveId?: string): BottleHoneyResult => {
    let result: BottleHoneyResult = { updatedHive: hives[0], bottlesCollected: 0, honeyType: null };
    
    setHives(prev => {
      return prev.map((hive, index) => {
        if (hiveId ? hive.id === hiveId : index === 0) {
          const bottlingResult = honeyProduction.bottleHoney(hive);
          result = bottlingResult;
          return bottlingResult.updatedHive;
        }
        return hive;
      });
    });
    
    return result;
  };

  // Regular honey production update
  useEffect(() => {
    let mainInterval: ReturnType<typeof setInterval>;
    let forceInterval: ReturnType<typeof setInterval>;
    
    // Main update interval (1 minute for normal mode)
    mainInterval = setInterval(updateAllHoneyProduction, 60000);
    
    // Additional frequent updates for force daytime mode (every 5 seconds)
    const checkForceMode = async () => {
      try {
        const forceDaytimeSetting = await AsyncStorage.getItem('forceDaytime');
        if (forceDaytimeSetting === 'true') {
          updateAllHoneyProduction();
        }
      } catch (error) {
        console.error('Error checking force daytime mode:', error);
      }
    };
    
    forceInterval = setInterval(checkForceMode, 5000);
    
    // Initial update
    updateAllHoneyProduction();
    
    return () => {
      clearInterval(mainInterval);
      clearInterval(forceInterval);
    };
  }, []);

  return {
    hives,
    hive: hives[0], // For backward compatibility
    addBees,
    buildNewHive,
    canBuildNewHive,
    getAvailableHives,
    getTotalBeeCount,
    calculateBeeSpawn,
    hiveCost: HIVE_COST,
    // Honey production methods
    addHarvestToHive,
    updateAllHoneyProduction,
    bottleHoneyFromHive,
    honeyProduction,
  };
}
