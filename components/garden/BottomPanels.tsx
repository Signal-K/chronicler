import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Almanac } from '../../app/screens/almanac';
import { Settings } from '../../app/settings';
import { Shop } from '../../app/screens/shop';
import type { InventoryData } from '../../hooks/useGameState';
import type { PollinationFactorData } from '../../types/pollinationFactor';
import { Inventory } from '../inventory/inventory';

interface BottomPanelsProps {
  isAnyPanelOpen: boolean;
  showAlmanac: boolean;
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
  showAlmanac,
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
        {showAlmanac && (
          <Almanac onClose={closePanel} isExpanded={isExpanded} onToggleExpand={toggleExpand} />
        )}
        
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
          <Settings 
            onClose={closePanel} 
            isExpanded={isExpanded} 
            onToggleExpand={toggleExpand} 
            location={null} 
            setLocation={() => {}} 
            setRealWeather={() => {}} 
            setNextRainTime={() => {}}
            onResetGame={onResetGame}
            pollinationFactor={pollinationFactor}
            onFillHives={onFillHives}
          />
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
});
