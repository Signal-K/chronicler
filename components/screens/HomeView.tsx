import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDayNightCycle } from '../../hooks/useDayNightCycle';
import { useGameState } from '../../hooks/useGameState';
import { useHiveState } from '../../hooks/useHiveState';
import { useMapSystem } from '../../hooks/useMapSystem';
import { usePanelManager } from '../../hooks/usePanelManager';
import { usePlayerExperience } from '../../hooks/usePlayerExperience';
import { usePollinationFactor } from '../../hooks/usePollinationFactor';
import { useWaterSystem } from '../../hooks/useWaterSystem';
// Order generation removed
import { BottomPanels } from '../garden/BottomPanels';
import { SimpleToolbar } from '../garden/SimpleToolbar';
// Orders removed
import { SiloModal } from '../modals/SiloModal';
import { BeeHatchAlert } from '../ui/BeeHatchAlert';
import { GameHeader } from '../ui/GameHeader';
import { Toast } from '../ui/Toast';

export function HomeView() {
  const { experience } = usePlayerExperience();
  const [verticalPage, setVerticalPage] = useState<'main' | 'expand'>('main');
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<'nests' | 'home' | 'landscape' | 'expand' | 'godot'>('home');
  const hasShownFirstBee = useRef(false);
  const [showSiloModal, setShowSiloModal] = useState(false);
  // showOrdersModal removed
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  // New bee hatching alert state
  const [beeHatchAlert, setBeeHatchAlert] = useState({ visible: false, message: '' });

  const { getActiveMap } = useMapSystem();
  const activeMap = getActiveMap();
  const mapColors = activeMap
    ? activeMap.colors
    : { primary: '#86efac', secondary: '#4ade80', tertiary: '#22c55e' };

  const {
    plots,
    setPlots: setPlotsState,
    inventory,
    setInventory,
    selectedAction,
    setSelectedAction,
    selectedPlant,
    setSelectedPlant,
    resetGame,
  } = useGameState();

  const {
    showInventory,
    showShop,
    showSettings,
    panelHeight,
    closePanel,
    isAnyPanelOpen,
    isExpanded,
    toggleExpand,
    openPanel,
  } = usePanelManager();

  const { currentWater, maxWater, consumeWater } = useWaterSystem(false);
  const { pollinationFactor, incrementFactor, canSpawnBees } = usePollinationFactor();
  
  // Callback to show bee hatch alert that can be accessed globally
  const showBeeHatchAlert = useCallback((message: string) => {
    setBeeHatchAlert({ visible: true, message });
  }, []);

  // Make showBeeHatchAlert globally accessible for the functional code
  useEffect(() => {
    (globalThis as any).showBeeHatchAlert = showBeeHatchAlert;
    return () => {
      delete (globalThis as any).showBeeHatchAlert;
    };
  }, [showBeeHatchAlert]);
  const { hive, hives, addBees, buildNewHive, canBuildNewHive, getAvailableHives, hiveCost } = useHiveState();
  const { isDaytime } = useDayNightCycle();

  const updateHiveBeeCount = useCallback((count: number) => { const currentCount = hive.beeCount; const diff = count - currentCount; if (diff !== 0) setTimeout(() => addBees(diff), 0); }, [hive.beeCount, addBees]);
  const handleWeatherPress = useCallback(() => { router.push('/settings'); }, [router]);
  const handleBuildHive = useCallback(() => { if (canBuildNewHive(inventory.coins)) { buildNewHive(); setInventory(prev => ({ ...prev, coins: prev.coins - hiveCost })); } }, [buildNewHive, canBuildNewHive, inventory.coins, hiveCost, setInventory]);
  const handleFillHivesFromPollinationFactor = useCallback(() => {
    console.log('🐝 handleFillHivesFromPollinationFactor called');
    console.log('Pollination factor:', pollinationFactor);
    console.log('Hives:', hives);
    
    // Note: This callback uses a simplified calculation. For time-based bee generation,
    // use the Fill Hives button in Settings which properly tracks elapsed time.
    // This function calculates bees earned from pollination score instantaneously.
    
    const HIVE_CAPACITY = 100;
    const totalCapacity = hives.length * HIVE_CAPACITY;
    const currentTotal = hives.reduce((sum, h) => sum + h.beeCount, 0);
    const remainingCapacity = totalCapacity - currentTotal;
    const projectedTotal = currentTotal + Math.floor(pollinationFactor.factor * 0.1);
    
    console.log('Total capacity:', totalCapacity);
    console.log('Current total bees:', currentTotal);
    console.log('Remaining capacity:', remainingCapacity);
    console.log('Pollination score * 0.1:', pollinationFactor.factor * 0.1);
    
    // Only proceed if projected total would be >= 10 (minimum requirement)
    if (projectedTotal >= 10) {
      const beesToAdd = Math.min(Math.floor(pollinationFactor.factor * 0.1), remainingCapacity);
      
      console.log('Bees to add:', beesToAdd);
      
      if (beesToAdd > 0) {
        let remaining = beesToAdd;
        // Calculate all updates first before calling addBees
        const updates: {hiveId: string, count: number}[] = [];
        
        for (const h of hives) {
          const hiveCapacity = HIVE_CAPACITY - h.beeCount;
          const beesForThisHive = Math.min(remaining, hiveCapacity);
          console.log(`Adding ${beesForThisHive} bees to hive ${h.id} (current: ${h.beeCount})`);
          if (beesForThisHive > 0) {
            updates.push({ hiveId: h.id, count: beesForThisHive });
            remaining -= beesForThisHive;
          }
        }
        
        // Apply all updates
        updates.forEach(update => {
          console.log(`Calling addBees(${update.count}, ${update.hiveId})`);
          addBees(update.count, update.hiveId);
        });
        
        console.log('🐝 Bees added successfully, total updates:', updates.length);
      } else {
        console.log('No remaining capacity - hives are full');
      }
    } else {
      console.log(`Not enough bees - projected total ${projectedTotal} is less than minimum 10`);
    }
  }, [pollinationFactor.factor, hives, addBees]);

  useEffect(() => { if (canSpawnBees && !hasShownFirstBee.current) hasShownFirstBee.current = true; }, [canSpawnBees]);

  // Order generation removed
  
  // Render screen content based on current screen
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        const HomeContent = require('./HomeContent').HomeContent;
        // Calculate current page plots (6 per page)
        const PLOTS_PER_PAGE = 6;
        const currentPageIndex = verticalPage === 'main' ? 0 : 1;
        const startIndex = currentPageIndex * PLOTS_PER_PAGE;
        const currentPagePlots = plots.slice(startIndex, startIndex + PLOTS_PER_PAGE);
        
        return (
          <HomeContent
            plots={currentPagePlots}
            setPlots={setPlotsState}
            inventory={inventory}
            setInventory={setInventory}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            selectedPlant={selectedPlant}
            consumeWater={consumeWater}
            incrementPollinationFactor={incrementFactor}
            isDaytime={isDaytime}
            pollinationFactor={pollinationFactor?.factor}
            hiveCount={hives.length}
            hives={hives}
            updateHiveBeeCount={updateHiveBeeCount}
            verticalPage={verticalPage}
            totalPlots={plots.length}
            baseIndex={startIndex}
          />
        );
      case 'nests':
        const NestsContent = require('./NestsContent').NestsContent;
        return (
          <NestsContent
            pollinationFactor={pollinationFactor}
            canSpawnBees={canSpawnBees}
            hive={hive}
            hives={hives}
            onBuildHive={handleBuildHive}
            canBuildHive={canBuildNewHive(inventory.coins)}
            hiveCost={hiveCost}
            coinBalance={inventory.coins}
            hiveNectarLevels={{}}
            maxNectar={100}
            inventory={inventory}
            onInventoryUpdate={setInventory}
          />
        );
      case 'landscape':
        return (
          <View style={styles.landscapeContainer}>
            <Text style={styles.landscapeText}>🌄 Landscape View</Text>
            <Text style={styles.landscapeSubtext}>Coming Soon!</Text>
          </View>
        );
      case 'expand':
        return (
          <View style={styles.expandContainer}>
            <Text style={styles.expandText}>🔍 Expanded Farm</Text>
            <Text style={styles.expandSubtext}>Coming Soon!</Text>
          </View>
        );
      default:
        return null;
    }
  };

    // When the user navigates to the expanded farm page, reload plots from storage
    useEffect(() => {
      const refreshPlotsFromStorage = async () => {
        try {
          const [storedPlots, storedInventory] = await Promise.all([
            AsyncStorage.getItem('plots'),
            AsyncStorage.getItem('inventory'),
          ]);
          if (storedPlots) setPlotsState(JSON.parse(storedPlots));
          if (storedInventory) setInventory(JSON.parse(storedInventory));
        } catch (e) {
          // ignore storage read errors
        }
      };

      refreshPlotsFromStorage();
    }, [verticalPage, setPlotsState]);

  // Nectar bottling removed

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.statusBarArea} />
        <StatusBar style="light" hidden />
        <GameHeader 
          coins={inventory.coins} 
          water={currentWater} 
          maxWater={maxWater} 
          weather="sunny" 
          isDaytime={isDaytime} 
          onWeatherPress={handleWeatherPress} 
          onOpenShop={() => openPanel('shop')} 
          level={experience?.level ?? 0}
          onLevelPress={() => {
            router.push('/experience');
          }}
        />
        <LinearGradient colors={[mapColors.primary, mapColors.secondary, mapColors.tertiary]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.contentContainer}>
          {renderScreenContent()}
        </View>
        <SimpleToolbar 
          selectedTool={selectedAction} 
          onToolSelect={(tool) => setSelectedAction(tool)} 
          onPlantSelect={setSelectedPlant} 
          canTill={plots.some(p => p.state === 'empty')} 
          canPlant={plots.some(p => p.state === 'tilled')} 
          canWater={plots.some(p => (p.state === 'planted' || p.state === 'growing') && p.needsWater)} 
          canHarvest={plots.some(p => p.state !== 'empty')} 
          seedInventory={inventory.seeds} 
          currentRoute={currentScreen} 
          onNavigate={setCurrentScreen} 
          verticalPage={verticalPage} 
          onVerticalNavigate={() => setVerticalPage('expand')} 
          onVerticalUpNavigate={() => setVerticalPage('main')} 
          showDownArrow={verticalPage === 'main' && plots.length > 6} 
        />
        <BottomPanels 
          isAnyPanelOpen={isAnyPanelOpen} 
          showInventory={showInventory} 
          showShop={showShop} 
          showSettings={showSettings} 
          panelHeight={panelHeight} 
          inventory={inventory} 
          setInventory={setInventory} 

          closePanel={closePanel} 
          onResetGame={resetGame} 
          isExpanded={isExpanded} 
          toggleExpand={toggleExpand} 
          pollinationFactor={pollinationFactor} 
          onFillHives={handleFillHivesFromPollinationFactor} 
        />
        {/* Orders removed */}
        <SiloModal 
          visible={showSiloModal} 
          onClose={() => setShowSiloModal(false)} 
          inventory={inventory} 
          setInventory={setInventory} 
        />
        <BeeHatchAlert 
          visible={beeHatchAlert.visible} 
          message={beeHatchAlert.message}
          onClose={() => setBeeHatchAlert({ visible: false, message: '' })}
        />
        <Toast 
          visible={toastVisible} 
          title={toastTitle} 
          message={toastMessage} 
          type={toastType} 
          onDismiss={() => setToastVisible(false)} 
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarArea: {
    height: Platform.OS === 'ios' ? 44 : 20,
    backgroundColor: 'rgba(120, 53, 15, 0.9)',
    zIndex: 30,
    elevation: 30,
  },
  contentContainer: {
    flex: 1,
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  landscapeText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  landscapeSubtext: {
    fontSize: 16,
    color: '#666',
  },
  expandContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  expandText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expandSubtext: {
    fontSize: 16,
    color: '#666',
  },
});