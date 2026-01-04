/**
 * Toolbar Button Configuration
 * 
 * This file defines which action buttons (till, water, plant, harvest, etc.) 
 * appear in the toolbar for each route/screen.
 * 
 * To modify buttons:
 * 1. Find the route configuration below
 * 2. Add/remove/edit buttons in the 'tools' array
 * 3. Each button needs: id, label, icon, backgroundColor, and tool type
 */

export type ToolType = 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | 'bottle' | null;

export type FarmRoute = 'home' | 'nests' | 'landscape' | 'expand' | 'godot';

export interface ToolButton {
  id: string;
  tool: ToolType;
  label: string;
  icon: string;
  backgroundColor: string;
  requiresCondition?: 'canTill' | 'canPlant' | 'canWater' | 'canShovel' | 'canHarvest';
}

// Basic function to get tools for any route - returns common tools
export function getToolsForRoute(route: FarmRoute): ToolButton[] {
  // Return basic tool set for all routes
  return [
    { id: 'till', tool: 'till', label: 'Till', icon: '🚜', backgroundColor: '#8B4513' },
    { id: 'plant', tool: 'plant', label: 'Plant', icon: '🌱', backgroundColor: '#228B22' },
    { id: 'water', tool: 'water', label: 'Water', icon: '💧', backgroundColor: '#4169E1' },
    { id: 'harvest', tool: 'harvest', label: 'Harvest', icon: '🌾', backgroundColor: '#FFD700' }
  ];
}

// Route-specific tool configurations removed - unused exports
