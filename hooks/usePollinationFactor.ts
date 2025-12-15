import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
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

  const incrementFactor = async ( amount: number = 1 ) => {
    setPollinationFactor(prev => ({
        ...prev,
        factor: prev.factor + amount,
        totalHarvests: prev.totalHarvests + 1,
    }));

    // Award XP for pollination event (citizen science contribution)
    try {
      const { awardPollinationXP } = await import('../lib/experienceSystem');
      const xpEvent = await awardPollinationXP();
      console.log(`🐝 Pollination XP: +${xpEvent.amount} (${xpEvent.description})`);
    } catch (error) {
      console.error('Failed to award pollination XP:', error);
    }
  };

  const canSpawnBees = pollinationFactor.factor >= pollinationFactor.threshold;

  return {
    pollinationFactor,
    incrementFactor,
    canSpawnBees,
  };
}