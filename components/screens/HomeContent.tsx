import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { InventoryData, PlotData, Tool } from '../../hooks/useGameState';
import { usePlotActions } from '../../hooks/usePlotActions';
import { HarvestAnimation } from '../animations/HarvestAnimation';
import { GardenGrid } from '../garden/GardenGrid';
import { FlyingBee } from '../hives/FlyingBee';
import { InfoDialog } from '../ui/InfoDialog';

type FlyingBeeData = {
  id: string;
  hiveId: string;
  startX: number;
  startY: number;
  spawnedAt: number;
};

type HomeContentProps = {
  plots: PlotData[];
  setPlots: React.Dispatch<React.SetStateAction<PlotData[]>>;
  inventory: InventoryData;
  setInventory: React.Dispatch<React.SetStateAction<InventoryData>>;
  selectedAction: Tool;
  setSelectedAction: React.Dispatch<React.SetStateAction<Tool>>;
  selectedPlant: string;
  consumeWater: () => Promise<boolean>;
  incrementPollinationFactor?: (amount: number) => void;
  isDaytime?: boolean;
  pollinationFactor?: number;
  hiveCount?: number;
  updateHiveBeeCount?: (count: number) => void;
  flyingBees?: FlyingBeeData[];
  onBeePress?: (beeId: string) => void;
  verticalPage?: 'main' | 'expand';
};

export function HomeContent({
  plots,
  setPlots,
  inventory,
  setInventory,
  selectedAction,
  setSelectedAction,
  selectedPlant,
  consumeWater,
  incrementPollinationFactor,
  isDaytime = true,
  pollinationFactor = 0,
  hiveCount = 1,
  updateHiveBeeCount,
  flyingBees = [],
  onBeePress,
  verticalPage = 'main',
}: HomeContentProps) {
  const [showHarvestAnimation, setShowHarvestAnimation] = React.useState(false);
  const [harvestReward, setHarvestReward] = React.useState({ cropEmoji: '', cropCount: 0, seedCount: 0 });
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [dialogData, setDialogData] = React.useState({ title: '', message: '', emoji: '' });
  
  const { handlePlotPress } = usePlotActions({
    plots,
    setPlots,
    inventory,
    setInventory,
    selectedAction,
    selectedPlant,
    consumeWater,
    setHarvestReward,
    setShowHarvestAnimation,
    setSelectedAction,
    incrementPollinationFactor,
    onShowDialog: (title: string, message: string, emoji?: string) => {
      setDialogData({ title, message, emoji: emoji || '' });
      setDialogVisible(true);
    },
  });

  return (
    <>
      {verticalPage === 'expand' && (
        <View style={styles.expandBanner}>
          <Text style={styles.expandTitle}>Expanded Farm</Text>
          <Text style={styles.expandText}>This is your expanded farm area — unlock more plots in the shop or via events.</Text>
        </View>
      )}
      {/* Garden or expanded terrain */}
      {/* Show the garden grid for both main and expanded pages. FarmPager passes the correct page plots. */}
      {verticalPage === 'expand' ? (
        <View style={styles.expandTerrain}>
          <GardenGrid 
            plots={plots}
            selectedTool={selectedAction}
            onPlotPress={handlePlotPress}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <GardenGrid 
            plots={plots}
            selectedTool={selectedAction}
            onPlotPress={handlePlotPress}
          />
        </ScrollView>
      )}

      {/* Flying Bees - classification system */}
      {flyingBees.map((bee) => (
        <FlyingBee
          key={bee.id}
          beeId={bee.id}
          startX={bee.startX}
          startY={bee.startY}
          onPress={() => onBeePress?.(bee.id)}
        />
      ))}

      {/* Harvest Animation */}
      <HarvestAnimation
        visible={showHarvestAnimation}
        cropEmoji={harvestReward.cropEmoji}
        cropCount={harvestReward.cropCount}
        seedCount={harvestReward.seedCount}
        pollinationIncrease={1}
        onComplete={() => setShowHarvestAnimation(false)}
      />

      {/* Info Dialog */}
      <InfoDialog
        visible={dialogVisible}
        title={dialogData.title}
        message={dialogData.message}
        emoji={dialogData.emoji}
        onClose={() => setDialogVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  expandBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 12,
    zIndex: 20,
    alignItems: 'center',
  },
  expandTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expandText: {
    fontSize: 12,
    textAlign: 'center',
  },
  expandTerrain: {
    flex: 1,
    backgroundColor: '#7ff3a1',
    marginTop: 56,
    borderRadius: 8,
    width: '100%',
  },
});
