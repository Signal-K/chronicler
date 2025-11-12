import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BottomPanels } from '../components/garden/BottomPanels';
import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { GameHeader } from '../components/ui/GameHeader';
import { useGameState } from '../hooks/useGameState';
import { usePanelManager } from '../hooks/usePanelManager';
import { useWaterSystem } from '../hooks/useWaterSystem';

// Import screen content components
import { ExpandContent } from '../components/screens/ExpandContent';
import { HomeContent } from '../components/screens/HomeContent';
import { NestsContent } from '../components/screens/NestsContent';
import type { FarmRoute } from '../components/garden/SimpleToolbar';

export default function HomeScreen() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<FarmRoute>('home');
  
  // Game state
  const {
    plots,
    setPlots,
    inventory,
    setInventory,
    selectedAction,
    setSelectedAction,
    selectedPlant,
    setSelectedPlant,
    resetGame,
  } = useGameState();

  const {
    showAlmanac,
    showInventory,
    showShop,
    showSettings,
    panelHeight,
    openPanel,
    closePanel,
    isAnyPanelOpen,
  } = usePanelManager();

  // Weather and water
  const { currentWater, maxWater, consumeWater } = useWaterSystem(false);

  // Handle screen navigation
  const handleNavigate = (route: FarmRoute) => {
    setCurrentScreen(route);
  };

  // Render current screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'nests':
        return <NestsContent />;
      case 'expand':
        return <ExpandContent />;
      case 'home':
      default:
        return (
          <HomeContent
            plots={plots}
            setPlots={setPlots}
            inventory={inventory}
            setInventory={setInventory}
            selectedAction={selectedAction}
            selectedPlant={selectedPlant}
            consumeWater={consumeWater}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Fixed Header - Never reloads */}
      <GameHeader 
        coins={inventory.coins} 
        water={currentWater} 
        maxWater={maxWater}
        weather="sunny"
      />
      
      {/* Background */}
      <LinearGradient 
        colors={['#86efac', '#4ade80', '#22c55e']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      {/* Dynamic Content Area - Swaps without reload */}
      <View style={styles.contentContainer}>
        {renderScreenContent()}
      </View>

      {/* Fixed Toolbar - Never reloads */}
      <SimpleToolbar 
        selectedTool={selectedAction}
        onToolSelect={setSelectedAction}
        onPlantSelect={setSelectedPlant}
        canTill={plots.some(p => p.state === 'empty')}
        canPlant={plots.some(p => p.state === 'tilled')}
        canWater={plots.some(p => (p.state === 'planted' || p.state === 'growing') && p.needsWater)}
        canHarvest={plots.some(p => p.state !== 'empty' && p.growthStage === 5)}
        canShovel={plots.some(p => p.state !== 'empty')}
        seedInventory={inventory.seeds}
        currentRoute={currentScreen}
        onNavigate={handleNavigate}
      />

      {/* Fixed Bottom Bar - Never reloads */}
      <GardenBottomBar 
        onOpenAlmanac={() => openPanel('almanac')}
        onOpenInventory={() => openPanel('inventory')}
        onOpenShop={() => openPanel('shop')}
        onOpenSettings={() => openPanel('settings')}
        onOpenGodot={() => router.push('/godot' as any)}
      />

      {/* Bottom Panels */}
      <BottomPanels
        isAnyPanelOpen={isAnyPanelOpen}
        showAlmanac={showAlmanac}
        showInventory={showInventory}
        showShop={showShop}
        showSettings={showSettings}
        panelHeight={panelHeight}
        inventory={inventory}
        setInventory={setInventory}
        onSellCrop={() => {}}
        closePanel={closePanel}
        onResetGame={resetGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
});
