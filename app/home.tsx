import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import ClassificationModalV2 from "../components/_legacy/ClassificationModalV2";
import { FirstBeeAnimation } from "../components/animations/FirstBeeAnimation";
import { HoneyProductionDebug } from "../components/debug/HoneyProductionDebug";
import { BottomPanels } from "../components/garden/BottomPanels";
import { MapOverview } from "../components/garden/MapOverview";
import { SimpleToolbar } from "../components/garden/SimpleToolbar";
import { OrdersModal } from "../components/modals/OrdersModal";
import { SiloModal } from "../components/modals/SiloModal";
import { GameHeader } from "../components/ui/GameHeader";
import { Toast } from "../components/ui/Toast";
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { useFlyingBees } from '../hooks/useFlyingBees';
import { useGameState } from '../hooks/useGameState';
import { useHiveNectar } from '../hooks/useHiveNectar';
import { useHiveState } from '../hooks/useHiveState';
import { useHoneyProduction } from '../hooks/useHoneyProduction';
import { useMapSystem } from '../hooks/useMapSystem';
import { usePanelManager } from '../hooks/usePanelManager';
import { usePollinationFactor } from '../hooks/usePollinationFactor';
import { useWaterSystem } from '../hooks/useWaterSystem';
import { checkAndGenerateOrders } from '../lib/orderGeneration';
import { supabase } from '../lib/supabase';
import { recordClassification } from '../lib/userExperience';

// Import screen content components
import type { FarmRoute } from "../components/garden/SimpleToolbar";
import { ExpandContent } from "../components/screens/ExpandContent";
import { HomeContent } from "../components/screens/HomeContent";
import { LandscapeContent } from "../components/screens/LandscapeContent";
import { NestsContent } from "../components/screens/NestsContent";

export default function HomeScreen() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<FarmRoute>("home");
  const [showMapOverview, setShowMapOverview] = useState(false);
  const [showFirstBeeAnimation, setShowFirstBeeAnimation] = useState(false);
  const hasShownFirstBee = useRef(false);
  const [debugConstantBeeSpawn, setDebugConstantBeeSpawn] = useState(false);
  const [selectedBeeId, setSelectedBeeId] = useState<string | null>(null);
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [currentAnomaly, setCurrentAnomaly] = useState<any>(null);
  const [showSiloModal, setShowSiloModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastTitle, setToastTitle] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Map system
  const { getActiveMap, setActiveMap, getAllMaps } = useMapSystem();
  const activeMap = getActiveMap();
  const mapColors = activeMap
    ? activeMap.colors
    : {
        primary: "#86efac",
        secondary: "#4ade80",
        tertiary: "#22c55e",
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
    isExpanded,
    toggleExpand,
  } = usePanelManager();

  // Weather and water
  const { currentWater, maxWater, consumeWater } = useWaterSystem(false);

  // Pollination factor - single instance for entire app
  const { pollinationFactor, incrementFactor, canSpawnBees } =
    usePollinationFactor();

  // Hive state
  const { 
    hive, 
    hives, 
    addBees, 
    buildNewHive, 
    canBuildNewHive, 
    getAvailableHives,
    hiveCost 
  } = useHiveState();

  // Day/night cycle
  const { isDaytime } = useDayNightCycle();

  // Nectar system
  const { hiveNectarLevels, addNectarBonus, updateNectarLevels } = useHiveNectar(hives, isDaytime);

  // Flying bees system
  const { flyingBees, removeBee } = useFlyingBees(hives, isDaytime, debugConstantBeeSpawn, plots);

  // Transform plots to format expected by honey production system
  const activeCropsForHoney = plots
    .map((plot, index) => {
      if (plot.cropType && (plot.state === 'planted' || plot.state === 'growing') && plot.growthStage >= 2) {
        return {
          cropId: plot.cropType,
          plotId: `plot-${index}`,
          growthStage: plot.growthStage,
          position: { x: index % 3, y: Math.floor(index / 3) } // Simple 3x2 grid positioning
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ 
      cropId: string; 
      plotId: string; 
      growthStage: number; 
      position: { x: number; y: number } 
    }>;

  // Honey production system - integrate with existing hive system
  const {
    recordCropHarvest,
    getHiveInfo,
    getProductionStats,
    fastForwardProduction,
    isAutoFillEnabled
  } = useHoneyProduction({
    hives: hives.map(h => ({ 
      id: h.id, 
      position: { x: 0, y: 0 } // Default position, could be enhanced later
    })),
    activeCrops: activeCropsForHoney,
    autoFillEnabled: true // Loaded from AsyncStorage in the hook
  });

  // Memoized callback to update hive bee count
  const updateHiveBeeCount = useCallback((count: number) => {
    const currentCount = hive.beeCount;
    const diff = count - currentCount;
    if (diff !== 0) {
      // Schedule state update after render completes
      setTimeout(() => addBees(diff), 0);
    }
  }, [hive.beeCount, addBees]);

  // Enhanced setPlots wrapper to track harvests for honey production
  const enhancedSetPlots = useCallback((newPlots: typeof plots) => {
    // Check for harvested crops by comparing old and new states
    plots.forEach((oldPlot, index) => {
      const newPlot = newPlots[index];
      
      // Detect if a crop was harvested (had crop, now empty)
      if (oldPlot.cropType && 
          oldPlot.state !== 'empty' && 
          newPlot.state === 'empty' && 
          oldPlot.growthStage >= 4) {
        // Record the harvest for honey production
        recordCropHarvest(oldPlot.cropType, 1);
      }
    });
    
    // Update the plots
    setPlots(newPlots);
  }, [plots, recordCropHarvest, setPlots]);

  // Handle weather icon press to open settings
  const handleWeatherPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  // Handle building a new hive
  const handleBuildHive = useCallback(() => {
    if (canBuildNewHive(inventory.coins)) {
      buildNewHive();
      setInventory(prev => ({
        ...prev,
        coins: prev.coins - hiveCost,
      }));
      console.log('🏗️ Built new hive for', hiveCost, 'coins');
    }
  }, [buildNewHive, canBuildNewHive, inventory.coins, hiveCost, setInventory]);

  // Trigger first bee animation when threshold is reached
  useEffect(() => {
    if (canSpawnBees && !hasShownFirstBee.current) {
      hasShownFirstBee.current = true;
      setShowFirstBeeAnimation(true);
    }
  }, [canSpawnBees]);

  // Periodic order generation check
  useEffect(() => {
    // Check immediately on mount
    checkAndGenerateOrders().catch(err => 
      console.error('Failed to check orders:', err)
    );

    // Check every minute for new orders
    const interval = setInterval(() => {
      checkAndGenerateOrders().catch(err => 
        console.error('Failed to check orders:', err)
      );
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle bee press for classification
  const handleBeePress = useCallback(async (beeId: string) => {
    setSelectedBeeId(beeId);
    
    // Fetch random bumble anomaly
    try {
      const { data: anomalies, error } = await supabase
        .from('anomalies')
        .select('*')
        .eq('anomalySet', 'bumble')
        .limit(100);
      
      if (error) throw error;
      
      if (anomalies && anomalies.length > 0) {
        const randomAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        setCurrentAnomaly(randomAnomaly);
        setShowClassificationModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch anomaly:', error);
    }
  }, []);

  // Handle classification completion
  const handleClassificationComplete = useCallback(async (classification: string) => {
    addNectarBonus(10);
    if (selectedBeeId) {
      removeBee(selectedBeeId);
      setSelectedBeeId(null);
    }
    setShowClassificationModal(false);
    setDebugConstantBeeSpawn(false);
    
    // Track classification for experience
    try {
      await recordClassification();
    } catch (error) {
      console.error('Failed to record classification:', error);
    }

    // Save classification to Supabase
    if (currentAnomaly) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const imageUrl = `http://127.0.0.1:54321/storage/v1/object/public/${currentAnomaly.avatar_url}`;
          
          await supabase.from('classifications').insert({
            content: classification,
            author: user.id,
            anomaly: currentAnomaly.id,
            media: JSON.stringify({ imageUrl }),
            classificationtype: currentAnomaly.anomalytype,
            classificationConfiguration: JSON.stringify({
              beeId: selectedBeeId,
              timestamp: Date.now(),
              selected: classification,
            }),
          });
        }
      } catch (error) {
        console.error('Failed to save classification:', error);
      }
    }
    
    setCurrentAnomaly(null);
  }, [addNectarBonus, selectedBeeId, removeBee, currentAnomaly]);

  const pinchGesture = Gesture.Pinch().onEnd((event) => {
    if (event.scale > 1.2) {
      setShowMapOverview(true);
    }
  });

  const handleNavigate = (route: FarmRoute) => {
    setCurrentScreen(route);
  };

  const handleSelectMap = async (mapId: string) => {
    await setActiveMap(mapId as any);
  };

  // Handle bottle action when on nests screen
  useEffect(() => {
    if (selectedAction === 'bottle' && currentScreen === 'nests') {
      const result = require('../lib/nectarBottling').bottleNectar(inventory, hiveNectarLevels);
      if (result) {
        setInventory(result.updatedInventory);
        updateNectarLevels(result.updatedNectarLevels);
        setToastTitle("🍯 Success!");
        setToastMessage("You bottled 10 nectar. Check your inventory!");
        setToastType('success');
        setToastVisible(true);
      } else {
        const bottles = (inventory.items || {}).glass_bottle || 0;
        const totalNectar = require('../lib/nectarBottling').getTotalNectar(hiveNectarLevels);
        let message = "";
        if (bottles < 1) {
          message = "You need a glass bottle. Buy one from the shop!";
        } else if (totalNectar < 10) {
          message = `Need 10 nectar to bottle. You have ${totalNectar.toFixed(1)}.`;
        } else {
          message = "Cannot bottle nectar right now.";
        }
        setToastTitle("Cannot Bottle");
        setToastMessage(message);
        setToastType('error');
        setToastVisible(true);
      }
      setSelectedAction(null);
    }
  }, [selectedAction, currentScreen, inventory, hiveNectarLevels, setInventory, updateNectarLevels, setSelectedAction]);

  // Render current screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case "nests":
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
            hiveNectarLevels={hiveNectarLevels}
            maxNectar={100}
            inventory={inventory}
            onInventoryUpdate={setInventory}
            onNectarUpdate={updateNectarLevels}
          />
        );
      case "landscape":
        return <LandscapeContent 
          onNavigateToFarm={() => handleNavigate('home')} 
          onOpenSiloModal={() => setShowSiloModal(true)} 
          onOpenOrdersModal={() => setShowOrdersModal(true)} 
          water={inventory.water}
          maxWater={100}
        />;
      case "expand":
        return <ExpandContent />;
      case "home":
      default:
        return (
          <HomeContent
            plots={plots}
            setPlots={enhancedSetPlots}
            inventory={inventory}
            setInventory={setInventory}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            selectedPlant={selectedPlant}
            consumeWater={consumeWater}
            incrementPollinationFactor={incrementFactor}
            isDaytime={isDaytime}
            pollinationFactor={pollinationFactor.factor}
            hiveCount={getAvailableHives().length}
            updateHiveBeeCount={updateHiveBeeCount}
            flyingBees={flyingBees}
            onBeePress={handleBeePress}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pinchGesture}>
        <View style={styles.container}>
          {/* Status bar area background */}
          <View style={styles.statusBarArea} />
          <StatusBar style="light" />

          {/* Fixed Header - Never reloads */}
          <GameHeader
            coins={inventory.coins}
            water={currentWater}
            maxWater={maxWater}
            weather="sunny"
            isDaytime={isDaytime}
            onWeatherPress={handleWeatherPress}
          />

          {/* Background with active map colors */}
          <LinearGradient
            colors={[mapColors.primary, mapColors.secondary, mapColors.tertiary]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Dynamic Content Area - Swaps without reload */}
          <View style={styles.contentContainer}>{renderScreenContent()}</View>

          {/* Fixed Toolbar - Always visible, navigation works on all screens */}
          <SimpleToolbar
            selectedTool={selectedAction}
            onToolSelect={setSelectedAction}
            onPlantSelect={setSelectedPlant}
            canTill={plots.some((p) => p.state === "empty")}
            canPlant={plots.some((p) => p.state === "tilled")}
            canWater={plots.some(
              (p) =>
                (p.state === "planted" || p.state === "growing") && p.needsWater
            )}
            canHarvest={plots.some((p) => p.state !== "empty")}
            seedInventory={inventory.seeds}
            currentRoute={currentScreen}
            onNavigate={handleNavigate}
          />

          {/* Fixed Bottom Bar - Removed per user request */}
          {/* Bottom bar with 4 icons removed from home/farm view */}

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
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
            debugConstantBeeSpawn={debugConstantBeeSpawn}
            onToggleDebugBeeSpawn={setDebugConstantBeeSpawn}
          />

          {/* Map Overview Modal */}
          <MapOverview
            visible={showMapOverview}
            onClose={() => setShowMapOverview(false)}
            maps={getAllMaps().filter((m) => m.unlocked)}
            activeMapId={activeMap?.id || "default"}
            onSelectMap={handleSelectMap}
          />

          {/* First Bee Animation */}
          {showFirstBeeAnimation && (
            <FirstBeeAnimation
              onComplete={() => setShowFirstBeeAnimation(false)}
            />
          )}
          {/* Classification Modal */}
          <ClassificationModalV2
            visible={showClassificationModal}
            onClose={() => {
              setShowClassificationModal(false);
              setSelectedBeeId(null);
              setCurrentAnomaly(null);
            }}
            onClassify={handleClassificationComplete}
            anomalyId={currentAnomaly?.id}
            anomalyImageUrl={currentAnomaly ? `http://127.0.0.1:54321/storage/v1/object/public/${currentAnomaly.avatar_url}` : undefined}
          />

          {/* Silo Modal */}
          <SiloModal
            visible={showSiloModal}
            onClose={() => setShowSiloModal(false)}
            inventory={inventory}
            setInventory={setInventory}
          />

          {/* Orders Modal */}
          <OrdersModal
            visible={showOrdersModal}
            onClose={() => setShowOrdersModal(false)}
            inventory={inventory}
            setInventory={setInventory}
          />

          {/* Toast Notification */}
          <Toast
            visible={toastVisible}
            title={toastTitle}
            message={toastMessage}
            type={toastType}
            onDismiss={() => setToastVisible(false)}
            duration={3000}
          />

          {/* Honey Production Debug Panel */}
          <HoneyProductionDebug
            getProductionStats={getProductionStats}
            getHiveInfo={getHiveInfo}
            hiveIds={hives.map(h => h.id)}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  statusBarArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 60 : 20,
    backgroundColor: 'rgba(120, 53, 15, 0.9)',
    zIndex: 19,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
});
