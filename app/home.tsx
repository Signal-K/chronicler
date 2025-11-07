import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useWaterSystem } from '@/hooks/useWaterSystem';
import { canPlantCrop, getCropConfig } from '@/lib/cropConfig';
import { isRainingAtUserLocation } from '@/lib/locationWeather';
import ClassificationModal from '../components/actions/ClassificationModal';
import { HarvestAnimation } from '../components/animations/HarvestAnimation';
import { SellAnimation } from '../components/animations/SellAnimation';
import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { HoveringBees } from '../components/garden/HoveringBees';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { Inventory } from '../components/inventory/inventory';
import { SimplePlot } from '../components/placeables/SimplePlot';
import { GameHeader } from '../components/ui/GameHeader';
import { Almanac } from './screens/almanac';
import { Settings } from './screens/settings';
import { Shop } from './screens/shop';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type PlotData = {
  state: 'empty' | 'tilled' | 'planted' | 'growing';
  growthStage: number; // 0-5: 0=empty, 1=sprout, 2=young, 3=mature, 4=flowering, 5=ready to harvest
  cropType: string | null;
  needsWater: boolean;
  plantedAt?: number;
  lastWateredAt?: number;
};

type Tool = 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null;

export default function HomeScreen() {
  const [plots, setPlots] = useState<PlotData[]>(
    Array(6).fill(null).map(() => ({
      state: 'empty' as const,
      growthStage: 0,
      cropType: null,
      needsWater: false,
    }))
  );
  const [selectedAction, setSelectedAction] = useState<Tool>(null);
  const [selectedPlant, setSelectedPlant] = useState<string>('tomato');
  
  // Weather state for water system
  const [isRaining, setIsRaining] = useState(false);
  
  // Water system hook
  const { currentWater, maxWater, consumeWater } = useWaterSystem(isRaining);
  
  // Classification modal state
  const [showClassification, setShowClassification] = useState(false);
  const [classificationPlotIndex, setClassificationPlotIndex] = useState<number | null>(null);
  
  // Harvest animation state
  const [showHarvestAnimation, setShowHarvestAnimation] = useState(false);
  const [harvestReward, setHarvestReward] = useState({ cropEmoji: '', cropCount: 0, seedCount: 0 });
  
  // Sell animation state
  const [showSellAnimation, setShowSellAnimation] = useState(false);
  const [sellData, setSellData] = useState({ cropEmoji: '', cropCount: 0, coinsEarned: 0 });
  
  // Panel states (changed from modal states)
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Animation for bottom panels
  const [panelHeight] = useState(new Animated.Value(0));
  
  // Inventory state
  const [inventory, setInventory] = useState<{
    coins: number;
    water: number;
    seeds: Record<string, number>;
    harvested: Record<string, number>;
  }>({
    coins: 100,
    water: 100,
    seeds: { tomato: 5, carrot: 5, wheat: 5, corn: 5 },
    harvested: { tomato: 0, carrot: 0, wheat: 0, corn: 0 },
  });

  // Load from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [plotsData, inventoryData] = await Promise.all([
          AsyncStorage.getItem('plots'),
          AsyncStorage.getItem('inventory'),
        ]);
        
        if (plotsData) {
          setPlots(JSON.parse(plotsData));
        }
        
        if (inventoryData) {
          setInventory(JSON.parse(inventoryData));
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    
    loadData();
  }, []);

  // Save to storage
  useEffect(() => {
    AsyncStorage.setItem('plots', JSON.stringify(plots));
  }, [plots]);
  
  useEffect(() => {
    AsyncStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

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

  // Growth timer
  useEffect(() => {
   const interval = setInterval(() => {
    setPlots(currentPlots => {
      const now = Date.now();
      return currentPlots.map(plot => {
        if (plot.state !== 'planted' && plot.state !== 'growing') {
          return plot;
        };

        const timeSinceAction = plot.lastWateredAt
          ? now - plot.lastWateredAt
          : plot.plantedAt
          ? now - plot.plantedAt
          : 0;

        if (timeSinceAction >= 1000 && plot.growthStage < 5) {
          if (!plot.needsWater && plot.growthStage > 0) {
            return {
              ...plot,
              needsWater: true,
              state: 'growing' as const
            };
          };
        };

        return plot;
      });
    });
   }, 1000);

   return () => clearInterval(interval);
  }, []);

  const handlePlotPress = (index: number) => {
  if (!selectedAction) {
    Alert.alert('No Tool Selected', 'Please select a tool from the toolbar first');
    return;
  }

  const newPlots = [...plots];
  const current = plots[index];

  if (selectedAction === 'till') {
    if (current.state !== 'empty') {
      Alert.alert('Cannot Till', 'Plot must be empty');
      return;
    }
    newPlots[index] = {
      state: 'tilled',
      growthStage: 0,
      cropType: null,
      needsWater: false,
    };
    setPlots(newPlots);
    Alert.alert('✅ Tilled', `Plot ${index + 1} is now tilled`);
  } 
  else if (selectedAction === 'plant') {
    if (current.state !== 'tilled') {
      Alert.alert('Cannot plant', 'Plot must be tilled first');
      return;
    }

    if (!canPlantCrop(selectedPlant, inventory)) {
      Alert.alert('No seeds', `You don't have any ${selectedPlant} seeds!`);
      return;
    }
    
    const config = getCropConfig(selectedPlant);
    if (!config) {
      Alert.alert("Error", "Invalid crop type");
      return;
    }

    const newInventory = { ...inventory };
    if (config.plantRequirement.type === 'seed') {
      newInventory.seeds = {
        ...newInventory.seeds,
        [selectedPlant]: (newInventory.seeds[selectedPlant] || 0) - 1,
      };
    } else {
      newInventory.harvested = {
        ...newInventory.harvested,
        [selectedPlant]: (newInventory.harvested[selectedPlant] || 0) - 1,
      };
    }

    const now = Date.now();
    newPlots[index] = {
      state: 'planted',
      growthStage: 1,
      cropType: selectedPlant,
      needsWater: false,
      plantedAt: now,
    };

    setPlots(newPlots);
    setInventory(newInventory);
    Alert.alert("Planted", `${config.name} planted!`);
  } else if (selectedAction === 'water') {
    if (current.state === 'empty' || current.state === 'tilled') {
      Alert.alert("Cannot Water", "Plot must have plants");
      return;
    };

    const now = Date.now();
    const lastAction = current.lastWateredAt || current.plantedAt || now;
    const timeSinceAction = now - lastAction;

    if (timeSinceAction < 10000 && current.growthStage < 5) {
      const remainingSeconds = Math.ceil((10000 - timeSinceAction) / 1000);
      Alert.alert("Not ready", `Plant doesn't need water yet. Wait ${remainingSeconds}`);
      return;
    };

    if (!current.needsWater && current.growthStage < 5) {
      Alert.alert("Not ready", `Plant doesn\'t need water yet`);
      return;
    };

    consumeWater().then(hasWater => {
      if (!hasWater) {
        Alert.alert("No water", "You need to wait for your water tank to refill");
        return;
      };

      const now = Date.now();
      const newStage = current.growthStage + 1;

      if (current.growthStage === 4 && newStage === 5) {
        setClassificationPlotIndex(index);
        setShowClassification(true);
        return;
      };

      newPlots[index] = {
        ...current,
        growthStage: newStage,
        needsWater: false,
        lastWateredAt: now,
        state: newStage === 5 ? 'growing' : 'planted',
      };

      setPlots(newPlots);
    });
  } else if (selectedAction === 'shovel') {
    // Shovel clears the plot and returns 1 seed
    if (current.state === 'empty') {
      Alert.alert('Nothing to Clear', 'Plot is already empty');
      return;
    }
    
    if (!current.cropType) {
      // Just clear tilled plot
      newPlots[index] = {
        state: 'empty',
        growthStage: 0,
        cropType: null,
        needsWater: false,
      };
      setPlots(newPlots);
      Alert.alert('✅ Cleared', 'Plot has been cleared');
      return;
    }
    
    const config = getCropConfig(current.cropType);
    if (!config) return;
    
    // Return 1 seed
    const newInventory = { ...inventory };
    newInventory.seeds = {
      ...newInventory.seeds,
      [current.cropType]: (newInventory.seeds[current.cropType] || 0) + 1,
    };
    
    // Clear plot
    newPlots[index] = {
      state: 'empty',
      growthStage: 0,
      cropType: null,
      needsWater: false,
    };
    
    // Show harvest animation for the seed
    setHarvestReward({
      cropEmoji: config.emoji,
      cropCount: 0,
      seedCount: 1,
    });
    setShowHarvestAnimation(true);
    setPlots(newPlots);
    setInventory(newInventory);
  }
  else if (selectedAction === 'harvest') {
  // Only harvest if plot is at stage 5
  if (current.growthStage !== 5 || !current.cropType) {
    Alert.alert('Cannot Harvest', 'Plant is not ready to harvest');
    return;
  }
  
  const config = getCropConfig(current.cropType);
  if (!config) return;
  
  // Calculate rewards (e.g., 3 crops + 2 seeds at stage 5)
  const cropCount = 3;
  const seedCount = 2;
  
  // Add to inventory
  const newInventory = { ...inventory };
  newInventory.harvested = {
    ...newInventory.harvested,
    [current.cropType]: (newInventory.harvested[current.cropType] || 0) + cropCount,
  };
  newInventory.seeds = {
    ...newInventory.seeds,
    [current.cropType]: (newInventory.seeds[current.cropType] || 0) + seedCount,
  };
  
  // Show harvest animation
  setHarvestReward({
    cropEmoji: config.emoji,
    cropCount: cropCount,
    seedCount: seedCount,
  });
  setShowHarvestAnimation(true);
  
  // Clear the plot
  newPlots[index] = {
    state: 'empty',
    growthStage: 0,
    cropType: null,
    needsWater: false,
  };
  
  setPlots(newPlots);
  setInventory(newInventory);
  
  // Deselect tool after use
  setSelectedAction(null);
}
};

  const handleClassification = (beeType: string) => {
    if (classificationPlotIndex === null) {
      return;
    };

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
  };

  const handleHarvestClick = () => {
    setSelectedAction('harvest');
  };

  const handleShovelClick = () => {
    setSelectedAction('shovel');
  };

  const openPanel = (panelType: 'almanac' | 'inventory' | 'shop' | 'settings') => {
    // Close all panels first
    setShowAlmanac(false);
    setShowInventory(false);
    setShowShop(false);
    setShowSettings(false);
    
    // Open the selected panel with animation
    setTimeout(() => {
      switch (panelType) {
        case 'almanac':
          setShowAlmanac(true);
          break;
        case 'inventory':
          setShowInventory(true);
          break;
        case 'shop':
          setShowShop(true);
          break;
        case 'settings':
          setShowSettings(true);
          break;
      }
      
      Animated.spring(panelHeight, {
        toValue: SCREEN_HEIGHT * 0.5,
        useNativeDriver: false,
        tension: 50,
        friction: 8,
      }).start();
    }, 50);
  };

  const canHarvest = plots.some(plot => plot.state !== 'empty' && plot.growthStage === 5);
  const canShovel = plots.some(plot => plot.state !== 'empty');

  const closePanel = () => {
    Animated.timing(panelHeight, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setShowAlmanac(false);
      setShowInventory(false);
      setShowShop(false);
      setShowSettings(false);
    });
  };

  const isAnyPanelOpen = showAlmanac || showInventory || showShop || showSettings;

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
        <View style={styles.gardenWrapper}>
          <View style={styles.gardenContainer}>
            {/* Fence frame */}
            <View style={styles.fenceFrame}>
            {/* Top fence */}
            <View style={styles.fenceTop}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.fencePostTop} />
              ))}
            </View>
            
            {/* Bottom fence */}
            <View style={styles.fenceBottom}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.fencePostTop} />
              ))}
            </View>
            
            {/* Left fence */}
            <View style={styles.fenceLeft}>
              {[...Array(3)].map((_, i) => (
                <View key={i} style={styles.fencePostSide} />
              ))}
            </View>
            
            {/* Right fence */}
            <View style={styles.fenceRight}>
              {[...Array(3)].map((_, i) => (
                <View key={i} style={styles.fencePostSide} />
              ))}
            </View>
          </View>

          {/* Garden grid */}
          <View style={styles.grid}>
            {plots.map((plot, index) => (
              <SimplePlot
                key={index}
                index={index}
                plot={plot}
                selectedTool={selectedAction}
                onPress={() => handlePlotPress(index)}
              />
            ))}
          </View>
        </View>
        </View>
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
        anomalyId={classificationPlotIndex !== null ? classificationPlotIndex + 1 : 0}
        anomalyImageUrl="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/303933561/1800"
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

      {/* Bottom Panels - Cover bottom half */}
      {isAnyPanelOpen && (
        <>
          {/* Overlay */}
          <TouchableOpacity
            style={styles.panelOverlay}
            activeOpacity={1}
            onPress={closePanel}
          />
          
          <Animated.View style={[styles.bottomPanel, { height: panelHeight }]}>
            {showAlmanac && (
              <Almanac onClose={closePanel} isExpanded={false} onToggleExpand={() => {}} />
            )}
            
            {showInventory && (
              <Inventory 
                inventory={inventory} 
                setInventory={setInventory}
                onSellCrop={(cropType: string, count: number, coinsEarned: number, emoji: string) => {
                  setSellData({ cropEmoji: emoji, cropCount: count, coinsEarned });
                  setShowSellAnimation(true);
                }}
                onClose={closePanel} 
                isExpanded={false} 
                onToggleExpand={() => {}} 
              />
            )}
            
            {showShop && (
              <Shop 
                inventory={inventory} 
                setInventory={setInventory} 
                onClose={closePanel} 
                isExpanded={false} 
                onToggleExpand={() => {}} 
              />
            )}
            
            {showSettings && (
              <Settings 
                onClose={closePanel} 
                isExpanded={false} 
                onToggleExpand={() => {}} 
                location={null} 
                setLocation={() => {}} 
                setRealWeather={() => {}} 
                setNextRainTime={() => {}}
                onResetGame={() => {
                  setPlots(Array(6).fill(null).map(() => ({
                    state: 'empty' as const,
                    growthStage: 0,
                    cropType: null,
                    needsWater: false,
                  })));
                  AsyncStorage.removeItem('plots');
                  closePanel();
                }}
              />
            )}
          </Animated.View>
        </>
      )}
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
  gardenWrapper: {
    backgroundColor: '#4ade80',
    borderRadius: 8,
    borderWidth: 8,
    borderColor: '#22c55e',
    padding: 4,
  },
  gardenContainer: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#86efac',
    borderRadius: 4,
  },
  fenceFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fenceTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#c2410c',
    borderWidth: 3,
    borderColor: '#44403c',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fenceBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#c2410c',
    borderWidth: 3,
    borderColor: '#44403c',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fenceLeft: {
    position: 'absolute',
    top: 32,
    bottom: 32,
    left: 0,
    width: 32,
    backgroundColor: '#c2410c',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#44403c',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fenceRight: {
    position: 'absolute',
    top: 32,
    bottom: 32,
    right: 0,
    width: 32,
    backgroundColor: '#c2410c',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#44403c',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fencePostTop: {
    width: 16,
    height: 32,
    backgroundColor: '#ea580c',
    borderWidth: 2,
    borderColor: '#78350f',
    borderRadius: 8,
  },
  fencePostSide: {
    width: 32,
    height: 16,
    backgroundColor: '#ea580c',
    borderWidth: 2,
    borderColor: '#78350f',
    borderRadius: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 600,
    gap: 16,
    padding: 48,
  },
  panelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
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
    elevation: 10,
    zIndex: 60,
    overflow: 'hidden',
  },
});
