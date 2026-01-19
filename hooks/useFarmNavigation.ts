import { useState } from 'react';
import type { FarmRoute } from '../constants/toolbarConfig';

/**
 * Hook for managing navigation between farms and special screens
 * 
 * Navigation structure:
 * [Nests] <- [Farm 1] <-> [Farm 2] <-> ... <-> [Farm N] -> [Expand]
 * 
 * @param currentRoute - The current route/screen
 * @param farmIds - Array of farm IDs (for future multi-farm support)
 * @param currentFarmId - The current farm ID (for future multi-farm support)
 */
export function useFarmNavigation(
  currentRoute: 'nests' | 'home' | 'expand' = 'home',
  farmIds: string[] = [],
  currentFarmId?: string
) {
  const [farms] = useState<string[]>(farmIds);
  const [activeFarmId] = useState<string | undefined>(currentFarmId);

  /**
   * Get the next route when navigating right
   * TODO: Implement farm cycling when multiple farms exist
   */
  const getNextRoute = (): FarmRoute | null => {
    if (currentRoute === 'nests') {
      return 'home'; // Or first farm if farms exist
    }
    
    if (currentRoute === 'home') {
      // TODO: If there are more farms, return next farm route
      // For now, just go to expand
      return 'expand';
    }
    
    // Already at rightmost screen (expand)
    return null;
  };

  /**
   * Get the previous route when navigating left
   * TODO: Implement farm cycling when multiple farms exist
   */
  const getPreviousRoute = (): FarmRoute | null => {
    if (currentRoute === 'expand') {
      // TODO: If there are farms, return last farm route
      // For now, just go to home
      return 'home';
    }
    
    if (currentRoute === 'home') {
      return 'nests';
    }
    
    // Already at leftmost screen (nests)
    return null;
  };

  /**
   * Check if navigation to the left is possible
   */
  const canNavigateLeft = currentRoute !== 'nests';

  /**
   * Check if navigation to the right is possible
   */
  const canNavigateRight = currentRoute !== 'expand';

  /**
   * Get the index of the current farm in the farms array
   * Returns -1 if not on a farm screen or farm not found
   */
  const getCurrentFarmIndex = (): number => {
    if (!activeFarmId || farms.length === 0) {
      return -1;
    }
    return farms.indexOf(activeFarmId);
  };

  /**
   * Get route for a specific farm by index
   * TODO: Implement when farm routing is set up
   */
  const getFarmRoute = (farmIndex: number): FarmRoute | null => {
    if (farmIndex < 0 || farmIndex >= farms.length) {
      return null;
    }
    // TODO: Return dynamic farm route based on farmIds[farmIndex]
    // For now, just return home as placeholder
    return 'home';
  };

  return {
    // Current state
    farms,
    activeFarmId,
    canNavigateLeft,
    canNavigateRight,
    
    // Navigation methods
    getNextRoute,
    getPreviousRoute,
    getCurrentFarmIndex,
    getFarmRoute,
    
    // For future use
    totalFarms: farms.length,
  };
}

/**
 * Type for farm data (for future use)
 */
export interface FarmData {
  id: string;
  name: string;
  unlocked: boolean;
  plots: number;
  // Add more farm properties as needed
}

/**
 * Hook for managing multiple farms (future implementation)
 * This is a skeleton for when you want to implement multi-farm support
 */
export function useFarms() {
  const [farms, setFarms] = useState<FarmData[]>([
    {
      id: 'farm_1',
      name: 'Main Farm',
      unlocked: true,
      plots: 6,
    }
  ]);

  /**
   * Unlock a new farm (e.g., through purchase in expand screen)
   */
  const unlockFarm = (farmId: string, farmData: Partial<FarmData>) => {
    // TODO: Implement farm unlocking logic
    setFarms(prev => [
      ...prev,
      {
        id: farmId,
        name: farmData.name || `Farm ${prev.length + 1}`,
        unlocked: true,
        plots: farmData.plots || 6,
      }
    ]);
  };

  /**
   * Get farm by ID
   */
  const getFarm = (farmId: string): FarmData | undefined => {
    return farms.find(f => f.id === farmId);
  };

  /**
   * Get all unlocked farms
   */
  const getUnlockedFarms = (): FarmData[] => {
    return farms.filter(f => f.unlocked);
  };

  return {
    farms,
    unlockFarm,
    getFarm,
    getUnlockedFarms,
    unlockedCount: farms.filter(f => f.unlocked).length,
  };
}
