import AsyncStorage from '@react-native-async-storage/async-storage';

const WATER_STORAGE_KEY = 'water_system';
const MAX_WATER = 100;
const HOURLY_REFILL_RATE = 100; // Full refill every hour
const RAIN_REFILL_RATE = 10; // 10 water per minute when raining
const WATER_USAGE_PER_ACTION = 1; // Using watering can costs 1 water

export interface WaterSystemData {
  currentWater: number;
  lastUpdated: number; // timestamp in ms
  lastHourlyRefill: number; // timestamp in ms
}

/**
 * Initialize or load water system from storage
 */
export async function getWaterSystem(): Promise<WaterSystemData> {
  try {
    const data = await AsyncStorage.getItem(WATER_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load water system:', error);
  }

  // Default initial state
  const now = Date.now();
  return {
    currentWater: MAX_WATER,
    lastUpdated: now,
    lastHourlyRefill: now,
  };
}

/**
 * Save water system to storage
 */
export async function saveWaterSystem(data: WaterSystemData): Promise<void> {
  try {
    await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save water system:', error);
  }
}

/**
 * Update water based on elapsed time and weather
 * @param isRaining - Whether it's currently raining at user's location
 * @returns Updated water system data
 */
export async function updateWater(isRaining: boolean = false): Promise<WaterSystemData> {
    const data = await getWaterSystem();
    const now = Date.now();

    const timeElapsed = now - data.lastUpdated;
    const timeSinceHourlyRefill = now - data.lastHourlyRefill;
    let newWater = data.currentWater;
    let newLastHourlyRefill = data.lastHourlyRefill;

    if (timeSinceHourlyRefill >= 3600000) {
        newWater = MAX_WATER;
        newLastHourlyRefill = now;
    } else if (isRaining) {
        const minutesElapsed = timeElapsed / 60000;
        const rainRefill = RAIN_REFILL_RATE * minutesElapsed;
        newWater = Math.min(MAX_WATER, newWater + rainRefill);
    };

    const updatedData: WaterSystemData = {
        currentWater: newWater,
        lastUpdated: now,
        lastHourlyRefill: newLastHourlyRefill,
    };

    await saveWaterSystem(updatedData);
    return updatedData;
};

/**
 * Use water (when watering plants)
 * @returns Updated water system data, or null if not enough water
 */
export async function useWater(): Promise<WaterSystemData | null> {
    const data = await getWaterSystem();
    if (data.currentWater < WATER_USAGE_PER_ACTION) {
        return null;
    };

    const updatedData: WaterSystemData = {
        currentWater: data.currentWater - WATER_USAGE_PER_ACTION,
        lastUpdated: Date.now(),
        lastHourlyRefill: data.lastHourlyRefill,
    };

    await saveWaterSystem(updatedData);
    return updatedData;
};

/**
 * Get constants for UI display or other calculations
 */
export function getWaterConstants() {
  return {
    MAX_WATER,
    HOURLY_REFILL_RATE,
    RAIN_REFILL_RATE,
    WATER_USAGE_PER_ACTION,
  };
}
