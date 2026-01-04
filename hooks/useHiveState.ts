import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { HiveData } from '../types/hive';

const STORAGE_KEY = 'hives';
const HIVE_COST = 100; // Cost in coins to build a new hive
const REFRESH_SIGNAL_KEY = 'hivesRefreshSignal';

export function useHiveState() {
  // Users start with exactly one beehive with no bees
  const [hives, setHives] = useState<HiveData[]>([{
    id: 'default-hive',
    beeCount: 0,
    createdAt: Date.now(),
  }]);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const loadHives = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setHives(parsed);
          console.log('📂 Loaded hives from storage:', parsed);
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
            setHives(parsed);
            console.log('📂 Reloaded hives from storage after refresh signal:', parsed);
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
    // addBees called
    if (count <= 0) {
      // count <= 0, returning
      return;
    };

    setHives(prev => {
      // updating hives
      // Update the first hive if no ID specified, or the specified hive
      const updated = prev.map((hive, index) => {
        if (hiveId ? hive.id === hiveId : index === 0) {
          const newBeeCount = Math.max(0, hive.beeCount + count);
          // Updated hive
          return {
            ...hive,
            beeCount: newBeeCount,
          };
        }
        return hive;
      });
      // Updated hives state
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
          addBees(pending.count, pending.hiveId);
          await AsyncStorage.removeItem('pending_bee_addition');
        }
      } catch (error: any) {
        console.error("Error processing pending bee addition: ", error);
      }
    };

    const pendingInterval = setInterval(checkForPendingBees, 1000);
    return () => clearInterval(pendingInterval);
  }, [addBees]);

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
  };
}
