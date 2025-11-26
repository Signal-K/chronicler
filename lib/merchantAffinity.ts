import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Merchant } from '../types/orders';

const MERCHANT_AFFINITY_KEY = 'merchant_affinity';

// Predefined merchants with their specialties
export const MERCHANTS: Merchant[] = [
  {
    id: 'baker',
    name: 'The Village Baker',
    emoji: '👨‍🍳',
    description: 'Loves wheat and grains for baking',
    affinity: 0,
    specialties: ['wheat', 'corn'],
  },
  {
    id: 'chef',
    name: 'The Town Chef',
    emoji: '👩‍🍳',
    description: 'Needs fresh vegetables for cooking',
    affinity: 0,
    specialties: ['tomato', 'carrot', 'lettuce', 'potato'],
  },
  {
    id: 'beekeeper',
    name: 'Master Beekeeper',
    emoji: '🧑‍🌾',
    description: 'Specializes in honey and nectar products',
    affinity: 0,
    specialties: ['nectar'],
  },
  {
    id: 'merchant',
    name: 'General Merchant',
    emoji: '🧑‍💼',
    description: 'Buys and sells everything',
    affinity: 0,
    specialties: ['tomato', 'carrot', 'wheat', 'corn', 'lettuce', 'potato'],
  },
  {
    id: 'herbalist',
    name: 'The Herbalist',
    emoji: '🧙',
    description: 'Interested in rare and special crops',
    affinity: 0,
    specialties: ['lavender', 'mint', 'basil'],
  },
];

/**
 * Calculate bonus percentage based on affinity (0-100 affinity -> 10-50% bonus)
 */
export function calculateAffinityBonus(affinity: number): number {
  // Linear scale: 0 affinity = 10%, 100 affinity = 50%
  const minBonus = 10;
  const maxBonus = 50;
  const bonus = minBonus + (affinity / 100) * (maxBonus - minBonus);
  return Math.round(bonus);
}

/**
 * Load merchant affinity levels from storage
 */
export async function loadMerchantAffinity(): Promise<Record<string, number>> {
  try {
    const stored = await AsyncStorage.getItem(MERCHANT_AFFINITY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading merchant affinity:', error);
  }
  
  // Default: all merchants start at 0 affinity
  const defaultAffinity: Record<string, number> = {};
  MERCHANTS.forEach(merchant => {
    defaultAffinity[merchant.id] = 0;
  });
  return defaultAffinity;
}

/**
 * Save merchant affinity levels to storage
 */
export async function saveMerchantAffinity(affinity: Record<string, number>): Promise<void> {
  try {
    await AsyncStorage.setItem(MERCHANT_AFFINITY_KEY, JSON.stringify(affinity));
  } catch (error) {
    console.error('Error saving merchant affinity:', error);
  }
}

/**
 * Increase affinity with a merchant when completing an order
 * Affinity increases by 2-5 points per order depending on complexity
 */
export async function increaseAffinity(merchantId: string, points: number = 3): Promise<void> {
  const affinity = await loadMerchantAffinity();
  const currentAffinity = affinity[merchantId] || 0;
  affinity[merchantId] = Math.min(100, currentAffinity + points);
  await saveMerchantAffinity(affinity);
}

/**
 * Get all merchants with their current affinity levels
 */
export async function getMerchantsWithAffinity(): Promise<Merchant[]> {
  const affinityLevels = await loadMerchantAffinity();
  
  return MERCHANTS.map(merchant => ({
    ...merchant,
    affinity: affinityLevels[merchant.id] || 0,
  }));
}

/**
 * Get a specific merchant with current affinity
 */
export async function getMerchant(merchantId: string): Promise<Merchant | null> {
  const merchants = await getMerchantsWithAffinity();
  return merchants.find(m => m.id === merchantId) || null;
}

/**
 * Select appropriate merchant for an order based on crop types
 * Merchants with matching specialties are preferred
 */
export function selectMerchantForOrder(cropTypes: string[]): Merchant {
  // Find merchants whose specialties match the crop types
  const matchingMerchants = MERCHANTS.filter(merchant =>
    cropTypes.some(crop => merchant.specialties.includes(crop))
  );
  
  if (matchingMerchants.length > 0) {
    // Randomly select from matching merchants
    return matchingMerchants[Math.floor(Math.random() * matchingMerchants.length)];
  }
  
  // Fallback to general merchant
  return MERCHANTS.find(m => m.id === 'merchant') || MERCHANTS[0];
}
