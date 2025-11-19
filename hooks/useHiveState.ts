import { useState } from 'react';
import type { HiveData } from '../types/hive';

export function useHiveState() {
  // Every user starts with exactly one beehive with no bees
  const [hive, setHive] = useState<HiveData>({
    id: 'default-hive',
    beeCount: 0,
    createdAt: Date.now(),
  });

  const addBees = (count: number) => {  
    if (count <= 0) {
      return;
    };

    setHive(prev => {
      const newBeeCount = prev.beeCount + count;

      return {
        ...prev,
        beeCount: newBeeCount,
      };
    });
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

  return {
    hive,
    addBees,
    calculateBeeSpawn,
  };
}
