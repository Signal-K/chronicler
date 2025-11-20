import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PollinationFactorData, PollinationFactorHookReturn } from '../types/pollinationFactor';

const DEFAULT_THRESHOLD = 5;
const STORAGE_KEY = 'pollination_factor';

export function usePollinationFactor(): PollinationFactorHookReturn {
  const [pollinationFactor, setPollinationFactor] = useState<PollinationFactorData>({
    factor: 0,
    totalHarvests: 0,
    threshold: DEFAULT_THRESHOLD,
  });
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Save to storage whenever pollination factor changes (only after initial load)
  useEffect(() => {
    if (loaded && (pollinationFactor.totalHarvests > 0 || pollinationFactor.factor > 0)) {
      saveToStorage(pollinationFactor);
    }
  }, [pollinationFactor, loaded]);

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPollinationFactor(parsed);
        console.log('📂 Loaded pollination factor from storage:', parsed);
      }
    } catch (error) {
      console.error('Error loading pollination factor:', error);
    } finally {
      setLoaded(true);
    }
  };

  const saveToStorage = async (data: PollinationFactorData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving pollination factor:', error);
    }
  };

  const incrementFactor = ( amount: number = 1 ) => {
    setPollinationFactor(prev => {
        const newFactor = prev.factor + amount;
        const newTotalHarvests = prev.totalHarvests + 1;
        
        console.log(`🌸 Pollination Factor: ${prev.factor} → ${newFactor}`);
        console.log(`📊 Total Harvests: ${newTotalHarvests}`);
        
        if (prev.factor < prev.threshold && newFactor >= prev.threshold) {
            console.log("✨ Threshold reached! Bees can now spawn!");
        };

        return {
            ...prev,
            factor: newFactor,
            totalHarvests: newTotalHarvests,
        };
    });
  };

  const canSpawnBees = pollinationFactor.factor >= pollinationFactor.threshold;

  return {
    pollinationFactor,
    incrementFactor,
    canSpawnBees,
  };
}