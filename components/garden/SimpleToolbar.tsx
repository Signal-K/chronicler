import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getToolsForRoute, type ToolType, type FarmRoute } from '../../constants/toolbarConfig';

type ToolbarProps = {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  onPlantSelect?: (plantType: string) => void;
  canTill?: boolean;
  canPlant?: boolean;
  canWater?: boolean;
  canShovel?: boolean;
  canHarvest?: boolean;
  seedInventory?: Record<string, number>;
  currentRoute?: FarmRoute;
  onNavigate?: (route: FarmRoute) => void;
  onVerticalNavigate?: () => void;
  onVerticalUpNavigate?: () => void;
  showDownArrow?: boolean;
  showUpArrow?: boolean;
  verticalPage?: 'main' | 'expand';
  farmIds?: string[];
  currentFarmIndex?: number;
};

export function SimpleToolbar({ 
  selectedTool, 
  onToolSelect, 
  onPlantSelect,
  canTill = true,
  canPlant = true,
  canWater = true,
  canShovel = true,
  canHarvest = true,
  seedInventory = {},
  currentRoute = 'home',
  onNavigate,
  onVerticalNavigate,
  onVerticalUpNavigate,
  showDownArrow = false,
  showUpArrow = false,
  farmIds = [],
  currentFarmIndex = 0,
  verticalPage = 'main', // new prop
}: ToolbarProps) {
  const handleDownNav = () => {
    if (onVerticalNavigate) onVerticalNavigate();
  };
  const [showPlantMenu, setShowPlantMenu] = useState(false);

  const availablePlants = [
    { id: 'tomato', name: 'Tomato', icon: '🍅', color: '#ef4444' },
    { id: 'sunflower', name: 'Sunflower', icon: '🌻', color: '#f59e0b' },
    { id: 'blueberry', name: 'Blueberry', icon: '🫐', color: '#2563eb' },
    { id: 'lavender', name: 'Lavender', icon: '🌸', color: '#7c3aed' },
  ];

  // Get crop image for plant selection
  const getCropImageForPlant = (cropId: string) => {
    switch (cropId) {
      case 'tomato':
        return require('../../assets/Sprites/Crops/Tomato.png');
      case 'sunflower':
        return require('../../assets/Sprites/Crops/Sunflower.png');
      case 'blueberry':
        return require('../../assets/Sprites/Crops/Blueberry.png');
      case 'lavender':
        return require('../../assets/Sprites/Crops/Lavender.png');
      default:
        return require('../../assets/Sprites/Crops/Wheat/4---Wheat-Full.png');
    }
  };

  const handlePlantClick = () => {
    if (selectedTool === 'plant') {
      onToolSelect(null);
      setShowPlantMenu(false);
    } else {
      setShowPlantMenu(true);
    }
  };

  const handlePlantSelection = (plantId: string) => {
    onToolSelect('plant');
    setShowPlantMenu(false);
    if (onPlantSelect) {
      onPlantSelect(plantId);
    }
  };

  const handleLeftNav = () => {
    if (verticalPage !== 'main') {
      if (onVerticalUpNavigate) onVerticalUpNavigate();
      return;
    }

    if (!onNavigate) return;
    if (currentRoute === 'home') {
      onNavigate('nests');
    }
  };

  const handleRightNav = () => {
    // If on the main farm page, prefer vertical navigation to expand page.
    if (currentRoute === 'home' && verticalPage === 'main') {
      if (onVerticalNavigate) {
        onVerticalNavigate();
        return;
      }
    }

    if (!onNavigate) return;
    if (currentRoute === 'nests') {
      onNavigate('home');
    }
  };

  const canGoLeft = verticalPage !== 'main' || currentRoute !== 'nests';
  const canGoRight = currentRoute !== 'expand';

  // Get tools for current route from configuration
  const toolButtons = getToolsForRoute(currentRoute);

  // Check if tool can be used based on condition
  const canUseTool = (condition?: string): boolean => {
    switch (condition) {
      case 'canTill': return canTill;
      case 'canPlant': return canPlant;
      case 'canWater': return canWater;
      case 'canShovel': return canShovel;
      case 'canHarvest': return canHarvest;
      default: return true;
    }
  };

  return (
    <View style={styles.toolbarContainer}>
      <View style={styles.navigationRow}>
        <TouchableOpacity
          onPress={handleLeftNav}
          disabled={!canGoLeft}
          style={[styles.navButton, !canGoLeft && styles.navButtonDisabled]}
        >
          <Text style={[styles.navButtonText, !canGoLeft && styles.navButtonTextDisabled]}>
            {verticalPage !== 'main' ? '▲' : '◀'}
          </Text>
        </TouchableOpacity>

        {/* Up arrow for vertical navigation (center) */}
        {showUpArrow && (
          <TouchableOpacity
            onPress={onVerticalUpNavigate}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>▲</Text>
          </TouchableOpacity>
        )}
        {/* Down arrow removed (left-most duplicate) */}

        <View style={styles.screenIndicator}>
          <Text style={styles.screenIndicatorText}>
            {currentRoute === 'nests'
              ? 'HIVES'
              : currentRoute === 'landscape'
              ? 'LANDSCAPE'
              : currentRoute === 'expand'
              ? 'EXPAND'
              : currentRoute === 'home'
              ? `FARM ${verticalPage === 'main' ? 1 : 2}`
              : 'FARM'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            // If a down-arrow navigation is available on the farm page, prefer vertical navigation
            if (currentRoute === 'home' && showDownArrow && onVerticalNavigate) {
              onVerticalNavigate();
              return;
            }
            handleRightNav();
          }}
          disabled={!canGoRight}
          style={[styles.navButton, !canGoRight && styles.navButtonDisabled]}
        >
          <Text style={[styles.navButtonText, !canGoRight && styles.navButtonTextDisabled]}>
            {currentRoute === 'home' ? '▼' : verticalPage !== 'main' ? '▲' : '▶'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolsRow}>
        {toolButtons.map((toolButton) => {
          const canUse = canUseTool(toolButton.requiresCondition);
          const isActive = selectedTool === toolButton.tool;
          
          // Special handling for plant tool (opens menu)
          const handlePress = () => {
            if (!canUse) return;
            
            if (toolButton.tool === 'plant') {
              handlePlantClick();
            } else {
              onToolSelect(isActive ? null : toolButton.tool);
            }
          };

          return (
            <TouchableOpacity
              key={toolButton.id}
              onPress={handlePress}
              disabled={!canUse}
              style={[
                styles.button,
                { backgroundColor: toolButton.backgroundColor },
                isActive && styles.buttonActive,
                !canUse && styles.buttonDisabled
              ]}
            >
              <Text style={[styles.buttonText, !canUse && styles.buttonTextDisabled]}>
                {toolButton.icon} {toolButton.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        visible={showPlantMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlantMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowPlantMenu(false)}
        >
          <View style={styles.plantMenu}>
            <Text style={styles.plantMenuTitle}>Select Plant</Text>
            <View style={styles.plantGrid}>
              {availablePlants.map((plant) => {
                const seedCount = seedInventory[plant.id] || 0;
                const canPlantThis = seedCount > 0;
                
                return (
                  <TouchableOpacity
                    key={plant.id}
                    onPress={() => canPlantThis && handlePlantSelection(plant.id)}
                    disabled={!canPlantThis}
                    style={[
                      styles.plantButton, 
                      { backgroundColor: plant.color },
                      !canPlantThis && styles.plantButtonDisabled
                    ]}
                  >
                    <Image 
                      source={getCropImageForPlant(plant.id)}
                      style={styles.plantIconImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <View style={styles.seedBadge}>
                      <Text style={styles.seedBadgeText}>🌱 {seedCount}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    backgroundColor: '#92400e',
    borderTopWidth: 3,
    borderTopColor: '#44403c',
    zIndex: 100,
    elevation: 10,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#78350f',
    borderWidth: 2,
    borderColor: '#1c1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#57534e',
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: '#a8a29e',
  },
  screenIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  screenIndicatorText: {
    color: '#fef3c7',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 72,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 62,
    borderWidth: 2,
    borderColor: '#1c1917',
  },
  buttonActive: {
    borderWidth: 3,
    borderColor: '#facc15',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#57534e',
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: '#a8a29e',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantMenu: {
    backgroundColor: '#166534',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#052e16',
    padding: 16,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  plantMenuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  plantButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  plantIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  plantIconImage: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  plantName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  plantButtonDisabled: {
    opacity: 0.4,
  },
  seedBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  seedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
