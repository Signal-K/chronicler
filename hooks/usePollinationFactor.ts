import { useState } from 'react';
import type { PollinationFactorData, PollinationFactorHookReturn } from '../types/pollinationFactor';

const DEFAULT_THRESHOLD = 5;

export function usePollinationFactor(): PollinationFactorHookReturn {
  const [pollinationFactor, setPollinationFactor] = useState<PollinationFactorData>({
    factor: 0,
    totalHarvests: 0,
    threshold: DEFAULT_THRESHOLD,
  });

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