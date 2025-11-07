export type CropCategory = 'vegetable' | 'fruit' | 'grain' | 'flower';

export interface CropConfig {
  id: string;
  name: string;
  category: CropCategory;
  emoji: string;
  /** What you need to plant this crop */
  plantRequirement: {
    type: 'seed' | 'crop'; // Some crops plant from seeds, others from the crop itself
    amount: 1; // Always 1 for now
  };
  /** What you get when harvesting */
  harvestYield: {
    crop: {
      min: number;
      max: number;
    };
    seeds?: { // Some crops don't produce seeds
      min: number;
      max: number;
    };
  };
  /** Sell price per unit */
  sellPrice: number;
  /** Growth stages emojis */
  growthEmojis: [string, string, string, string]; // [sprout, young, mature, ready]
}

export const CROP_CONFIGS: Record<string, CropConfig> = {
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    category: 'fruit',
    emoji: '🍅',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 1 },
      seeds: { min: 1, max: 3 },
    },
    sellPrice: 15,
    growthEmojis: ['🌱', '🌿', '🪴', '🍅'],
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    category: 'vegetable',
    emoji: '🥕',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 2, max: 3 }, // Vegetables give more crops, no seeds
      seeds: undefined,
    },
    sellPrice: 12,
    growthEmojis: ['🌱', '🌿', '🪴', '🥕'],
  },
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    category: 'grain',
    emoji: '🌾',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 2 },
      seeds: { min: 2, max: 4 }, // Grains produce lots of seeds
    },
    sellPrice: 8,
    growthEmojis: ['🌱', '🌿', '🪴', '🌾'],
  },
  corn: {
    id: 'corn',
    name: 'Corn',
    category: 'vegetable',
    emoji: '🌽',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 2, max: 3 },
      seeds: undefined,
    },
    sellPrice: 10,
    growthEmojis: ['🌱', '🌿', '🪴', '🌽'],
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    category: 'flower',
    emoji: '🌻',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 1 },
      seeds: { min: 2, max: 3 },
    },
    sellPrice: 20,
    growthEmojis: ['🌱', '🌿', '🪴', '🌻'],
  },
};

/**
 * Get crop configuration by ID
 */
export function getCropConfig(cropId: string): CropConfig | undefined {
  return CROP_CONFIGS[cropId];
}

/**
 * Check if player can plant a crop
 */
export function canPlantCrop(cropId: string, inventory: any): boolean {
  const config = getCropConfig(cropId);
  if (!config) return false;

  if (config.plantRequirement.type === 'seed') {
    return (inventory.seeds[cropId] || 0) >= config.plantRequirement.amount;
  } else {
    return (inventory.harvested[cropId] || 0) >= config.plantRequirement.amount;
  }
}

/**
 * Get a random number between min and max (inclusive)
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate harvest rewards for a crop
 */
export function calculateHarvestRewards(cropId: string): {
  crops: number;
  seeds: number;
} {
  const config = getCropConfig(cropId);
  if (!config) {
    return { crops: 0, seeds: 0 };
  }

  const crops = randomBetween(config.harvestYield.crop.min, config.harvestYield.crop.max);
  const seeds = config.harvestYield.seeds 
    ? randomBetween(config.harvestYield.seeds.min, config.harvestYield.seeds.max)
    : 0;

  return { crops, seeds };
}
