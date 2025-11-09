import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useClassification } from '@/hooks/useClassification';
import { useGameState } from '@/hooks/useGameState';
import { usePanelManager } from '@/hooks/usePanelManager';
import { usePlotActions } from '@/hooks/usePlotActions';
import { useWaterSystem } from '@/hooks/useWaterSystem';
import { isRainingAtUserLocation } from '@/lib/locationWeather';
import ClassificationModal from '../components/actions/ClassificationModal';
import { HarvestAnimation } from '../components/animations/HarvestAnimation';
import { SellAnimation } from '../components/animations/SellAnimation';
import { BottomPanels } from '../components/garden/BottomPanels';
import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { GardenGrid } from '../components/garden/GardenGrid';
import { HoveringBees } from '../components/garden/HoveringBees';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { GameHeader } from '../components/ui/GameHeader';

export default function HomeScreen() {
  const router = useRouter();
  
  // Custom hooks
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

  // Weather state for water system
  const [isRaining, setIsRaining] = useState(false);
  
  // Water system hook
  const { currentWater, maxWater, consumeWater } = useWaterSystem(isRaining);
  
  // Classification modal state
  const [showClassification, setShowClassification] = useState(false);
  const [classificationPlotIndex, setClassificationPlotIndex] = useState<number | null>(null);
  
  // Classification hook
  const { 
    currentAnomaly, 
    anomalyImageUrl, 
    isLoading: isLoadingAnomaly,
    fetchRandomAnomaly,
    submitClassification 
  } = useClassification();
  
  // Harvest animation state
  const [showHarvestAnimation, setShowHarvestAnimation] = useState(false);
  const [harvestReward, setHarvestReward] = useState({ cropEmoji: '', cropCount: 0, seedCount: 0 });
  
  // Sell animation state
  const [showSellAnimation, setShowSellAnimation] = useState(false);
  const [sellData, setSellData] = useState({ cropEmoji: '', cropCount: 0, coinsEarned: 0 });

  // Check weather periodically for water system
  useEffect(() => {
    const checkWeather = async () => {
      try {
        const raining = await isRainingAtUserLocation();
        setIsRaining(raining);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };
    
    checkWeather();
    const interval = setInterval(checkWeather, 300000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Plot actions hook
  const { handlePlotPress } = usePlotActions({
    plots,
    setPlots,
    inventory,
    setInventory,
    selectedAction,
    selectedPlant,
    consumeWater,
    setClassificationPlotIndex,
    setShowClassification: (show: boolean) => {
      // When opening classification modal, fetch a new anomaly
      if (show) {
        fetchRandomAnomaly();
      }
      setShowClassification(show);
    },
    setHarvestReward,
    setShowHarvestAnimation,
    setSelectedAction,
  });

  const handleClassification = async (beeType: string) => {
    if (classificationPlotIndex === null) {
      return;
    }

    // Submit classification to database
    const success = await submitClassification(beeType, [classificationPlotIndex]);
    
    if (!success) {
      console.log('Failed to submit classification');
      return;
    }

    // Update plot state on success
    const newPlots = [...plots];
    const plot = newPlots[classificationPlotIndex];

    newPlots[classificationPlotIndex] = {
      ...plot,
      growthStage: 5,
      needsWater: false,
      state: 'growing',
    };

    setPlots(newPlots);
    setShowClassification(false);
    setClassificationPlotIndex(null);
    
    // Fetch next anomaly for future classifications
    fetchRandomAnomaly();
  };

  const handleHarvestClick = () => {
    setSelectedAction('harvest');
  };

  const handleShovelClick = () => {
    setSelectedAction('shovel');
  };

  const canHarvest = plots.some(plot => plot.state !== 'empty' && plot.growthStage === 5);
  const canShovel = plots.some(plot => plot.state !== 'empty');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <GameHeader 
        coins={inventory.coins} 
        water={currentWater} 
        maxWater={maxWater}
        weather="sunny"
        onHarvestClick={handleHarvestClick}
        onShovelClick={handleShovelClick}
        canHarvest={canHarvest}
        canShovel={canShovel} 
        isHarvestSelected={selectedAction === 'harvest'}
        isShovelSelected={selectedAction === 'shovel'}
      />
      
      {/* Grass background */}
      <LinearGradient 
        colors={['#86efac', '#4ade80', '#22c55e']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      {/* Hovering Bees */}
      <HoveringBees isDaytime={true} count={5} />

      {/* Garden with fence */}
      <ScrollView contentContainerStyle={styles.content}>
        <GardenGrid 
          plots={plots}
          selectedTool={selectedAction}
          onPlotPress={handlePlotPress}
        />
      </ScrollView>

      <SimpleToolbar 
        selectedTool={selectedAction}
        onToolSelect={setSelectedAction}
        onPlantSelect={setSelectedPlant}
        canTill={plots.some(p => p.state === 'empty')}
        canPlant={plots.some(p => p.state === 'tilled')}
        canWater={plots.some(p => (p.state === 'planted' || p.state === 'growing') && p.needsWater)}
        canShovel={plots.some(p => p.state !== 'empty')}
        seedInventory={inventory.seeds}
        currentRoute="home"
        onNavigate={(route) => router.push(route as any)}
      />
      <GardenBottomBar 
        onOpenAlmanac={() => openPanel('almanac')}
        onOpenInventory={() => openPanel('inventory')}
        onOpenShop={() => openPanel('shop')}
        onOpenSettings={() => openPanel('settings')}
      />

      {/* Classification Modal - Full screen */}
      <ClassificationModal
        visible={showClassification}
        onClose={() => {
          setShowClassification(false);
          setClassificationPlotIndex(null);
        }}
        onClassify={handleClassification}
        anomalyId={currentAnomaly?.id ?? 0}
        anomalyImageUrl={anomalyImageUrl ?? "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/303933561/1800"}
      />

      {/* Harvest Animation */}
      <HarvestAnimation
        visible={showHarvestAnimation}
        cropEmoji={harvestReward.cropEmoji}
        cropCount={harvestReward.cropCount}
        seedCount={harvestReward.seedCount}
        onComplete={() => setShowHarvestAnimation(false)}
      />
      
      {/* Sell Animation */}
      <SellAnimation
        visible={showSellAnimation}
        cropEmoji={sellData.cropEmoji}
        cropCount={sellData.cropCount}
        coinsEarned={sellData.coinsEarned}
        onComplete={() => setShowSellAnimation(false)}
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
        onSellCrop={(cropType: string, count: number, coinsEarned: number, emoji: string) => {
          setSellData({ cropEmoji: emoji, cropCount: count, coinsEarned });
          setShowSellAnimation(true);
        }}
        closePanel={closePanel}
        onResetGame={resetGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
