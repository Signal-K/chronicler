type CropCategory = 'vegetable' | 'fruit' | 'grain' | 'flower';
type HoneyType = 'light' | 'amber' | 'dark' | 'specialty';
type HoneyFlavor = 'mild' | 'floral' | 'robust' | 'distinctive' | 'sweet' | 'complex';

interface NectarProperties {
  /** Whether this crop produces nectar that bees can collect */
  producesNectar: boolean;
  /** Amount of nectar produced per flower visit (0-100) */
  nectarAmount: number;
  /** Quality of nectar (affects honey quality) (0-100) */
  nectarQuality: number;
  /** Honey characteristics from this crop */
  honeyProfile: {
    type: HoneyType;
    flavor: HoneyFlavor;
    color: string; // Hex color or description
    description: string;
  };
  /** Pollen properties */
  pollen: {
    amount: number; // Amount of pollen produced (0-100)
    quality: number; // Pollen quality (0-100)
    color: string; // Pollen color
  };
  /** How attractive this crop is to bees (0-100) */
  beeAttraction: number;
  /** Best time of day for nectar production (0-23 hours) */
  peakNectarHours: [number, number]; // [start, end]
}

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
  /** Growth stage images - require() of image files for each growth stage */
  growthImages: any[]; // [seed/sprout, young, mature, ready]
  /** Nectar and honey production properties */
  nectar: NectarProperties;
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
    growthImages: [
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Tomato.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 25, // Tomatoes are not major nectar producers
      nectarQuality: 55,
      honeyProfile: {
        type: 'light',
        flavor: 'mild',
        color: '#F8F4E6', // Very pale, almost white honey
        description: 'Rare, mild honey with herbaceous undertones - tomato flowers produce minimal nectar but create a distinctive light honey when available'
      },
      pollen: {
        amount: 65, // Tomatoes produce more pollen than nectar
        quality: 70,
        color: '#FFF200' // Bright yellow tomato pollen
      },
      beeAttraction: 40, // Lower attraction due to minimal nectar
      peakNectarHours: [9, 11] // Short window, tomato flowers open briefly
    },
  },
  blueberry: {
    id: 'blueberry',
    name: 'Blueberry',
    category: 'fruit',
    emoji: '🫐',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 3 },
      seeds: { min: 0, max: 2 },
    },
    growthImages: [
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Blueberry.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 85, // Blueberries are excellent nectar producers
      nectarQuality: 95,
      honeyProfile: {
        type: 'amber',
        flavor: 'distinctive',
        color: '#E8D5B7', // Light amber with reddish tint
        description: 'Premium amber honey with complex fruity undertones and a hint of tartness - prized by beekeepers for its exceptional flavor profile'
      },
      pollen: {
        amount: 75,
        quality: 85,
        color: '#D4AF37' // Golden pollen from blueberry flowers
      },
      beeAttraction: 90, // Very attractive to bees
      peakNectarHours: [6, 10] // Early morning peak production
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    category: 'flower',
    emoji: '🌸',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 1 },
      seeds: { min: 1, max: 2 },
    },
    growthImages: [
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Lavender.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 95, // Lavender is one of the best nectar producers
      nectarQuality: 98,
      honeyProfile: {
        type: 'specialty',
        flavor: 'floral',
        color: '#F5F0FF', // Very pale lavender-white
        description: 'Exquisite monofloral honey with intense floral aroma and therapeutic properties - considered among the finest honeys with notes of fresh herbs and flowers'
      },
      pollen: {
        amount: 80,
        quality: 95,
        color: '#C8A2C8' // Light purple lavender pollen
      },
      beeAttraction: 100, // Maximum attraction - lavender is a bee magnet
      peakNectarHours: [5, 11] // Long production window, peak in early morning
    },
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
    growthImages: [
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Sunflower.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 90, // Sunflowers are major nectar producers
      nectarQuality: 85,
      honeyProfile: {
        type: 'amber',
        flavor: 'robust',
        color: '#DAA520', // Golden amber color
        description: 'Full-bodied amber honey with a rich, nutty flavor and bright golden color - sunflower honey crystallizes quickly and has a distinctive granular texture'
      },
      pollen: {
        amount: 100, // Sunflowers produce massive amounts of pollen
        quality: 80,
        color: '#FFD700' // Bright golden sunflower pollen
      },
      beeAttraction: 95, // Very high attraction
      peakNectarHours: [7, 14] // Long production window following the sun
    },
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
 * Get honey blend information from multiple crop sources
 */
export function calculateHoneyBlend(cropSources: { [cropId: string]: number }): {
  dominantHoney: CropConfig['nectar']['honeyProfile'];
  blendDescription: string;
  averageQuality: number;
} {
  const crops = Object.entries(cropSources)
    .map(([cropId, amount]) => ({ config: getCropConfig(cropId), amount }))
    .filter(({ config }) => config && config.nectar.producesNectar);

  if (crops.length === 0) {
    return {
      dominantHoney: {
        type: 'light',
        flavor: 'mild',
        color: '#F5E6A8',
        description: 'No nectar sources available'
      },
      blendDescription: 'No active nectar production',
      averageQuality: 0
    };
  }

  // Find dominant source (highest amount)
  const dominant = crops.reduce((prev, curr) => 
    curr.amount > prev.amount ? curr : prev
  );

  // Calculate average quality
  const totalAmount = crops.reduce((sum, { amount }) => sum + amount, 0);
  const averageQuality = crops.reduce((sum, { config, amount }) => 
    sum + (config!.nectar.nectarQuality * (amount / totalAmount)), 0
  );

  // Create blend description
  const sourceNames = crops
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map(({ config }) => config!.name)
    .join(', ');

  const blendDescription = crops.length === 1 
    ? `Pure ${dominant.config!.name.toLowerCase()} honey`
    : `Wildflower blend from ${sourceNames}${crops.length > 3 ? ' and others' : ''}`;

  return {
    dominantHoney: dominant.config!.nectar.honeyProfile,
    blendDescription,
    averageQuality
  };
}
