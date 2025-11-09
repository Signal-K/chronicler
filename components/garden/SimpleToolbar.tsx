import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type FarmRoute = '/nests' | '/home' | '/expand';

type ToolbarProps = {
  selectedTool: 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null;
  onToolSelect: (tool: 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null) => void;
  onPlantSelect?: (plantType: string) => void;
  canTill?: boolean;
  canPlant?: boolean;
  canWater?: boolean;
  canShovel?: boolean;
  seedInventory?: Record<string, number>;
  // Navigation props
  currentRoute?: 'nests' | 'home' | 'expand';
  onNavigate?: (route: FarmRoute) => void;
  // For future: array of farm IDs for cycling through multiple farms
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

  // Navigation logic
  const handleLeftNav = () => {
    if (!onNavigate) return;
    
    if (currentRoute === 'home') {
      // Go to nests
      onNavigate('/nests');
    } else if (currentRoute === 'expand') {
      // If there are farms, cycle backwards through them
      if (farmIds.length > 0) {
        // TODO: Implement farm cycling
        // For now, just go to home
        onNavigate('/home');
      } else {
        onNavigate('/home');
      }
    }
    // If we're on nests, do nothing (it's the leftmost screen)
  };

  const handleRightNav = () => {
    if (!onNavigate) return;
    
    if (currentRoute === 'nests') {
      // Go to home (or first farm)
      onNavigate('/home');
    } else if (currentRoute === 'home') {
      // If there are more farms, cycle to next farm
      if (farmIds.length > 0) {
        // TODO: Implement farm cycling
        // For now, just go to expand
        onNavigate('/expand');
      } else {
        onNavigate('/expand');
      }
    }
    // If we're on expand, do nothing (it's the rightmost screen)
  };

  const canGoLeft = currentRoute !== 'nests';
  const canGoRight = currentRoute !== 'expand';

  return (
    <View style={styles.toolbar}>
      {/* Left Navigation Arrow */}
      <TouchableOpacity
        onPress={handleLeftNav}
        disabled={!canGoLeft}
        style={[
          styles.navButton,
          styles.navButtonLeft,
          !canGoLeft && styles.navButtonDisabled
        ]}
      >
        <Text style={[styles.navButtonText, !canGoLeft && styles.navButtonTextDisabled]}>
          ◀
        </Text>
      </TouchableOpacity>

      {/* Tool Buttons Container */}
      <View style={styles.toolsContainer}>
        {/* Till Tool */}
        <TouchableOpacity 
          onPress={() => canTill && onToolSelect(selectedTool === 'till' ? selectedTool : 'till')}
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
          onPress={() => canWater && onToolSelect(selectedTool === 'water' ? selectedTool : 'water')}
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
      </View>

      {/* Right Navigation Arrow */}
      <TouchableOpacity
        onPress={handleRightNav}
        disabled={!canGoRight}
        style={[
          styles.navButton,
          styles.navButtonRight,
          !canGoRight && styles.navButtonDisabled
        ]}
      >
        <Text style={[styles.navButtonText, !canGoRight && styles.navButtonTextDisabled]}>
          ▶
        </Text>
      </TouchableOpacity>

      {/* Plant Selection Modal */}
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
                    <Text style={styles.plantIcon}>{plant.icon}</Text>
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
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#92400e',
    borderTopWidth: 3,
    borderTopColor: '#44403c',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flex: 1,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#78350f',
    borderWidth: 3,
    borderColor: '#1c1917',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonLeft: {
    // Additional styling for left arrow if needed
  },
  navButtonRight: {
    // Additional styling for right arrow if needed
  },
  navButtonDisabled: {
    backgroundColor: '#57534e',
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: '#a8a29e',
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 90,
    borderWidth: 3,
    borderColor: '#1c1917',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonActive: {
    borderWidth: 4,
    borderColor: '#facc15',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
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
