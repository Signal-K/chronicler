import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CropGroupOrder, CropOrder, NectarOrder, Order } from '../types/orders';
import { CROP_CONFIGS } from './cropConfig';
import { calculateAffinityBonus, getMerchantsWithAffinity, selectMerchantForOrder } from './merchantAffinity';
import { getUserExperienceLevel } from './userExperience';

const ORDERS_STORAGE_KEY = 'active_orders';
const LAST_ORDER_GENERATION_KEY = 'last_order_generation';

const MAX_ACTIVE_ORDERS = 3;
const ORDER_DURATION_HOURS = 24;

// Difficulty configuration based on experience level
const DIFFICULTY_CONFIG = {
  1: { minQty: 1, maxQty: 2, allowGroups: false, allowNectar: false, baseRewardMultiplier: 1 },
  2: { minQty: 1, maxQty: 3, allowGroups: false, allowNectar: false, baseRewardMultiplier: 1.1 },
  3: { minQty: 2, maxQty: 4, allowGroups: true, allowNectar: false, baseRewardMultiplier: 1.2 },
  4: { minQty: 2, maxQty: 5, allowGroups: true, allowNectar: false, baseRewardMultiplier: 1.3 },
  5: { minQty: 3, maxQty: 6, allowGroups: true, allowNectar: true, baseRewardMultiplier: 1.4 },
  6: { minQty: 3, maxQty: 7, allowGroups: true, allowNectar: true, baseRewardMultiplier: 1.5 },
  7: { minQty: 4, maxQty: 8, allowGroups: true, allowNectar: true, baseRewardMultiplier: 1.6 },
  8: { minQty: 4, maxQty: 10, allowGroups: true, allowNectar: true, baseRewardMultiplier: 1.7 },
  9: { minQty: 5, maxQty: 12, allowGroups: true, allowNectar: true, baseRewardMultiplier: 1.8 },
  10: { minQty: 5, maxQty: 15, allowGroups: true, allowNectar: true, baseRewardMultiplier: 2.0 },
};

/**
 * Load active orders from storage
 */
export async function loadActiveOrders(): Promise<Order[]> {
  try {
    const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      const orders = JSON.parse(stored);
      // Filter out expired orders
      const now = Date.now();
      const activeOrders = orders.filter((order: Order) => order.expiresAt > now);
      
      // If we filtered any out, save the updated list
      if (activeOrders.length !== orders.length) {
        await saveActiveOrders(activeOrders);
      }
      
      return activeOrders;
    }
  } catch (error) {
    console.error('Error loading active orders:', error);
  }
  return [];
}

/**
 * Save active orders to storage
 */
export async function saveActiveOrders(orders: Order[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving active orders:', error);
  }
}

/**
 * Generate a single crop order
 */
async function generateCropOrder(experienceLevel: number): Promise<CropOrder> {
  const config = DIFFICULTY_CONFIG[experienceLevel as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[1];
  
  // Get random crop
  const cropKeys = Object.keys(CROP_CONFIGS);
  const randomCrop = cropKeys[Math.floor(Math.random() * cropKeys.length)];
  const cropConfig = CROP_CONFIGS[randomCrop];
  
  // Select appropriate merchant
  const merchant = selectMerchantForOrder([randomCrop]);
  const merchants = await getMerchantsWithAffinity();
  const merchantWithAffinity = merchants.find(m => m.id === merchant.id) || merchant;
  
  const quantity = Math.floor(Math.random() * (config.maxQty - config.minQty + 1)) + config.minQty;
  const baseReward = Math.round(cropConfig.sellPrice * quantity * config.baseRewardMultiplier);
  const bonusPercentage = calculateAffinityBonus(merchantWithAffinity.affinity);
  const totalReward = Math.round(baseReward * (1 + bonusPercentage / 100));
  
  const now = Date.now();
  
  return {
    id: `order_${now}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'crop',
    merchantId: merchant.id,
    createdAt: now,
    expiresAt: now + (ORDER_DURATION_HOURS * 60 * 60 * 1000),
    status: 'active',
    baseReward,
    bonusPercentage,
    totalReward,
    cropType: randomCrop,
    quantity,
    cropEmoji: cropConfig.emoji,
  };
}

/**
 * Generate a crop group order (multiple crop types)
 */
async function generateCropGroupOrder(experienceLevel: number): Promise<CropGroupOrder> {
  const config = DIFFICULTY_CONFIG[experienceLevel as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[1];
  
  // Get 2-3 different crops
  const cropKeys = Object.keys(CROP_CONFIGS);
  const numCrops = Math.random() > 0.5 ? 2 : 3;
  const selectedCrops: string[] = [];
  
  while (selectedCrops.length < numCrops) {
    const crop = cropKeys[Math.floor(Math.random() * cropKeys.length)];
    if (!selectedCrops.includes(crop)) {
      selectedCrops.push(crop);
    }
  }
  
  // Select appropriate merchant
  const merchant = selectMerchantForOrder(selectedCrops);
  const merchants = await getMerchantsWithAffinity();
  const merchantWithAffinity = merchants.find(m => m.id === merchant.id) || merchant;
  
  const requirements = selectedCrops.map(cropType => {
    const cropConfig = CROP_CONFIGS[cropType];
    const quantity = Math.floor(Math.random() * (config.maxQty - config.minQty + 1)) + config.minQty;
    return {
      cropType,
      quantity,
      cropEmoji: cropConfig.emoji,
    };
  });
  
  const baseReward = Math.round(
    requirements.reduce((sum, req) => {
      return sum + (CROP_CONFIGS[req.cropType].sellPrice * req.quantity);
    }, 0) * config.baseRewardMultiplier * 1.2 // 20% bonus for group orders
  );
  
  const bonusPercentage = calculateAffinityBonus(merchantWithAffinity.affinity);
  const totalReward = Math.round(baseReward * (1 + bonusPercentage / 100));
  
  const now = Date.now();
  
  return {
    id: `order_${now}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'crop-group',
    merchantId: merchant.id,
    createdAt: now,
    expiresAt: now + (ORDER_DURATION_HOURS * 60 * 60 * 1000),
    status: 'active',
    baseReward,
    bonusPercentage,
    totalReward,
    requirements,
  };
}

/**
 * Generate a nectar order
 */
async function generateNectarOrder(experienceLevel: number): Promise<NectarOrder> {
  const config = DIFFICULTY_CONFIG[experienceLevel as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[1];
  
  // Select beekeeper merchant
  const merchants = await getMerchantsWithAffinity();
  const beekeeper = merchants.find(m => m.id === 'beekeeper') || merchants[0];
  
  const bottlesRequired = Math.floor(Math.random() * (config.maxQty - config.minQty + 1)) + config.minQty;
  
  // Nectar is valuable: 50 coins per bottle base price
  const baseReward = Math.round(50 * bottlesRequired * config.baseRewardMultiplier);
  const bonusPercentage = calculateAffinityBonus(beekeeper.affinity);
  const totalReward = Math.round(baseReward * (1 + bonusPercentage / 100));
  
  const now = Date.now();
  
  return {
    id: `order_${now}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'nectar',
    merchantId: beekeeper.id,
    createdAt: now,
    expiresAt: now + (ORDER_DURATION_HOURS * 60 * 60 * 1000),
    status: 'active',
    baseReward,
    bonusPercentage,
    totalReward,
    bottlesRequired,
  };
}

/**
 * Generate new orders based on user experience level
 */
export async function generateNewOrders(): Promise<Order[]> {
  const activeOrders = await loadActiveOrders();
  const availableSlots = MAX_ACTIVE_ORDERS - activeOrders.length;
  
  console.log('📊 Active orders:', activeOrders.length, '| Available slots:', availableSlots);
  
  if (availableSlots <= 0) {
    console.log('🚫 No slots available');
    return []; // No slots available
  }
  
  const experienceLevel = await getUserExperienceLevel();
  console.log('📈 User experience level:', experienceLevel);
  const config = DIFFICULTY_CONFIG[experienceLevel as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[1];
  
  const newOrders: Order[] = [];
  
  for (let i = 0; i < availableSlots; i++) {
    let order: Order;
    
    // Determine order type based on level and randomness
    const rand = Math.random();
    
    if (config.allowNectar && rand < 0.2) {
      // 20% chance of nectar order (if unlocked)
      order = await generateNectarOrder(experienceLevel);
    } else if (config.allowGroups && rand < 0.5) {
      // 30% chance of group order (if unlocked)
      order = await generateCropGroupOrder(experienceLevel);
    } else {
      // 50% chance of single crop order
      order = await generateCropOrder(experienceLevel);
    }
    
    newOrders.push(order);
  }
  
  const allOrders = [...activeOrders, ...newOrders];
  await saveActiveOrders(allOrders);
  
  return newOrders;
}

/**
 * Check if it's time to generate new orders (top of the hour)
 * Returns true if orders should be generated
 */
export async function shouldGenerateOrders(): Promise<boolean> {
  try {
    const lastGeneration = await AsyncStorage.getItem(LAST_ORDER_GENERATION_KEY);
    const now = new Date();
    const currentHour = now.getHours();
    
    if (!lastGeneration) {
      return true;
    }
    
    const lastDate = new Date(parseInt(lastGeneration));
    const lastHour = lastDate.getHours();
    
    // Generate if it's a new hour and we have available slots
    if (currentHour !== lastHour) {
      const activeOrders = await loadActiveOrders();
      return activeOrders.length < MAX_ACTIVE_ORDERS;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking order generation:', error);
    return false;
  }
}

/**
 * Mark that orders were generated at this time
 */
export async function markOrdersGenerated(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_ORDER_GENERATION_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error marking orders generated:', error);
  }
}

/**
 * Main function to check and generate orders if needed
 * Call this periodically (e.g., when app opens or every minute)
 */
export async function checkAndGenerateOrders(): Promise<Order[]> {
  const should = await shouldGenerateOrders();
  
  if (should) {
    console.log('📦 Generating new orders...');
    const newOrders = await generateNewOrders();
    console.log('✅ Generated', newOrders.length, 'new orders');
    await markOrdersGenerated();
    return newOrders;
  }
  console.log('⏸️  Not generating orders (time not right or slots full)');
  return [];
}
