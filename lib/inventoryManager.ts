import AsyncStorage from '@react-native-async-storage/async-storage';

const INVENTORY_STORAGE_KEY = 'game_inventory';

export interface InventoryData {
  coins: number;
  seeds: Record<string, number>;
  crops: Record<string, number>; // Renamed from 'harvested' for clarity
  tools: string[]; // List of owned tools
  expansions: number; // Number of plot expansions
}

const DEFAULT_INVENTORY: InventoryData = {
  coins: 100,
  seeds: {
    tomato: 5,
    carrot: 5,
    wheat: 5,
    corn: 5,
  },
  crops: {},
  tools: [],
  expansions: 0,
};

/**
 * Load inventory from AsyncStorage
 */
export async function loadInventory(): Promise<InventoryData> {
  try {
    const data = await AsyncStorage.getItem(INVENTORY_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load inventory:', error);
  }
  return { ...DEFAULT_INVENTORY };
}

/**
 * Save inventory to AsyncStorage
 */
export async function saveInventory(inventory: InventoryData): Promise<void> {
  try {
    await AsyncStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  } catch (error) {
    console.error('Failed to save inventory:', error);
  }
}

/**
 * Consume items when planting
 * Returns updated inventory or null if insufficient items
 */
export function consumePlantingItems(
  inventory: InventoryData,
  cropId: string,
  requirementType: 'seed' | 'crop'
): InventoryData | null {
    const newInventory = {
        ...inventory,
        seeds: { ...inventory.seeds },
        crops: { ...inventory.crops },
    };

    if (requirementType === 'seed') {
        if ((newInventory.seeds[cropId] || 0) < 1) {
            return null;
        };

        newInventory.seeds[cropId] = newInventory.seeds[cropId] - 1;
    } else {
        if ((newInventory.crops[cropId] || 0) < 1) {
            return null;
        };
        newInventory.crops[cropId] = newInventory.crops[cropId] - 1;
    };

    return newInventory;
};

/**
 * Add harvested items to inventory
 */
export function addHarvestedItems(
  inventory: InventoryData,
  cropId: string,
  cropCount: number,
  seedCount: number
): InventoryData {
  return {
    ...inventory,
    seeds: {
      ...inventory.seeds,
      [cropId]: (inventory.seeds[cropId] || 0) + seedCount,
    },
    crops: {
      ...inventory.crops,
      [cropId]: (inventory.crops[cropId] || 0) + cropCount,
    },
  };
};

/**
 * Add coins to inventory
 */
export function addCoins(inventory: InventoryData, amount: number): InventoryData {
  return {
    ...inventory,
    coins: inventory.coins + amount,
  };
}

/**
 * Remove coins from inventory
 * Returns updated inventory or null if insufficient coins
 */
export function removeCoins(inventory: InventoryData, amount: number): InventoryData | null {
  if (inventory.coins < amount) {
    return null;
  }

  return {
    ...inventory,
    coins: inventory.coins - amount,
  };
}

/**
 * Sell a crop for coins
 * Returns updated inventory or null if insufficient crops
 */
export function sellCrop(
  inventory: InventoryData,
  cropId: string,
  sellPrice: number
): InventoryData | null {
    if ((inventory.crops[cropId] || 0) < 1) {
        return null;
    };

    return {
        ...inventory,
        crops: {
            ...inventory.crops,
            [cropId]: inventory.crops[cropId] - 1,
        },
        coins: inventory.coins + sellPrice,
    };
};