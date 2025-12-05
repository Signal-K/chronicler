import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type FarmRoute = 'nests' | 'home' | 'landscape' | 'expand' | 'godot';

type ToolbarProps = {
  selectedTool: 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null;
  onToolSelect: (tool: 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null) => void;
  onPlantSelect?: (plantType: string) => void;
  canTill?: boolean;
  canPlant?: boolean;
  canWater?: boolean;
  canShovel?: boolean;
  canHarvest?: boolean;
  seedInventory?: Record<string, number>;
  currentRoute?: 'nests' | 'home' | 'landscape' | 'expand' | 'godot';
  onNavigate?: (route: FarmRoute) => void;
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
  farmIds = [],
  currentFarmIndex = 0,
}: ToolbarProps) {
  const [showPlantMenu, setShowPlantMenu] = useState(false);

  const availablePlants = [
    { id: 'tomato', name: 'Tomato', icon: '🍅', color: '#ef4444' },
    { id: 'carrot', name: 'Carrot', icon: '🥕', color: '#f97316' },
    { id: 'wheat', name: 'Wheat', icon: '🌾', color: '#ca8a04' },
    { id: 'corn', name: 'Corn', icon: '🌽', color: '#eab308' },
  ];

  // Get crop image for plant selection
  const getCropImageForPlant = (cropId: string) => {
    const imageMap: Record<string, any> = {
      wheat: require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      tomato: require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'), // Placeholder
      carrot: require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'), // Placeholder
      corn: require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'), // Placeholder
    };
    return imageMap[cropId];
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
    if (!onNavigate) return;
    
    if (currentRoute === 'home') {
      onNavigate('nests');
    } else if (currentRoute === 'landscape') {
      onNavigate('home');
    } else if (currentRoute === 'expand') {
      onNavigate('landscape');
    }
  };

  const handleRightNav = () => {
    if (!onNavigate) return;
    
    if (currentRoute === 'nests') {
      onNavigate('home');
    } else if (currentRoute === 'home') {
      onNavigate('landscape');
    } else if (currentRoute === 'landscape') {
      onNavigate('expand');
    }
  };

  const canGoLeft = currentRoute !== 'nests';
  const canGoRight = currentRoute !== 'expand';

  return (
    <View style={styles.toolbarContainer}>
      <View style={styles.navigationRow}>
        <TouchableOpacity
          onPress={handleLeftNav}
          disabled={!canGoLeft}
          style={[
            styles.navButton,
            !canGoLeft && styles.navButtonDisabled
          ]}
        >
          <Text style={[styles.navButtonText, !canGoLeft && styles.navButtonTextDisabled]}>
            ◀
          </Text>
        </TouchableOpacity>

        <View style={styles.screenIndicator}>
          <Text style={styles.screenIndicatorText}>
            {currentRoute === 'nests' ? 'HIVES' : currentRoute === 'landscape' ? 'LANDSCAPE' : currentRoute === 'expand' ? 'EXPAND' : 'FARM'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleRightNav}
          disabled={!canGoRight}
          style={[
            styles.navButton,
            !canGoRight && styles.navButtonDisabled
          ]}
        >
          <Text style={[styles.navButtonText, !canGoRight && styles.navButtonTextDisabled]}>
            ▶
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolsRow}>
        {currentRoute !== 'landscape' && currentRoute !== 'expand' && (
        <>
        {/* Till Tool */}
        <TouchableOpacity 
          onPress={() => canTill && onToolSelect(selectedTool === 'till' ? null : 'till')}
          disabled={!canTill}
          style={[
            styles.button, 
            { backgroundColor: '#92400e' },
            selectedTool === 'till' && styles.buttonActive,
            !canTill && styles.buttonDisabled
          ]}
        >
          <Text style={[styles.buttonText, !canTill && styles.buttonTextDisabled]}>⛏️ TILL</Text>
        </TouchableOpacity>
        
        {/* Water Tool */}
        <TouchableOpacity 
          onPress={() => canWater && onToolSelect(selectedTool === 'water' ? null : 'water')}
          disabled={!canWater}
          style={[
            styles.button, 
            { backgroundColor: '#3b82f6' },
            selectedTool === 'water' && styles.buttonActive,
            !canWater && styles.buttonDisabled
          ]}
        >
          <Text style={[styles.buttonText, !canWater && styles.buttonTextDisabled]}>💧 WATER</Text>
        </TouchableOpacity>
        
        {/* Plant Tool */}
        <TouchableOpacity 
          onPress={canPlant ? handlePlantClick : undefined}
          disabled={!canPlant}
          style={[
            styles.button, 
            { backgroundColor: '#22c55e' },
            selectedTool === 'plant' && styles.buttonActive,
            !canPlant && styles.buttonDisabled
          ]}
        >
          <Text style={[styles.buttonText, !canPlant && styles.buttonTextDisabled]}>🌱 PLANT</Text>
        </TouchableOpacity>
        
        {/* Harvest Tool (combines harvest + shovel) */}
        <TouchableOpacity 
          onPress={() => canHarvest && onToolSelect(selectedTool === 'harvest' ? null : 'harvest')}
          disabled={!canHarvest}
          style={[
            styles.button, 
            { backgroundColor: '#ca8a04' },
            selectedTool === 'harvest' && styles.buttonActive,
            !canHarvest && styles.buttonDisabled
          ]}
        >
          <Text style={[styles.buttonText, !canHarvest && styles.buttonTextDisabled]}>🌾 HARVEST</Text>
        </TouchableOpacity>
        </>
        )}
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
