import type { InventoryData } from '../hooks/useGameState';
import type { Order } from '../types/orders';
import { increaseAffinity } from './merchantAffinity';
import { loadActiveOrders, saveActiveOrders } from './orderGeneration';

/**
 * Check if user has required items for an order
 */
export function canFulfillOrder(order: Order, inventory: InventoryData): boolean {
  if (order.type === 'crop') {
    const available = inventory.harvested[order.cropType] || 0;
    return available >= order.quantity;
  }
  
  if (order.type === 'crop-group') {
    return order.requirements.every(req => {
      const available = inventory.harvested[req.cropType] || 0;
      return available >= req.quantity;
    });
  }
  
  if (order.type === 'nectar') {
    const available = (inventory.items || {}).bottled_nectar || 0;
    return available >= order.bottlesRequired;
  }
  
  return false;
}

/**
 * Fulfill an order: remove items, add coins, increase affinity
 * Returns updated inventory or null if order cannot be fulfilled
 */
export async function fulfillOrder(
  orderId: string,
  inventory: InventoryData
): Promise<{ updatedInventory: InventoryData; reward: number } | null> {
  const orders = await loadActiveOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order || order.status !== 'active') {
    return null;
  }
  
  // Check expiration
  if (order.expiresAt < Date.now()) {
    order.status = 'expired';
    await saveActiveOrders(orders);
    return null;
  }
  
  // Check if user can fulfill
  if (!canFulfillOrder(order, inventory)) {
    return null;
  }
  
  // Create updated inventory
  const updatedInventory = { ...inventory };
  
  // Remove items based on order type
  if (order.type === 'crop') {
    updatedInventory.harvested = {
      ...inventory.harvested,
      [order.cropType]: inventory.harvested[order.cropType] - order.quantity,
    };
  } else if (order.type === 'crop-group') {
    updatedInventory.harvested = { ...inventory.harvested };
    order.requirements.forEach(req => {
      updatedInventory.harvested[req.cropType] = 
        (inventory.harvested[req.cropType] || 0) - req.quantity;
    });
  } else if (order.type === 'nectar') {
    updatedInventory.items = {
      ...(inventory.items || {}),
      bottled_nectar: ((inventory.items || {}).bottled_nectar || 0) - order.bottlesRequired,
    };
  }
  
  // Add coins
  updatedInventory.coins = inventory.coins + order.totalReward;
  
  // Mark order as completed
  order.status = 'completed';
  
  // Remove completed order from active orders
  const remainingOrders = orders.filter(o => o.id !== orderId);
  await saveActiveOrders(remainingOrders);
  
  // Increase merchant affinity (2-5 points based on order value)
  const affinityPoints = Math.min(5, Math.max(2, Math.floor(order.totalReward / 100)));
  await increaseAffinity(order.merchantId, affinityPoints);
  
  return {
    updatedInventory,
    reward: order.totalReward,
  };
}

/**
 * Get items required for an order as a formatted string
 */
export function getOrderRequirementsText(order: Order): string {
  if (order.type === 'crop') {
    return `${order.quantity}x ${order.cropType}`;
  }
  
  if (order.type === 'crop-group') {
    return order.requirements
      .map(r => `${r.quantity}x ${r.cropType}`)
      .join(', ');
  }
  
  if (order.type === 'nectar') {
    return `${order.bottlesRequired}x Bottled Nectar`;
  }
  
  return 'Unknown';
}

/**
 * Calculate what items the user is missing to fulfill an order
 */
export function getMissingItems(order: Order, inventory: InventoryData): string[] {
  const missing: string[] = [];
  
  if (order.type === 'crop') {
    const available = inventory.harvested[order.cropType] || 0;
    const needed = order.quantity - available;
    if (needed > 0) {
      missing.push(`${needed}x ${order.cropType}`);
    }
  }
  
  if (order.type === 'crop-group') {
    order.requirements.forEach(req => {
      const available = inventory.harvested[req.cropType] || 0;
      const needed = req.quantity - available;
      if (needed > 0) {
        missing.push(`${needed}x ${req.cropType}`);
      }
    });
  }
  
  if (order.type === 'nectar') {
    const available = (inventory.items || {}).bottled_nectar || 0;
    const needed = order.bottlesRequired - available;
    if (needed > 0) {
      missing.push(`${needed}x Bottled Nectar`);
    }
  }
  
  return missing;
}
