/**
 * Map Types and Configuration
 * Defines the different map/biome types available in the game
 */

export type MapType = 'default' | 'desert' | 'swamp' | 'ocean' | 'forest';

export interface MapMultipliers {
  temperature: number; // Multiplier for temperature (e.g., 1.2 = +20%)
  humidity: number; // Multiplier for humidity (e.g., 0.8 = -20%)
  growthRate: number; // Multiplier for crop growth speed (e.g., 1.1 = +10%)
}

export interface MapData {
  id: MapType;
  name: string;
  description: string;
  icon: string;
  unlockCost: number; // Cost in coins to unlock
  unlocked: boolean;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  multipliers: MapMultipliers;
  textureDescription: string; // Description of the visual style
}

/**
 * Configuration for all available maps
 * Default map is always unlocked
 */
export const MAP_CONFIGS: Record<MapType, Omit<MapData, 'unlocked'>> = {
  default: {
    id: 'default',
    name: 'Home Farm',
    description: 'Your starting farm. Weather based on your location.',
    icon: '🏡',
    unlockCost: 0,
    colors: {
      primary: '#86efac',
      secondary: '#4ade80',
      tertiary: '#22c55e',
    },
    multipliers: {
      temperature: 1.0,
      humidity: 1.0,
      growthRate: 1.0,
    },
    textureDescription: 'Lush green grass with fertile soil',
  },
  desert: {
    id: 'desert',
    name: 'Desert Oasis',
    description: 'Hot and dry. Plants need more water but some thrive here.',
    icon: '🏜️',
    unlockCost: 100,
    colors: {
      primary: '#fef3c7',
      secondary: '#fde68a',
      tertiary: '#fcd34d',
    },
    multipliers: {
      temperature: 1.4,
      humidity: 0.6,
      growthRate: 0.9,
    },
    textureDescription: 'Sandy yellow terrain with sparse vegetation',
  },
  swamp: {
    id: 'swamp',
    name: 'Misty Swamp',
    description: 'Waterlogged and humid. Perfect for water-loving plants.',
    icon: '🌿',
    unlockCost: 100,
    colors: {
      primary: '#6b7280',
      secondary: '#4b5563',
      tertiary: '#374151',
    },
    multipliers: {
      temperature: 0.9,
      humidity: 1.5,
      growthRate: 1.1,
    },
    textureDescription: 'Dark green murky water with moss-covered ground',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Platform',
    description: 'Salty breeze and constant moisture. Unique growing conditions.',
    icon: '🌊',
    unlockCost: 100,
    colors: {
      primary: '#93c5fd',
      secondary: '#60a5fa',
      tertiary: '#3b82f6',
    },
    multipliers: {
      temperature: 1.1,
      humidity: 1.3,
      growthRate: 1.0,
    },
    textureDescription: 'Blue waves with elevated platform structures',
  },
  forest: {
    id: 'forest',
    name: 'Deep Forest',
    description: 'Shaded by tall trees. Cooler with rich soil for hearty crops.',
    icon: '🌲',
    unlockCost: 100,
    colors: {
      primary: '#a7f3d0',
      secondary: '#6ee7b7',
      tertiary: '#34d399',
    },
    multipliers: {
      temperature: 0.8,
      humidity: 1.2,
      growthRate: 1.2,
    },
    textureDescription: 'Light green grass with visible tree roots',
  },
};

/**
 * Get all map types in order
 */
export const MAP_ORDER: MapType[] = ['default', 'desert', 'swamp', 'ocean', 'forest'];
