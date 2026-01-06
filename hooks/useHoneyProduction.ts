import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { calculateHoneyBlend, getCropConfig } from '../lib/cropConfig';
import type { BottleHoneyResult, HarvestRecord, HiveData, HoneyTypeInfo } from '../types/hive';

// Production hours: 08:00-16:00 and 20:00-04:00
const PRODUCTION_HOURS = [
  [8, 16],   // 8 AM to 4 PM
  [20, 4],   // 8 PM to 4 AM next day
];

// Force daytime production rate: 10% every 5 seconds
const FORCE_DAY_PRODUCTION_RATE = 0.1; // 10%
const FORCE_DAY_INTERVAL = 5000; // 5 seconds

const HIVE_LEVELS = {
  1: { maxCapacity: 20, honeyPerFull: 15 },
  2: { maxCapacity: 30, honeyPerFull: 22 },
  3: { maxCapacity: 40, honeyPerFull: 30 },
};

export function useHoneyProduction() {
  const [loaded, setLoaded] = useState(false);
  const [forceDaytime, setForceDaytime] = useState(false);

  // Load force daytime setting
  useEffect(() => {
    const loadForceDaytimeSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem('forceDaytime');
        if (saved !== null) {
          const newValue = saved === 'true';
          setForceDaytime(newValue);
        }
      } catch (error) {
        console.error('Error loading force daytime setting:', error);
      }
    };
    
    loadForceDaytimeSetting();
    
    // Listen for changes to force daytime setting
    const checkForceDaytime = async () => {
      try {
        const saved = await AsyncStorage.getItem('forceDaytime');
        if (saved !== null) {
          const newValue = saved === 'true';
          if (newValue !== forceDaytime) {
            setForceDaytime(newValue);
          }
        }
      } catch (error) {
        console.error('Error checking force daytime setting:', error);
      }
    };
    
    const interval = setInterval(checkForceDaytime, 1000);
    return () => clearInterval(interval);
  }, [forceDaytime]);

  // Initialize honey production for a hive
  const initializeHoneyProduction = useCallback((hive: HiveData): HiveData => {
    if (hive.honey) return hive;
    
    const level = hive.level || 1;
    const levelConfig = HIVE_LEVELS[level as keyof typeof HIVE_LEVELS];
    
    return {
      ...hive,
      level,
      honey: {
        currentCapacity: 0,
        maxCapacity: levelConfig.maxCapacity,
        dailyHarvests: [],
        honeyBottles: 0,
        productionActive: false,
      },
    };
  }, []);

  // Check if current time is within production hours or force daytime is active
  const isProductionTime = useCallback((): boolean => {
    // Always produce if force daytime is active
    if (forceDaytime) {
      return true;
    }
    
    const now = new Date();
    const hour = now.getHours();
    
    return PRODUCTION_HOURS.some(([start, end]) => {
      if (start <= end) {
        // Same day range (8-16)
        return hour >= start && hour <= end;
      } else {
        // Cross midnight range (20-4)
        return hour >= start || hour <= end;
      }
    });
  }, [forceDaytime]);

  // Add harvest record to hive
  const addHarvest = useCallback((hive: HiveData, cropId: string, amount: number = 1): HiveData => {
    const updatedHive = initializeHoneyProduction(hive);
    if (!updatedHive.honey) return hive;

    const now = Date.now();
    const today = new Date().toDateString();
    
    // Filter out harvests from previous days
    const todaysHarvests = updatedHive.honey.dailyHarvests.filter(harvest => 
      new Date(harvest.timestamp).toDateString() === today
    );

    // Add new harvest
    const newHarvest: HarvestRecord = {
      cropId,
      timestamp: now,
      amount,
      halved: false,
    };

    const updatedHarvests = [...todaysHarvests, newHarvest];
    
    return {
      ...updatedHive,
      honey: {
        ...updatedHive.honey,
        dailyHarvests: updatedHarvests,
        productionActive: isProductionTime(),
      },
    };
  }, [initializeHoneyProduction, isProductionTime]);

  // Calculate honey production progress
  const calculateHoneyProgress = useCallback((hive: HiveData): { 
    capacity: number; 
    isFull: boolean; 
    dominant: string | null;
    cropProportions: Record<string, number>;
    effectiveHarvests: number;
  } => {
    const initializedHive = initializeHoneyProduction(hive);
    if (!initializedHive.honey) {
      return { capacity: 0, isFull: false, dominant: null, cropProportions: {}, effectiveHarvests: 0 };
    }

    const today = new Date().toDateString();
    const todaysHarvests = initializedHive.honey.dailyHarvests.filter(harvest => 
      new Date(harvest.timestamp).toDateString() === today
    );

    // Count effective harvests (halved ones count as 0.5, virtual boosts count normally)
    const effectiveHarvests = todaysHarvests.reduce((sum, harvest) => {
      return sum + (harvest.halved ? harvest.amount * 0.5 : harvest.amount);
    }, 0);

    // Calculate crop proportions (exclude virtual boosts from display proportions)
    const cropCounts: Record<string, number> = {};
    todaysHarvests.forEach(harvest => {
      // Skip virtual boost harvests for crop proportion calculation
      if (harvest.cropId === 'virtual_boost') return;
      
      const effectiveAmount = harvest.halved ? harvest.amount * 0.5 : harvest.amount;
      cropCounts[harvest.cropId] = (cropCounts[harvest.cropId] || 0) + effectiveAmount;
    });

    // Find dominant crop (excluding virtual boosts)
    let dominant: string | null = null;
    let maxCount = 0;
    Object.entries(cropCounts).forEach(([cropId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = cropId;
      }
    });

    const capacity = Math.min(effectiveHarvests / 18, 1) * 100; // 18 harvests = 100% capacity
    const isFull = effectiveHarvests >= 18;

    return { 
      capacity, 
      isFull, 
      dominant, 
      cropProportions: cropCounts,
      effectiveHarvests
    };
  }, [initializeHoneyProduction]);

  // Update honey production based on time
  const updateHoneyProduction = useCallback((hive: HiveData): HiveData => {
    const initializedHive = initializeHoneyProduction(hive);
    if (!initializedHive.honey) return hive;

    // No honey production if there are no bees in the hive
    if (initializedHive.beeCount === 0) {
      return {
        ...initializedHive,
        honey: {
          ...initializedHive.honey,
          honeyBottles: 0,
          productionActive: false,
        },
      };
    }

    const inProductionTime = isProductionTime();
    let honeyBottles = initializedHive.honey.honeyBottles;
    
    // Force daytime mode: Direct honey bottle production based on bee count
    if (forceDaytime && inProductionTime) {
      const now = Date.now();
      const lastUpdate = initializedHive.honey.lastUpdate || now;
      
      // Only update if more than 500ms have passed to avoid excessive updates
      if (now - lastUpdate >= 500) {
        const timeDiff = now - lastUpdate;
        
        // Calculate production rate: 10 bees = 1/15 every 2000ms, scale by bee count
        const baseProductionTime = 2000; // 2 seconds for full hive (10 bees)
        const productionTime = (baseProductionTime * 10) / initializedHive.beeCount; // Scale by bee count
        const honeyPerProduction = 1/15; // 1/15 of a bottle per production cycle
        
        // Calculate how much honey to add based on time passed
        const productionCycles = timeDiff / productionTime;
        const honeyToAdd = productionCycles * honeyPerProduction;
        
        // Add honey, capping at 15 bottles max
        const newHoneyBottles = Math.min(15, honeyBottles + honeyToAdd);
        
        return {
          ...initializedHive,
          honey: {
            ...initializedHive.honey,
            honeyBottles: newHoneyBottles,
            lastUpdate: now,
            productionActive: true,
          },
        };
      }
    }

    return {
      ...initializedHive,
      honey: {
        ...initializedHive.honey,
        productionActive: inProductionTime,
        lastUpdate: initializedHive.honey.lastUpdate || Date.now(),
      },
    };
  }, [initializeHoneyProduction, isProductionTime, forceDaytime]);

  // Bottle honey (collect honey and reset production)
  const bottleHoney = useCallback((hive: HiveData): BottleHoneyResult => {
    const initializedHive = initializeHoneyProduction(hive);
    if (!initializedHive.honey) {
      return { updatedHive: hive, bottlesCollected: 0, honeyType: null };
    }

    const { dominant, cropProportions } = calculateHoneyProgress(initializedHive);
    const bottlesCollected = initializedHive.honey.honeyBottles;
    
    // Get honey type information
    let honeyType: HoneyTypeInfo | null = null;
    if (dominant) {
      const cropConfig = getCropConfig(dominant);
      if (cropConfig) {
        const blendInfo = calculateHoneyBlend(cropProportions);
        honeyType = {
          ...blendInfo.dominantHoney,
          blendDescription: blendInfo.blendDescription,
          quality: blendInfo.averageQuality,
        };
      }
    }

    // Halve all previous harvests and reset bottles
    const halvedHarvests = initializedHive.honey.dailyHarvests.map(harvest => ({
      ...harvest,
      halved: true,
    }));

    const updatedHive: HiveData = {
      ...initializedHive,
      honey: {
        ...initializedHive.honey,
        dailyHarvests: halvedHarvests,
        honeyBottles: 0,
        lastBottledAt: Date.now(),
      },
    };

    return { updatedHive, bottlesCollected, honeyType };
  }, [initializeHoneyProduction, calculateHoneyProgress]);

  // Get honey progress colors for UI gradient
  const getHoneyProgressColors = useCallback((hive: HiveData): string[] => {
    const { cropProportions } = calculateHoneyProgress(hive);
    const colors: string[] = [];
    
    // Sort crops by proportion
    const sortedCrops = Object.entries(cropProportions)
      .sort((a, b) => b[1] - a[1]);
    
    sortedCrops.forEach(([cropId, proportion]) => {
      const config = getCropConfig(cropId);
      if (config) {
        const percentage = proportion / Object.values(cropProportions).reduce((sum, p) => sum + p, 0);
        // Add color multiple times based on proportion for gradient effect
        const colorRepeats = Math.max(1, Math.round(percentage * 10));
        for (let i = 0; i < colorRepeats; i++) {
          colors.push(config.nectar.honeyProfile.color);
        }
      }
    });
    
    // Default to golden honey color if no crops
    if (colors.length === 0) {
      colors.push('#F5E6A8');
    }
    
    return colors;
  }, [calculateHoneyProgress]);

  return {
    initializeHoneyProduction,
    addHarvest,
    calculateHoneyProgress,
    updateHoneyProduction,
    bottleHoney,
    getHoneyProgressColors,
    isProductionTime,
  };
}