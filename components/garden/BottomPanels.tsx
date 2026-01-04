import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shop } from '../../app/screens/shop';
// Settings removed
import type { InventoryData } from '../../hooks/useGameState';
import type { PollinationFactorData } from '../../types/pollinationFactor';
import { Inventory } from '../inventory/inventory';

interface BottomPanelsProps {
  isAnyPanelOpen: boolean;
  showInventory: boolean;
  showShop: boolean;
  showSettings: boolean;
  panelHeight: Animated.Value;
  inventory: InventoryData;
  setInventory: (inventory: InventoryData) => void;
  onSellCrop: (cropType: string, count: number, coinsEarned: number, emoji: string) => void;
  closePanel: () => void;
  onResetGame: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  pollinationFactor?: PollinationFactorData;
  onFillHives?: () => void;
}

export function BottomPanels({
  isAnyPanelOpen,
  // showAlmanac removed
  showInventory,
  showShop,
  showSettings,
  panelHeight,
  inventory,
  setInventory,
  onSellCrop,
  closePanel,
  onResetGame,
  isExpanded,
  toggleExpand,
  pollinationFactor,
  onFillHives,
}: BottomPanelsProps) {
  if (!isAnyPanelOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.panelOverlay}
        activeOpacity={1}
        onPress={closePanel}
      />
      
      <Animated.View style={[styles.bottomPanel, { height: panelHeight }]}>
        {showInventory && (
          <Inventory 
            inventory={inventory} 
            setInventory={setInventory}
            onSellCrop={onSellCrop}
            onClose={closePanel} 
            isExpanded={isExpanded} 
            onToggleExpand={toggleExpand} 
          />
        )}
        
        {showShop && (
          <Shop 
            inventory={inventory} 
            setInventory={setInventory} 
            onClose={closePanel} 
            isExpanded={isExpanded} 
            onToggleExpand={toggleExpand} 
          />
        )}
        
        {showSettings && (
          <View style={styles.panel}>
            <Text>Settings panel removed</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  panelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 150,
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fef3c7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 200,
    overflow: 'hidden',
  },
  panel: {
    padding: 20,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
  },
});
