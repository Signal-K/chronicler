// Honey Orders System Types

export type HoneyType = 'light' | 'amber' | 'dark' | 'specialty' | 'wildflower';

export interface HoneyOrder {
  id: string;
  characterName: string;
  characterEmoji: string;
  characterMessage: string;
  honeyType: HoneyType;
  bottlesRequested: number;
  bottlesFulfilled: number;
  coinReward: number;
  xpReward: number;
  isCompleted: boolean;
  isReduced: boolean; // True if reward has been reduced (post-quota)
  createdAt: number;
}

export interface DailyOrdersState {
  orders: HoneyOrder[];
  lastRefreshDate: string; // YYYY-MM-DD format
  fulfilledOrdersCount: Record<HoneyType, number>; // Track how many orders of each type fulfilled today
  quotaPerType: number; // Number of orders per type before reduction (default: 2)
  reductionPercent: number; // Reward reduction after quota (default: 50)
}

export interface OrderCharacter {
  name: string;
  emoji: string;
  messages: string[];
}

// Characters that can request honey orders
export const ORDER_CHARACTERS: OrderCharacter[] = [
  {
    name: 'Farmer Joe',
    emoji: '👨‍🌾',
    messages: [
      "Howdy! My wife loves honey in her tea.",
      "Need some honey for my baked goods!",
      "The farmhands are running low on honey!",
    ],
  },
  {
    name: 'Chef Rosa',
    emoji: '👩‍🍳',
    messages: [
      "I need honey for my special recipe!",
      "My restaurant needs the finest honey!",
      "Customers are asking for more honey dishes!",
    ],
  },
  {
    name: 'Baker Tim',
    emoji: '🧑‍🍳',
    messages: [
      "Honey buns need more honey!",
      "Running low on sweetener for my pastries!",
      "The bakery needs a fresh supply!",
    ],
  },
  {
    name: 'Grandma Bee',
    emoji: '👵',
    messages: [
      "Dearie, I need honey for my grandchildren!",
      "My old recipe calls for this exact honey!",
      "Nothing beats natural honey for my remedies!",
    ],
  },
  {
    name: 'Market Molly',
    emoji: '🧑‍💼',
    messages: [
      "The market stall needs restocking!",
      "Customers keep asking for local honey!",
      "This honey type sells really well!",
    ],
  },
  {
    name: 'Dr. Bloom',
    emoji: '👩‍⚕️',
    messages: [
      "Honey has natural healing properties!",
      "I recommend honey to all my patients!",
      "This type of honey is particularly beneficial!",
    ],
  },
  {
    name: 'Tea Master Li',
    emoji: '🧘',
    messages: [
      "The perfect honey for my tea ceremony!",
      "Balance requires the right sweetness.",
      "My students appreciate quality honey.",
    ],
  },
  {
    name: 'Beekeeper Ben',
    emoji: '🧔',
    messages: [
      "Fellow beekeeper needs some extra stock!",
      "My hives had a rough season, can you help?",
      "Quality recognizes quality!",
    ],
  },
];

// Honey type configurations
export const HONEY_TYPE_CONFIG: Record<HoneyType, {
  name: string;
  emoji: string;
  basePrice: number;
  baseXP: number;
  color: string;
  description: string;
  associatedCrops: string[];
}> = {
  light: {
    name: 'Light Honey',
    emoji: '🍯',
    basePrice: 15,
    baseXP: 10,
    color: '#F8F4E6',
    description: 'Pale, mild honey perfect for delicate dishes',
    associatedCrops: ['tomato'],
  },
  amber: {
    name: 'Amber Honey',
    emoji: '🍯',
    basePrice: 20,
    baseXP: 15,
    color: '#DAA520',
    description: 'Golden honey with robust flavor',
    associatedCrops: ['blueberry', 'sunflower'],
  },
  dark: {
    name: 'Dark Honey',
    emoji: '🍯',
    basePrice: 25,
    baseXP: 20,
    color: '#8B4513',
    description: 'Rich, complex honey with deep flavors',
    associatedCrops: [],
  },
  specialty: {
    name: 'Specialty Honey',
    emoji: '✨',
    basePrice: 35,
    baseXP: 30,
    color: '#F5F0FF',
    description: 'Premium monofloral honey from specific flowers',
    associatedCrops: ['lavender'],
  },
  wildflower: {
    name: 'Wildflower Blend',
    emoji: '🌸',
    basePrice: 18,
    baseXP: 12,
    color: '#FFE4B5',
    description: 'A delightful mix from various flowers',
    associatedCrops: [],
  },
};
