import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomPanels } from '../components/garden/BottomPanels';
import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { MapOverview } from '../components/garden/MapOverview';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { GameHeader } from '../components/ui/GameHeader';
import { useGameState } from '../hooks/useGameState';
import { useMapSystem } from '../hooks/useMapSystem';
import { usePanelManager } from '../hooks/usePanelManager';
import { usePollinationFactor } from '../hooks/usePollinationFactor';
import { useWaterSystem } from '../hooks/useWaterSystem';

// Import screen content components
import type { FarmRoute } from '../components/garden/SimpleToolbar';
import { ExpandContent } from '../components/screens/ExpandContent';
import { HomeContent } from '../components/screens/HomeContent';
import { NestsContent } from '../components/screens/NestsContent';

export default function HomeScreen() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<FarmRoute>('home');
  const [showMapOverview, setShowMapOverview] = useState(false);
  
  // Map system
  const { getActiveMap, setActiveMap, getAllMaps } = useMapSystem();
  const activeMap = getActiveMap();
  const mapColors = activeMap ? activeMap.colors : {
    primary: '#86efac',
    secondary: '#4ade80',
    tertiary: '#22c55e',
  };
  
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

  // Pollination factor - single instance for entire app
  const { pollinationFactor, incrementFactor, canSpawnBees } = usePollinationFactor();

  const pinchGesture = Gesture.Pinch()
    .onEnd((event) => {
      if (event.scale > 1.2) {
        setShowMapOverview(true);
      };
    });

  const handleNavigate = (route: FarmRoute) => {
    setCurrentScreen(route);
  };

  const handleSelectMap = async (mapId: string) => {
    await setActiveMap(mapId as any);
  };

  // Render current screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'nests':
        return (
          <NestsContent 
            pollinationFactor={pollinationFactor}
            canSpawnBees={canSpawnBees}
          />
        );
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
            incrementPollinationFactor={incrementFactor}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pinchGesture}>
        <View style={styles.container}>
          <StatusBar style="light" />
          
          {/* Fixed Header - Never reloads */}
          <GameHeader 
            coins={inventory.coins} 
            water={currentWater} 
            maxWater={maxWater}
            weather="sunny"
          />
          
          {/* Background with active map colors */}
          <LinearGradient 
            colors={[mapColors.primary, mapColors.secondary, mapColors.tertiary]} 
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

        {/* Map Overview Modal */}
        <MapOverview
          visible={showMapOverview}
          onClose={() => setShowMapOverview(false)}
          maps={getAllMaps().filter(m => m.unlocked)}
          activeMapId={activeMap?.id || 'default'}
          onSelectMap={handleSelectMap}
        />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
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
