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

export interface ToolButton {
  id: string;
  tool: ToolType;
  label: string;
  icon: string;
  backgroundColor: string;
  requiresCondition?: 'canTill' | 'canPlant' | 'canWater' | 'canShovel' | 'canHarvest';
}

export interface RouteToolConfig {
  route: string;
  tools: ToolButton[];
  showNavigation?: boolean; // Show left/right navigation arrows
}

/**
 * Tool Button Configuration for Each Route
 * 
 * Routes:
 * - nests: Hive/bee management screen (no farming tools)
 * - home: Main farm/garden screen (all farming tools)
 * - landscape: Expanded landscape view (all farming tools)
 * - expand: Map expansion/exploration screen (no farming tools)
 * - godot: Godot integration screen (no farming tools)
 */
export const ROUTE_TOOL_CONFIGS: Record<string, ToolButton[]> = {
  // Nests/Hives Screen - Bottle Honey button
  nests: [
    {
      id: 'bottle',
      tool: 'bottle',
      label: 'BOTTLE HONEY',
      icon: '🍯',
      backgroundColor: '#f59e0b',
    },
  ],

  // Home/Farm Screen - Full set of farming tools
  home: [
    {
      id: 'till',
      tool: 'till',
      label: 'TILL',
      icon: '⛏️',
      backgroundColor: '#92400e',
      requiresCondition: 'canTill',
    },
    {
      id: 'water',
      tool: 'water',
      label: 'WATER',
      icon: '💧',
      backgroundColor: '#3b82f6',
      requiresCondition: 'canWater',
    },
    {
      id: 'plant',
      tool: 'plant',
      label: 'PLANT',
      icon: '🌱',
      backgroundColor: '#22c55e',
      requiresCondition: 'canPlant',
    },
    {
      id: 'harvest',
      tool: 'harvest',
      label: 'HARVEST',
      icon: '🌾',
      backgroundColor: '#ca8a04',
      requiresCondition: 'canHarvest',
    },
  ],

  // Landscape Screen - Empty (no tools)
  landscape: [],

  // Expand Screen - No farming tools (exploration focus)
  expand: [],

  // Godot Screen - No farming tools
  godot: [],
};

/**
 * Get tool button configuration for a specific route
 * @param route - The route name (e.g., 'home', 'nests', 'landscape')
 * @returns Array of tool buttons for that route
 */
export function getToolsForRoute(route: string): ToolButton[] {
  return ROUTE_TOOL_CONFIGS[route] || [];
}

/**
 * Check if a route has farming tools
 * @param route - The route name
 * @returns true if the route has any farming tools
 */
export function routeHasFarmingTools(route: string): boolean {
  const tools = getToolsForRoute(route);
  return tools.length > 0;
}

/**
 * Check if a specific tool is available for a route
 * @param route - The route name
 * @param toolType - The tool type to check for
 * @returns true if the tool exists for that route
 */
export function routeHasTool(route: string, toolType: ToolType): boolean {
  const tools = getToolsForRoute(route);
  return tools.some(tool => tool.tool === toolType);
}
