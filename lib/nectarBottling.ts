import type { InventoryData } from '../hooks/useGameState';

const BOTTLE_CAPACITY = 10;

/**
 * Attempt to bottle nectar from available hive nectar
 * Consumes 1 glass bottle, removes 10 nectar from hives, adds 1 bottled nectar
 * Returns updated inventory and remaining nectar, or null if cannot bottle
 */
export function bottleNectar(
  inventory: InventoryData,
  hiveNectarLevels: Record<string, number>
): {
  updatedInventory: InventoryData;
  updatedNectarLevels: Record<string, number>;
} | null {
  // Check if user has glass bottles
  const bottles = (inventory.items || {}).glass_bottle || 0;
  if (bottles < 1) {
    return null;
  }

  // Calculate total available nectar across all hives
  const totalNectar = Object.values(hiveNectarLevels).reduce((sum, level) => sum + level, 0);
  
  if (totalNectar < BOTTLE_CAPACITY) {
    return null; // Not enough nectar
  }

  // Remove nectar from hives (starting from first hive with nectar)
  const updatedNectarLevels = { ...hiveNectarLevels };
  let nectarToRemove = BOTTLE_CAPACITY;
  
  // Sort hive IDs to ensure consistent removal order
  const hiveIds = Object.keys(updatedNectarLevels).sort();
  
  for (const hiveId of hiveIds) {
    if (nectarToRemove <= 0) break;
    
    const available = updatedNectarLevels[hiveId] || 0;
    const toTake = Math.min(available, nectarToRemove);
    
    updatedNectarLevels[hiveId] = available - toTake;
    nectarToRemove -= toTake;
  }

  // Update inventory
  const updatedInventory: InventoryData = {
    ...inventory,
    items: {
      ...(inventory.items || {}),
      glass_bottle: bottles - 1,
      bottled_nectar: ((inventory.items || {}).bottled_nectar || 0) + 1,
    },
  };

  return {
    updatedInventory,
    updatedNectarLevels,
  };
}

/**
 * Check if user can bottle nectar
 */
export function canBottleNectar(
  inventory: InventoryData,
  hiveNectarLevels: Record<string, number>
): boolean {
  const bottles = (inventory.items || {}).glass_bottle || 0;
  const totalNectar = Object.values(hiveNectarLevels).reduce((sum, level) => sum + level, 0);
  
  return bottles >= 1 && totalNectar >= BOTTLE_CAPACITY;
}

/**
 * Get total available nectar across all hives
 */
export function getTotalNectar(hiveNectarLevels: Record<string, number>): number {
  return Object.values(hiveNectarLevels).reduce((sum, level) => sum + level, 0);
}
