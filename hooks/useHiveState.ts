import type { BeeHealth, HiveData, HiveInventory, HiveType } from '../types/hive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const HIVE_STORAGE_KEY = 'hiveStates';
const INVENTORY_STORAGE_KEY = 'hiveInventory';

export function useHiveState() {
  const [hives, setHives] = useState<HiveData[]>([]);
  const [inventory, setInventory] = useState<HiveInventory>({
    availableHives: {
      standard: 1,      // Start with 1 standard hive
      langstroth: 0,
      'top-bar': 0,
      warre: 0,
      flow: 0,
    },
    unlockedTypes: ['standard'], // Only standard hive unlocked initially
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load hives from storage
  useEffect(() => {
    loadHives();
    loadInventory();
  }, []);

  const loadHives = async () => {
    try {
      const stored = await AsyncStorage.getItem(HIVE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHives(parsed);
      }
    } catch (error) {
      console.error('Error loading hives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const stored = await AsyncStorage.getItem(INVENTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInventory(parsed);
      }
    } catch (error) {
      console.error('Error loading hive inventory:', error);
    }
  };

  const saveHives = async (newHives: HiveData[]) => {
    try {
      await AsyncStorage.setItem(HIVE_STORAGE_KEY, JSON.stringify(newHives));
      setHives(newHives);
    } catch (error) {
      console.error('Error saving hives:', error);
    }
  };

  const saveInventory = async (newInventory: HiveInventory) => {
    try {
      await AsyncStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(newInventory));
      setInventory(newInventory);
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  // Place a new hive at a position
  const placeHive = (position: { q: number; r: number }, hiveType: HiveType) => {
    if (!hiveType) {
        console.log("Error: No hive type selected");
        return;
    };

    if (inventory.availableHives[hiveType] <= 0) {
        console.log(`Error: No ${hiveType} hives available in your inventory`);
        return;
    };

    const existingHive = hives.find(h => h.position.q === position.q && h.position.r === position.r);
    if (existingHive) {
        console.log("Error: Position already occupied!");
        return;
    };

    const newHive: HiveData = {
        id: `hive_${Date.now()}_${position.q}_${position.r}`,
        hiveType: hiveType,
        position,
        health: 'good',
        status: 'active',
        population: {
        workers: 100,
        drones: 20,
        queen: true,
        brood: 50,
        },
        resources: {
        honey: 0,
        pollen: 20,
        nectar: 20,
        },
        temperature: 35, // Ideal bee temperature in Celsius
        ventilation: 70,
        placedAt: Date.now(),
    };

    // Add new hive to array
    const newHives = [...hives, newHive];
    const newInventory: HiveInventory = {
        ...inventory,
        availableHives: {
            ...inventory.availableHives,
            [hiveType]: inventory.availableHives[hiveType] - 1,
        },
    };

    saveHives(newHives);
    saveInventory(newInventory);
  };

  // Remove/harvest a hive
  const removeHive = (hiveId: string) => {
    const hive = hives.find(h => h.id === hiveId);
    if (!hive) {
        console.log("Error: Hive not found");
        return;
    };

    const healthMultiplier = {
        'excellent': 1.0,
        'good': 0.8,
        'fair': 0.6,
        'poor': 0.4,
        'critical': 0.2,
    }[hive.health];

    const honeyToReturn = Math.floor(hive.resources.honey * healthMultiplier);
    const newHives = hives.filter(h => h.id !== hiveId);

    // Return hive to inventory (only if hiveType is not null)
    if (hive.hiveType) {
      const newInventory: HiveInventory = {
          ...inventory,
          availableHives: {
              ...inventory.availableHives,
              [hive.hiveType]: inventory.availableHives[hive.hiveType] + 1,
          },
      };
      saveInventory(newInventory);
    }

    saveHives(newHives);
    
    console.log(`Removed ${hive.hiveType} hive. Recovered ${honeyToReturn} honey.`);
    // TODO: Add honey to player inventory when that system is implemented
  };

  const updateHiveResources = (hiveId: string, updates: Partial<HiveData>) => {
    const hiveIndex = hives.findIndex(h => h.id === hiveId);
    if (hiveIndex === -1) {
        console.log("Error: Hive not found");
        return;
    };

    const hive = hives[hiveIndex];
    const now = Date.now();
    const timeSinceLastUpdate = hive.placedAt ? now - hive.placedAt : 0;
    const hoursPassed = timeSinceLastUpdate / (1000 * 60 * 60);
    
    const baseNectarRate = 5;
    const basePollenRate = 3;
    const baseHoneyConversion = 2;
    const populationMultiplier = Math.min(hive.population.workers / 500, 2.0);

    const healthMultiplier = {
        'excellent': 1.2,
        'good': 1.0,
        'fair': 0.7,
        'poor': 0.4,
        'critical': 0.1,
    }[hive.health];

    const nectarGain = Math.floor(baseNectarRate * hoursPassed * populationMultiplier * healthMultiplier);
    const pollenGain = Math.floor(basePollenRate * hoursPassed * populationMultiplier * healthMultiplier);
    const nectarToHoney = Math.floor(baseHoneyConversion * hoursPassed * healthMultiplier);
    const actualNectarUsed = Math.min(nectarToHoney, hive.resources.nectar);
    const honeyGain = actualNectarUsed;

    const newResources = {
        honey: Math.min(hive.resources.honey + honeyGain, 100),
        pollen: Math.min(hive.resources.pollen + pollenGain, 100),
        nectar: Math.min(hive.resources.nectar + nectarGain - actualNectarUsed, 100),
    };

    const broodGrowth = Math.floor(hive.population.brood * 0.1 * hoursPassed);
    const newPopulation = {
        ...hive.population,
        workers: Math.min(hive.population.workers + broodGrowth, 2000),
        brood: Math.max(hive.population.brood - broodGrowth + Math.floor(hoursPassed * 5), 0),
    };

    let newHealth = hive.health;
    if (newResources.pollen < 20 || newResources.nectar < 20) {
    // Starving - health deteriorates
    const healthLevels: BeeHealth[] = ['excellent', 'good', 'fair', 'poor', 'critical'];
    const currentIndex = healthLevels.indexOf(hive.health);
    if (currentIndex < healthLevels.length - 1) {
      newHealth = healthLevels[currentIndex + 1];
    }
  } else if (newResources.pollen > 60 && newResources.nectar > 60) {
    // Well-fed - health improves
    const healthLevels: BeeHealth[] = ['excellent', 'good', 'fair', 'poor', 'critical'];
    const currentIndex = healthLevels.indexOf(hive.health);
    if (currentIndex > 0) {
      newHealth = healthLevels[currentIndex - 1];
    };
  };

  const updatedHive: HiveData = {
    ...hive,
    resources: newResources,
    population: newPopulation,
    health: newHealth,
  };

  // Update hives array
  const newHives = [...hives];
  newHives[hiveIndex] = updatedHive;
  
  saveHives(newHives);
  console.log(`Updated hive ${hiveId}:`, {
    honey: `${hive.resources.honey} → ${newResources.honey}`,
    pollen: `${hive.resources.pollen} → ${newResources.pollen}`,
    nectar: `${hive.resources.nectar} → ${newResources.nectar}`,
    workers: `${hive.population.workers} → ${newPopulation.workers}`,
  });
  };

const harvestHoney = (hiveId: string): number => {
  const hiveIndex = hives.findIndex(h => h.id === hiveId);
  if (hiveIndex === -1) {
    console.log('Error: Hive not found');
    return 0;
  }

  const hive = hives[hiveIndex];
  
  // Minimum honey required to harvest (don't take it all - bees need some)
  const minHoneyToLeave = 20;
  const harvestableHoney = Math.max(0, hive.resources.honey - minHoneyToLeave);
  
  if (harvestableHoney <= 0) {
    console.log('Not enough honey to harvest. Bees need at least 20 honey to survive.');
    return 0;
  }

  // Harvest reduces honey to minimum
  const updatedHive: HiveData = {
    ...hive,
    resources: {
      ...hive.resources,
      honey: minHoneyToLeave,
    },
  };

  const newHives = [...hives];
  newHives[hiveIndex] = updatedHive;
  
  saveHives(newHives);
  
  console.log(`Harvested ${harvestableHoney} honey from ${hive.hiveType} hive`);
  // TODO: Add honey to player inventory when that system is implemented
  
  return harvestableHoney;
};

  // Add hives to inventory (e.g., from shop purchases)
  const addHivesToInventory = (hiveType: Exclude<HiveType, null>, count: number) => {
    const updatedInventory = {
      ...inventory,
      availableHives: {
        ...inventory.availableHives,
        [hiveType]: inventory.availableHives[hiveType] + count,
      },
    };
    saveInventory(updatedInventory);
  };

  // Unlock new hive type
  const unlockHiveType = (hiveType: HiveType) => {
    if (!hiveType || inventory.unlockedTypes.includes(hiveType)) {
      return;
    }
    
    const updatedInventory = {
      ...inventory,
      unlockedTypes: [...inventory.unlockedTypes, hiveType],
    };
    saveInventory(updatedInventory);
  };

  // Reset all hives (for debugging/testing)
  const resetHives = async () => {
    try {
      await AsyncStorage.removeItem(HIVE_STORAGE_KEY);
      await AsyncStorage.removeItem(INVENTORY_STORAGE_KEY);
      setHives([]);
      setInventory({
        availableHives: {
          standard: 1,
          langstroth: 0,
          'top-bar': 0,
          warre: 0,
          flow: 0,
        },
        unlockedTypes: ['standard'],
      });
    } catch (error) {
      console.error('Error resetting hives:', error);
    }
  };

  return {
    hives,
    inventory,
    isLoading,
    placeHive,
    removeHive,
    updateHiveResources,
    harvestHoney,
    addHivesToInventory,
    unlockHiveType,
    resetHives,
  };
}
