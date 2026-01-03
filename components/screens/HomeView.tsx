import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDayNightCycle } from '../../hooks/useDayNightCycle';
import { useFlyingBees } from '../../hooks/useFlyingBees';
import type { Tool } from '../../hooks/useGameState';
import { useGameState } from '../../hooks/useGameState';
import { useHiveNectar } from '../../hooks/useHiveNectar';
import { useHiveState } from '../../hooks/useHiveState';
import { useHoneyProduction } from '../../hooks/useHoneyProduction';
import { useMapSystem } from '../../hooks/useMapSystem';
import { usePanelManager } from '../../hooks/usePanelManager';
import { usePlayerExperience } from '../../hooks/usePlayerExperience';
import { usePollinationFactor } from '../../hooks/usePollinationFactor';
import { useWaterSystem } from '../../hooks/useWaterSystem';
import { checkAndGenerateOrders } from '../../lib/orderGeneration';
import { BottomPanels } from '../garden/BottomPanels';
import { SimpleToolbar } from '../garden/SimpleToolbar';
import { OrdersModal } from '../modals/OrdersModal';
import { SiloModal } from '../modals/SiloModal';
import { GameHeader } from '../ui/GameHeader';
import { Toast } from '../ui/Toast';
import { FarmPager } from './FarmPager';
import { NestsContent } from './NestsContent';

export function HomeView() {
  const { experience } = usePlayerExperience();
  const [verticalPage, setVerticalPage] = useState<'main' | 'expand'>('main');
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<'nests' | 'home' | 'landscape' | 'expand' | 'godot'>('home');
  const hasShownFirstBee = useRef(false);
  const [showSiloModal, setShowSiloModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

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
    showAlmanac,
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
  const { hive, hives, addBees, buildNewHive, canBuildNewHive, getAvailableHives, hiveCost } = useHiveState();
  const { isDaytime } = useDayNightCycle();
  const { hiveNectarLevels, updateNectarLevels } = useHiveNectar(hives, isDaytime);
  const { flyingBees } = useFlyingBees(hives, isDaytime, false, plots);

  const activeCropsForHoney = plots
    .map((plot, index) => {
      if (plot.cropType && (plot.state === 'planted' || plot.state === 'growing') && plot.growthStage >= 2) {
        return { cropId: plot.cropType, plotId: `plot-${index}`, growthStage: plot.growthStage, position: { x: index % 3, y: Math.floor(index / 3) } };
      }
      return null;
    })
    .filter(Boolean) as any[];

  useHoneyProduction({ hives: hives.map(h => ({ id: h.id, position: { x: 0, y: 0 } })), activeCrops: activeCropsForHoney, autoFillEnabled: true });

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
        const updates: Array<{hiveId: string, count: number}> = [];
        
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

  useEffect(() => {
    checkAndGenerateOrders().catch(err => console.error('Failed to check orders:', err));
    const interval = setInterval(() => checkAndGenerateOrders().catch(err => console.error('Failed to check orders:', err)), 60000);
    return () => clearInterval(interval);
  }, []);
  
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

  useEffect(() => {
    if ((selectedAction as any) === 'bottle' && currentScreen === 'nests') {
      import('../../lib/nectarBottling').then(nectarBottling => {
        const result = nectarBottling.bottleNectar(inventory, hiveNectarLevels);
        if (result) { setInventory(result.updatedInventory); updateNectarLevels(result.updatedNectarLevels); setToastTitle('🍯 Success!'); setToastMessage('You bottled 10 nectar. Check your inventory!'); setToastType('success'); setToastVisible(true); }
        else { const bottles = (inventory.items || {}).glass_bottle || 0; const totalNectar = nectarBottling.getTotalNectar(hiveNectarLevels); let message = ''; if (bottles < 1) message = 'You need a glass bottle. Buy one from the shop!'; else if (totalNectar < 10) message = `Need 10 nectar to bottle. You have ${totalNectar.toFixed(1)}.`; else message = 'Cannot bottle nectar right now.'; setToastTitle('Cannot Bottle'); setToastMessage(message); setToastType('error'); setToastVisible(true); }
        setSelectedAction(null);
      });
    }
  }, [selectedAction, currentScreen, inventory, hiveNectarLevels, setInventory, updateNectarLevels, setSelectedAction]);

  const handleBeePress = useCallback(async (beeId: string) => {}, []);

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'nests':
        return <NestsContent pollinationFactor={pollinationFactor} canSpawnBees={canSpawnBees} hive={hive} hives={hives} onBuildHive={handleBuildHive} canBuildHive={canBuildNewHive(inventory.coins)} hiveCost={hiveCost} coinBalance={inventory.coins} hiveNectarLevels={hiveNectarLevels} maxNectar={100} inventory={inventory} onInventoryUpdate={setInventory} onNectarUpdate={updateNectarLevels} />;
      default:
        return <FarmPager plots={plots} setPlotsState={setPlotsState} inventory={inventory} setInventory={setInventory} selectedAction={selectedAction as Tool} setSelectedAction={setSelectedAction} selectedPlant={selectedPlant} consumeWater={consumeWater} incrementPollinationFactor={incrementFactor} isDaytime={isDaytime} pollinationFactor={pollinationFactor.factor} hiveCount={getAvailableHives().length} updateHiveBeeCount={updateHiveBeeCount} flyingBees={flyingBees} onBeePress={handleBeePress} verticalPage={verticalPage} />;
    }
  };

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
        <View style={styles.contentContainer}>{renderScreenContent()}</View>
        <SimpleToolbar selectedTool={selectedAction} onToolSelect={(tool) => setSelectedAction(tool)} onPlantSelect={setSelectedPlant} canTill={plots.some(p => p.state === 'empty')} canPlant={plots.some(p => p.state === 'tilled')} canWater={plots.some(p => (p.state === 'planted' || p.state === 'growing') && p.needsWater)} canHarvest={plots.some(p => p.state !== 'empty')} seedInventory={inventory.seeds} currentRoute={currentScreen} onNavigate={setCurrentScreen} verticalPage={verticalPage} onVerticalNavigate={() => setVerticalPage('expand')} onVerticalUpNavigate={() => setVerticalPage('main')} showDownArrow={verticalPage === 'main' && plots.length > 6} />
        <BottomPanels isAnyPanelOpen={isAnyPanelOpen} showAlmanac={showAlmanac} showInventory={showInventory} showShop={showShop} showSettings={showSettings} panelHeight={panelHeight} inventory={inventory} setInventory={setInventory} onSellCrop={() => {}} closePanel={closePanel} onResetGame={resetGame} isExpanded={isExpanded} toggleExpand={toggleExpand} pollinationFactor={pollinationFactor} onFillHives={handleFillHivesFromPollinationFactor} />
        <OrdersModal visible={showOrdersModal} onClose={() => setShowOrdersModal(false)} inventory={inventory} setInventory={setInventory} />
        <SiloModal visible={showSiloModal} onClose={() => setShowSiloModal(false)} inventory={inventory} setInventory={setInventory} />
        <Toast visible={toastVisible} title={toastTitle} message={toastMessage} type={toastType} onDismiss={() => setToastVisible(false)} />
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
});
