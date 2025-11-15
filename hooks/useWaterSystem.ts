import { useWater as fetchWater, getWaterConstants, getWaterSystem, updateWater, WaterSystemData } from '../lib/waterSystem';
import { useEffect, useState } from 'react';

/**
 * Hook to manage water system in components
 * @param isRaining - Whether it's currently raining
 */
export function useWaterSystem(isRaining: boolean = false) {
  const [waterData, setWaterData] = useState<WaterSystemData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load water data
  useEffect(() => {
    loadWater();
  }, []);

  // Update water periodically based on time and weather
  useEffect(() => {
    const interval = setInterval(async () => {
        const updated = await updateWater(isRaining);
        setWaterData(updated);
    }, 1000);

    return () => clearInterval(interval)
  }, [isRaining]);

  const loadWater = async () => {
    setLoading(true);
    const data = await getWaterSystem();
    setWaterData(data);
    setLoading(false);
  };

  const consumeWater = async (): Promise<boolean> => {
    const result = await fetchWater();
    if (result === null) {
        return false;
    };

    setWaterData(result);
    return true;
  };

  const constants = getWaterConstants();

  return {
    currentWater: waterData?.currentWater ?? 0,
    maxWater: constants.MAX_WATER,
    waterData,
    loading,
    consumeWater,
    refresh: loadWater,
  };
}
