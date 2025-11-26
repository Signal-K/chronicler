// Order system types

export type OrderType = 'crop' | 'crop-group' | 'nectar';

export type OrderStatus = 'active' | 'completed' | 'expired';

// Merchant with affinity system
export interface Merchant {
  id: string;
  name: string;
  emoji: string;
  description: string;
  affinity: number; // 0-100, affects bonus percentage (10-50%)
  specialties: string[]; // Crop types or categories they prefer
}

// Base order interface
export interface BaseOrder {
  id: string;
  type: OrderType;
  merchantId: string;
  createdAt: number; // Timestamp
  expiresAt: number; // Timestamp
  status: OrderStatus;
  baseReward: number; // Base coins before affinity bonus
  bonusPercentage: number; // 10-50% based on merchant affinity
  totalReward: number; // baseReward + bonus
}

// Single crop order
export interface CropOrder extends BaseOrder {
  type: 'crop';
  cropType: string; // e.g., 'tomato', 'carrot'
  quantity: number;
  cropEmoji: string;
}

// Multiple crop types order (e.g., "3 tomatoes and 2 carrots")
export interface CropGroupOrder extends BaseOrder {
  type: 'crop-group';
  requirements: {
    cropType: string;
    quantity: number;
    cropEmoji: string;
  }[];
}

// Nectar order (requires bottled nectar)
export interface NectarOrder extends BaseOrder {
  type: 'nectar';
  bottlesRequired: number; // Number of bottles (each holds 10 nectar)
}

export type Order = CropOrder | CropGroupOrder | NectarOrder;

// User experience level calculation
export interface UserExperience {
  totalHarvests: number;
  totalClassifications: number;
  uniqueCropsGrown: string[]; // Array of crop type strings
  experienceLevel: number; // 1-10, calculated from the above
}

// Order generation settings
export interface OrderGenerationConfig {
  maxActiveOrders: number; // Default 3
  orderDuration: number; // Hours until expiration, default 24
  difficultyByLevel: {
    [level: number]: {
      minQuantity: number;
      maxQuantity: number;
      allowCropGroups: boolean;
      allowNectar: boolean;
      baseRewardMultiplier: number;
    };
  };
}

// Glass bottle item for nectar
export interface GlassBottle {
  id: 'glass-bottle';
  name: 'Glass Bottle';
  emoji: string; // You'll create SVG icon
  price: number;
  capacity: 10; // Holds 10 nectar
}

// Bottled nectar inventory item
export interface BottledNectar {
  id: 'bottled-nectar';
  name: 'Bottled Nectar';
  emoji: string;
  nectarAmount: 10; // Always full when created
}
