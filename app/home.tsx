import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomPanels } from "../components/garden/BottomPanels";
import type { FarmRoute } from "../components/garden/SimpleToolbar";
import { SimpleToolbar } from "../components/garden/SimpleToolbar";
import { OrdersModal } from "../components/modals/OrdersModal";
import { SiloModal } from "../components/modals/SiloModal";
import { HomeContent } from "../components/screens/HomeContent";
import { NestsContent } from "../components/screens/NestsContent";
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

export default function HomeScreen() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<FarmRoute>("home");
  const hasShownFirstBee = useRef(false);
  const [showSiloModal, setShowSiloModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastTitle, setToastTitle] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>("info");

  // Map system
  const { getActiveMap } = useMapSystem();
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
  const { hiveNectarLevels, updateNectarLevels } = useHiveNectar(hives, isDaytime);

  // Flying bees system
  const { flyingBees } = useFlyingBees(hives, isDaytime, false, plots);

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
    .filter(Boolean) as { 
      cropId: string; 
      plotId: string; 
      growthStage: number; 
      position: { x: number; y: number } 
    }[];

  // Honey production system - integrate with existing hive system
  useHoneyProduction({
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
      setTimeout(() => addBees(diff), 0);
    }
  }, [hive.beeCount, addBees]);

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
      // Removed setShowFirstBeeAnimation
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
    // Removed unused selectedBeeId, currentAnomaly, setShowClassificationModal
  }, []);

  // Handle classification completion
  // Removed unused: enhancedSetPlots, handleClassificationComplete, handleSelectMap

  // Handle bottle action when on nests screen
  useEffect(() => {
    if ((selectedAction as any) === 'bottle' && currentScreen === 'nests') {
      import('../lib/nectarBottling').then((nectarBottling) => {
        const result = nectarBottling.bottleNectar(inventory, hiveNectarLevels);
        if (result) {
          setInventory(result.updatedInventory);
          updateNectarLevels(result.updatedNectarLevels);
          setToastTitle("🍯 Success!");
          setToastMessage("You bottled 10 nectar. Check your inventory!");
          setToastType('success');
          setToastVisible(true);
        } else {
          const bottles = (inventory.items || {}).glass_bottle || 0;
          const totalNectar = nectarBottling.getTotalNectar(hiveNectarLevels);
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
      });
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
      case "home":
      default:
        // Only pass allowed tool types to HomeContent
        const allowedTools = ["till", "plant", "water", "shovel", "harvest", null];
        // Only pass allowed tool types to HomeContent
        const safeSelectedAction = allowedTools.includes(selectedAction) ? selectedAction : null;
        return (
          <HomeContent
            plots={plots}
            setPlots={setPlots}
            inventory={inventory}
            setInventory={setInventory}
            selectedAction={safeSelectedAction as "till" | "plant" | "water" | "shovel" | "harvest" | null}
            setSelectedAction={setSelectedAction as React.Dispatch<React.SetStateAction<"till" | "plant" | "water" | "shovel" | "harvest" | null>>}
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
      <View style={styles.container}>
          <View style={styles.statusBarArea} />
          <StatusBar style="light" />
          <GameHeader
            coins={inventory.coins}
            water={currentWater}
            maxWater={maxWater}
            weather="sunny"
            isDaytime={isDaytime}
            onWeatherPress={handleWeatherPress}
          />
          <LinearGradient
            colors={[mapColors.primary, mapColors.secondary, mapColors.tertiary]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.contentContainer}>{renderScreenContent()}</View>
          <SimpleToolbar
            selectedTool={selectedAction}
            onToolSelect={(tool) => setSelectedAction(tool)}
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
            onNavigate={setCurrentScreen}
            onVerticalNavigate={() => setCurrentScreen('expand')}
          />
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
          />
          <OrdersModal 
            visible={showOrdersModal} 
            onClose={() => setShowOrdersModal(false)} 
            inventory={inventory}
            setInventory={setInventory}
          />
          <SiloModal 
            visible={showSiloModal} 
            onClose={() => setShowSiloModal(false)} 
            inventory={inventory}
            setInventory={setInventory}
          />
          <Toast visible={toastVisible} title={toastTitle} message={toastMessage} type={toastType} onDismiss={() => setToastVisible(false)} />
        </View>
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

