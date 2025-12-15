import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { HiveState, completeBatch, createNewHive, getHiveProductionSummary, resetDailyCollection, simulatePollinationCycle } from '../lib/honeyProduction';

export interface UseHoneyProductionProps {
  hives: { id: string; position: { x: number; y: number } }[];
  activeCrops: { 
    cropId: string; 
    plotId: string; 
    growthStage: number; 
    position: { x: number; y: number } 
  }[];
  currentTime?: Date;
  autoFillEnabled?: boolean;
}

export interface HoneyProductionState {
  hiveStates: { [hiveId: string]: HiveState };
  lastUpdateTime: Date;
  dailyHarvestedCrops: { [cropId: string]: number };
  isPollinationActive: boolean;
}

export function useHoneyProduction({
  hives,
  activeCrops,
  currentTime = new Date(),
  autoFillEnabled = true
}: UseHoneyProductionProps) {
  const [productionState, setProductionState] = useState<HoneyProductionState>(() => ({
    hiveStates: {},
    lastUpdateTime: new Date(),
    dailyHarvestedCrops: {},
    isPollinationActive: false
  }));

  const [actualAutoFillEnabled, setActualAutoFillEnabled] = useState(autoFillEnabled);

  // Load auto-fill setting from storage
  useEffect(() => {
    const loadAutoFillSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem('autoFillHoneyEnabled');
        if (saved !== null) {
          setActualAutoFillEnabled(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading honey auto-fill setting:', error);
      }
    };
    loadAutoFillSetting();
  }, []);

  // Fast forward honey production based on current/recent crops
  const fastForwardProduction = useCallback((hours: number = 8) => {
    if (!actualAutoFillEnabled || (activeCrops.length === 0 && Object.keys(productionState.dailyHarvestedCrops).length === 0)) {
      return { success: false, reason: 'No active crops or auto-fill disabled' };
    }

    setProductionState(prev => {
      const newHiveStates = { ...prev.hiveStates };
      let totalNectarCollected = 0;
      let totalHoneyProduced = 0;

      // Simulate nectar collection for the specified hours
      Object.keys(newHiveStates).forEach(hiveId => {
        const hive = newHiveStates[hiveId];
        
        // Simulate hourly collection cycles
        for (let hour = 0; hour < hours; hour++) {
          // Use current active crops and recently harvested crops
          const allCropSources = [
            ...activeCrops,
            // Add recently harvested crops as if they were still planted
            ...Object.keys(prev.dailyHarvestedCrops).map(cropId => ({
              cropId,
              plotId: `harvested-${cropId}`,
              growthStage: 4, // Assume mature for harvested crops
              position: { x: 0, y: 0 }
            }))
          ];

          if (allCropSources.length > 0) {
            // Simulate a condensed pollination cycle
            const { updatedHives } = simulatePollinationCycle(
              allCropSources,
              [hive],
              8 + (hour % 12), // Simulate daylight hours
              30 // More bees for faster collection
            );

            if (updatedHives[0]) {
              newHiveStates[hiveId] = updatedHives[0];
              const currentBatch = updatedHives[0].currentBatch;
              if (currentBatch) {
                totalNectarCollected += Object.values(currentBatch.sources).reduce((sum, amount) => sum + amount, 0);
                totalHoneyProduced += currentBatch.amount;
              }
            }
          }
        }

        // Complete batches that are ready
        if (newHiveStates[hiveId].currentBatch?.isComplete) {
          newHiveStates[hiveId] = completeBatch(newHiveStates[hiveId]);
        }
      });

      return {
        ...prev,
        hiveStates: newHiveStates,
        lastUpdateTime: new Date(),
        isPollinationActive: false // Mark as not currently active since it was simulated
      };
    });

    return { 
      success: true, 
      reason: `Fast forwarded ${hours} hours of honey production`,
      nectarCollected: 0, // Will be calculated in the state update
      honeyProduced: 0    // Will be calculated in the state update
    };
  }, [actualAutoFillEnabled, activeCrops, productionState.dailyHarvestedCrops]);

  // Listen for fast forward requests from settings
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const checkForFastForwardRequest = async () => {
      try {
        const requestData = await AsyncStorage.getItem('honeyFastForwardRequest');
        if (requestData) {
          const request = JSON.parse(requestData);
          // Check if this is a new request (not processed yet)
          if (request.timestamp > productionState.lastUpdateTime.getTime()) {
            console.log('Processing fast forward request:', request);
            // Execute fast forward
            const result = fastForwardProduction(request.hours || 8);
            console.log('Fast forward result:', result);
          }
          // Clear the request after processing
          await AsyncStorage.removeItem('honeyFastForwardRequest');
        }
      } catch (error) {
        console.error('Error checking fast forward request:', error);
      }
    };

    if (actualAutoFillEnabled) {
      interval = setInterval(checkForFastForwardRequest, 1000); // Check more frequently
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [productionState.lastUpdateTime, actualAutoFillEnabled, fastForwardProduction]);

  // Listen for fast forward triggers from settings (legacy)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const checkForFastForwardTrigger = async () => {
      try {
        const trigger = await AsyncStorage.getItem('honeyFastForwardTrigger');
        if (trigger && parseInt(trigger) > productionState.lastUpdateTime.getTime()) {
          // Execute fast forward
          const result = fastForwardProduction(8);
          if (result.success) {
            console.log('Auto fast forward executed:', result.reason);
          }
          // Clear the trigger
          await AsyncStorage.removeItem('honeyFastForwardTrigger');
        }
      } catch (error) {
        console.error('Error checking fast forward trigger:', error);
      }
    };

    if (actualAutoFillEnabled) {
      interval = setInterval(checkForFastForwardTrigger, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [productionState.lastUpdateTime, actualAutoFillEnabled, fastForwardProduction]);

  // Initialize hives
  useEffect(() => {
    setProductionState(prev => {
      const newHiveStates = { ...prev.hiveStates };
      let hasChanges = false;

      // Add new hives
      hives.forEach(hive => {
        if (!newHiveStates[hive.id]) {
          newHiveStates[hive.id] = createNewHive(hive.id);
          hasChanges = true;
        }
      });

      // Remove deleted hives
      Object.keys(newHiveStates).forEach(hiveId => {
        if (!hives.find(h => h.id === hiveId)) {
          delete newHiveStates[hiveId];
          hasChanges = true;
        }
      });

      return hasChanges 
        ? { ...prev, hiveStates: newHiveStates }
        : prev;
    });
  }, [hives]);

  // Pollination simulation - runs every 15 minutes during daylight hours
  useEffect(() => {
    const currentHour = currentTime.getHours();
    const isDaylight = currentHour >= 6 && currentHour <= 18;
    
    if (!isDaylight || activeCrops.length === 0 || hives.length === 0 || !actualAutoFillEnabled) {
      return;
    }

    const pollinationInterval = setInterval(() => {
      setProductionState(prev => {
        const hiveStatesArray = Object.values(prev.hiveStates);
        
        if (hiveStatesArray.length === 0) return prev;

        const { updatedHives } = simulatePollinationCycle(
          activeCrops,
          hiveStatesArray,
          currentHour,
          20 // bees per hive
        );

        const newHiveStates: { [hiveId: string]: HiveState } = {};
        updatedHives.forEach(hive => {
          newHiveStates[hive.id] = hive;
        });

        return {
          ...prev,
          hiveStates: newHiveStates,
          lastUpdateTime: new Date(),
          isPollinationActive: true
        };
      });
    }, 15 * 60 * 1000); // Every 15 minutes

    return () => clearInterval(pollinationInterval);
  }, [currentTime, activeCrops, hives, actualAutoFillEnabled]);

  // Reset daily collection at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const resetTimer = setTimeout(() => {
      setProductionState(prev => {
        const newHiveStates: { [hiveId: string]: HiveState } = {};
        
        Object.entries(prev.hiveStates).forEach(([hiveId, hive]) => {
          newHiveStates[hiveId] = resetDailyCollection(hive);
        });

        return {
          ...prev,
          hiveStates: newHiveStates,
          dailyHarvestedCrops: {} // Reset daily harvest tracking
        };
      });
    }, msUntilMidnight);

    return () => clearTimeout(resetTimer);
  }, [currentTime]);

  // Auto-complete batches when they're ready
  useEffect(() => {
    setProductionState(prev => {
      let hasChanges = false;
      const newHiveStates: { [hiveId: string]: HiveState } = {};

      Object.entries(prev.hiveStates).forEach(([hiveId, hive]) => {
        if (hive.currentBatch?.isComplete) {
          newHiveStates[hiveId] = completeBatch(hive);
          hasChanges = true;
        } else {
          newHiveStates[hiveId] = hive;
        }
      });

      return hasChanges 
        ? { ...prev, hiveStates: newHiveStates }
        : prev;
    });
  }, [productionState.hiveStates]);

  const getHiveInfo = useCallback((hiveId: string) => {
    const hive = productionState.hiveStates[hiveId];
    if (!hive) return null;

    return {
      hive,
      summary: getHiveProductionSummary(hive)
    };
  }, [productionState.hiveStates]);

  const recordCropHarvest = useCallback((cropId: string, amount: number = 1) => {
    setProductionState(prev => ({
      ...prev,
      dailyHarvestedCrops: {
        ...prev.dailyHarvestedCrops,
        [cropId]: (prev.dailyHarvestedCrops[cropId] || 0) + amount
      }
    }));
  }, []);

  const getAllActiveSources = useCallback(() => {
    const sources = new Set<string>();
    
    // Add currently planted crops
    activeCrops.forEach(crop => sources.add(crop.cropId));
    
    // Add recently harvested crops
    Object.keys(productionState.dailyHarvestedCrops).forEach(cropId => sources.add(cropId));
    
    return Array.from(sources);
  }, [activeCrops, productionState.dailyHarvestedCrops]);

  const getTotalHoneyProduced = useCallback(() => {
    return Object.values(productionState.hiveStates).reduce((total, hive) => {
      return total + hive.totalHoneyStored + (hive.currentBatch?.amount || 0);
    }, 0);
  }, [productionState.hiveStates]);

  const getProductionStats = useCallback(() => {
    const hives = Object.values(productionState.hiveStates);
    const totalHives = hives.length;
    const activeHives = hives.filter(h => h.currentBatch && h.currentBatch.amount > 0).length;
    const completedBatches = hives.reduce((sum, h) => sum + h.completedBatches.length, 0);
    const activeSources = getAllActiveSources();

    return {
      totalHives,
      activeHives,
      completedBatches,
      totalHoneyProduced: getTotalHoneyProduced(),
      activeSources: activeSources.length,
      sourcesList: activeSources,
      lastUpdate: productionState.lastUpdateTime,
      isPollinationActive: productionState.isPollinationActive
    };
  }, [productionState, getAllActiveSources, getTotalHoneyProduced]);

  return {
    productionState,
    getHiveInfo,
    recordCropHarvest,
    getAllActiveSources,
    getTotalHoneyProduced,
    getProductionStats,
    fastForwardProduction,
    isAutoFillEnabled: actualAutoFillEnabled
  };
}