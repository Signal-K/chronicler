import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  DailyOrdersState,
  HONEY_TYPE_CONFIG,
  HoneyOrder,
  HoneyType,
  ORDER_CHARACTERS,
} from '../types/honeyOrders';
import type { BottledHoney } from '../types/inventory';

const ORDERS_STORAGE_KEY = 'honey_orders';
const ORDERS_PER_DAY = 3;
const QUOTA_PER_TYPE = 2; // Number of orders of each honey type before reward reduction
const REDUCTION_PERCENT = 50; // 50% reduction after quota

interface FulfillOrderResult {
  success: boolean;
  coinsEarned: number;
  xpEarned: number;
  message: string;
  wasReduced: boolean;
}

export function useHoneyOrders() {
  const [ordersState, setOrdersState] = useState<DailyOrdersState>({
    orders: [],
    lastRefreshDate: '',
    fulfilledOrdersCount: { light: 0, amber: 0, dark: 0, specialty: 0, wildflower: 0 },
    quotaPerType: QUOTA_PER_TYPE,
    reductionPercent: REDUCTION_PERCENT,
  });
  const [loaded, setLoaded] = useState(false);

  // Get today's date as string
  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Generate a random honey order
  const generateOrder = useCallback((
    userHoneyStock: BottledHoney[] = [],
    farmingHistory: string[] = [],
    forceType?: HoneyType
  ): HoneyOrder => {
    // Select character
    const character = ORDER_CHARACTERS[Math.floor(Math.random() * ORDER_CHARACTERS.length)];
    const message = character.messages[Math.floor(Math.random() * character.messages.length)];

    // Determine honey type
    let honeyType: HoneyType;
    
    if (forceType) {
      honeyType = forceType;
    } else {
      const honeyTypes: HoneyType[] = ['light', 'amber', 'dark', 'specialty', 'wildflower'];
      honeyType = honeyTypes[Math.floor(Math.random() * honeyTypes.length)];
    }

    // Determine quantity (1-5 bottles)
    const bottlesRequested = Math.floor(Math.random() * 5) + 1;

    // Calculate rewards
    const config = HONEY_TYPE_CONFIG[honeyType];
    const coinReward = config.basePrice * bottlesRequested;
    const xpReward = config.baseXP * bottlesRequested;

    return {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      characterName: character.name,
      characterEmoji: character.emoji,
      characterMessage: message,
      honeyType,
      bottlesRequested,
      bottlesFulfilled: 0,
      coinReward,
      xpReward,
      isCompleted: false,
      isReduced: false,
      createdAt: Date.now(),
    };
  }, []);

  // Generate daily orders with at least one matching user's stock or likely production
  const generateDailyOrders = useCallback((
    userHoneyStock: BottledHoney[] = [],
    farmingHistory: string[] = []
  ): HoneyOrder[] => {
    const orders: HoneyOrder[] = [];
    
    // Determine what honey types the user likely has or will produce
    const likelyHoneyTypes: HoneyType[] = [];
    
    // Check current stock
    userHoneyStock.forEach(bottle => {
      const type = bottle.type as HoneyType;
      if (!likelyHoneyTypes.includes(type)) {
        likelyHoneyTypes.push(type);
      }
    });

    // Check farming history for associated honey types
    Object.entries(HONEY_TYPE_CONFIG).forEach(([type, config]) => {
      const hasAssociatedCrop = config.associatedCrops.some(crop => 
        farmingHistory.includes(crop)
      );
      if (hasAssociatedCrop && !likelyHoneyTypes.includes(type as HoneyType)) {
        likelyHoneyTypes.push(type as HoneyType);
      }
    });

    // If user has no history, default to wildflower
    if (likelyHoneyTypes.length === 0) {
      likelyHoneyTypes.push('wildflower');
    }

    // First order: guaranteed to match user's stock/history
    const matchingType = likelyHoneyTypes[Math.floor(Math.random() * likelyHoneyTypes.length)];
    orders.push(generateOrder(userHoneyStock, farmingHistory, matchingType));

    // Remaining orders: random
    for (let i = 1; i < ORDERS_PER_DAY; i++) {
      orders.push(generateOrder(userHoneyStock, farmingHistory));
    }

    return orders;
  }, [generateOrder]);

  // Load orders from storage
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) {
          const parsed: DailyOrdersState = JSON.parse(stored);
          
          // Check if we need to refresh (new day)
          const today = getTodayString();
          if (parsed.lastRefreshDate === today) {
            setOrdersState(parsed);
          } else {
            // New day - orders will be generated when user provides their stock
            setOrdersState({
              orders: [],
              lastRefreshDate: today,
              fulfilledOrdersCount: { light: 0, amber: 0, dark: 0, specialty: 0, wildflower: 0 },
              quotaPerType: QUOTA_PER_TYPE,
              reductionPercent: REDUCTION_PERCENT,
            });
          }
        }
      } catch (error) {
        console.error('Error loading honey orders:', error);
      } finally {
        setLoaded(true);
      }
    };

    loadOrders();
  }, [getTodayString]);

  // Save orders to storage
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersState));
    }
  }, [ordersState, loaded]);

  // Refresh orders for the day
  const refreshDailyOrders = useCallback((
    userHoneyStock: BottledHoney[] = [],
    farmingHistory: string[] = []
  ) => {
    const today = getTodayString();
    
    // Only refresh if it's a new day or no orders exist
    if (ordersState.lastRefreshDate === today && ordersState.orders.length > 0) {
      return;
    }

    const newOrders = generateDailyOrders(userHoneyStock, farmingHistory);
    
    setOrdersState(prev => ({
      ...prev,
      orders: newOrders,
      lastRefreshDate: today,
      fulfilledOrdersCount: { light: 0, amber: 0, dark: 0, specialty: 0, wildflower: 0 },
    }));
  }, [ordersState.lastRefreshDate, ordersState.orders.length, getTodayString, generateDailyOrders]);

  // Check if reward should be reduced
  const shouldReduceReward = useCallback((honeyType: HoneyType): boolean => {
    return ordersState.fulfilledOrdersCount[honeyType] >= ordersState.quotaPerType;
  }, [ordersState.fulfilledOrdersCount, ordersState.quotaPerType]);

  // Fulfill an order
  const fulfillOrder = useCallback((
    orderId: string,
    bottledHoney: BottledHoney[],
    glassBottles: number
  ): FulfillOrderResult => {
    const order = ordersState.orders.find(o => o.id === orderId);
    
    if (!order) {
      return {
        success: false,
        coinsEarned: 0,
        xpEarned: 0,
        message: 'Order not found',
        wasReduced: false,
      };
    }

    if (order.isCompleted) {
      return {
        success: false,
        coinsEarned: 0,
        xpEarned: 0,
        message: 'Order already completed',
        wasReduced: false,
      };
    }

    // Check if user has matching honey
    const matchingHoney = bottledHoney.filter(h => h.type === order.honeyType);
    const totalMatchingAmount = matchingHoney.reduce((sum, h) => sum + h.amount, 0);
    const bottlesNeeded = order.bottlesRequested - order.bottlesFulfilled;

    if (totalMatchingAmount < bottlesNeeded) {
      return {
        success: false,
        coinsEarned: 0,
        xpEarned: 0,
        message: `Need ${bottlesNeeded} bottles of ${HONEY_TYPE_CONFIG[order.honeyType].name}`,
        wasReduced: false,
      };
    }

    // Check glass bottles (1 glass bottle per honey bottle)
    if (glassBottles < bottlesNeeded) {
      return {
        success: false,
        coinsEarned: 0,
        xpEarned: 0,
        message: `Need ${bottlesNeeded} glass bottles for packaging`,
        wasReduced: false,
      };
    }

    // Calculate rewards with potential reduction
    const isReduced = shouldReduceReward(order.honeyType);
    const reductionMultiplier = isReduced ? (100 - ordersState.reductionPercent) / 100 : 1;
    const coinsEarned = Math.floor(order.coinReward * reductionMultiplier);
    const xpEarned = Math.floor(order.xpReward * reductionMultiplier);

    // Update order state
    setOrdersState(prev => ({
      ...prev,
      orders: prev.orders.map(o => 
        o.id === orderId 
          ? { ...o, isCompleted: true, bottlesFulfilled: o.bottlesRequested, isReduced }
          : o
      ),
      fulfilledOrdersCount: {
        ...prev.fulfilledOrdersCount,
        [order.honeyType]: prev.fulfilledOrdersCount[order.honeyType] + 1,
      },
    }));

    return {
      success: true,
      coinsEarned,
      xpEarned,
      message: isReduced 
        ? `Order complete! (${ordersState.reductionPercent}% reduced - daily quota reached)`
        : 'Order complete!',
      wasReduced: isReduced,
    };
  }, [ordersState, shouldReduceReward]);

  // Get unfulfilled orders
  const getActiveOrders = useCallback(() => {
    return ordersState.orders.filter(o => !o.isCompleted);
  }, [ordersState.orders]);

  // Get completed orders
  const getCompletedOrders = useCallback(() => {
    return ordersState.orders.filter(o => o.isCompleted);
  }, [ordersState.orders]);

  // Get quota status for each honey type
  const getQuotaStatus = useCallback(() => {
    const status: Record<HoneyType, { fulfilled: number; quota: number; isReduced: boolean }> = {
      light: { fulfilled: 0, quota: QUOTA_PER_TYPE, isReduced: false },
      amber: { fulfilled: 0, quota: QUOTA_PER_TYPE, isReduced: false },
      dark: { fulfilled: 0, quota: QUOTA_PER_TYPE, isReduced: false },
      specialty: { fulfilled: 0, quota: QUOTA_PER_TYPE, isReduced: false },
      wildflower: { fulfilled: 0, quota: QUOTA_PER_TYPE, isReduced: false },
    };

    Object.entries(ordersState.fulfilledOrdersCount).forEach(([type, count]) => {
      const honeyType = type as HoneyType;
      status[honeyType] = {
        fulfilled: count,
        quota: QUOTA_PER_TYPE,
        isReduced: count >= QUOTA_PER_TYPE,
      };
    });

    return status;
  }, [ordersState.fulfilledOrdersCount]);

  return {
    orders: ordersState.orders,
    loaded,
    refreshDailyOrders,
    fulfillOrder,
    getActiveOrders,
    getCompletedOrders,
    getQuotaStatus,
    shouldReduceReward,
    HONEY_TYPE_CONFIG,
  };
}
