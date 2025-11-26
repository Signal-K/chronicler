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
import { BottomPanels } from "../components/garden/BottomPanels";
import { GardenBottomBar } from "../components/garden/GardenBottomBar";
import { MapOverview } from "../components/garden/MapOverview";
import { SimpleToolbar } from "../components/garden/SimpleToolbar";
import { GameHeader } from "../components/ui/GameHeader";
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { useFlyingBees } from '../hooks/useFlyingBees';
import { useGameState } from '../hooks/useGameState';
import { useHiveNectar } from '../hooks/useHiveNectar';
import { useHiveState } from '../hooks/useHiveState';
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

  // Memoized callback to update hive bee count
  const updateHiveBeeCount = useCallback((count: number) => {
    const currentCount = hive.beeCount;
    const diff = count - currentCount;
    if (diff !== 0) {
      // Schedule state update after render completes
      setTimeout(() => addBees(diff), 0);
    }
  }, [hive.beeCount, addBees]);

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
      case "expand":
        return <ExpandContent />;
      case "home":
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
          />

          {/* Background with active map colors */}
          <LinearGradient
            colors={[mapColors.primary, mapColors.secondary, mapColors.tertiary]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Dynamic Content Area - Swaps without reload */}
          <View style={styles.contentContainer}>{renderScreenContent()}</View>

          {/* Fixed Toolbar - Never reloads */}
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
            canHarvest={plots.some(
              (p) => p.state !== "empty" && p.growthStage === 5
            )}
            canShovel={plots.some((p) => p.state !== "empty")}
            seedInventory={inventory.seeds}
            currentRoute={currentScreen}
            onNavigate={handleNavigate}
          />

          {/* Fixed Bottom Bar - Never reloads */}
          <GardenBottomBar
            onOpenAlmanac={() => openPanel("almanac")}
            onOpenInventory={() => openPanel("inventory")}
            onOpenShop={() => openPanel("shop")}
            onOpenSettings={() => openPanel("settings")}
            onOpenGodot={() => router.push("/godot" as any)}
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
