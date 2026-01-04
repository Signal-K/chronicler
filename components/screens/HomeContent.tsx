import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useClassificationTracking } from '../../hooks/useClassificationTracking';
import type { InventoryData, PlotData, Tool } from '../../hooks/useGameState';
import { useHoveringBees, type HoveringBeeData } from '../../hooks/useHoveringBees';
import { usePlotActions } from '../../hooks/usePlotActions';
import type { HiveData } from '../../types/hive';
import { HarvestAnimation } from '../animations/HarvestAnimation';
import { GardenGrid } from '../garden/GardenGrid';
import { HoveringBeesManager } from '../garden/HoveringBeesManager';
import { FlyingBee } from '../hives/FlyingBee';
import ClassificationModal from '../modals/ClassificationModal';
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
  hives?: HiveData[];
  updateHiveBeeCount?: (count: number) => void;
  flyingBees?: FlyingBeeData[];
  onBeePress?: (beeId: string) => void;
  verticalPage?: 'main' | 'expand';
  totalPlots?: number;
  baseIndex?: number;
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
  hives = [],
  updateHiveBeeCount,
  flyingBees = [],
  onBeePress,
  verticalPage = 'main',
  totalPlots,
  baseIndex = 0,
}: HomeContentProps) {
  // Classification modal state
  const [classificationModal, setClassificationModal] = useState<{
    visible: boolean;
    bee: HoveringBeeData | null;
  }>({
    visible: false,
    bee: null,
  });

  // Classification tracking hook
  const { canClassifyHiveSync, submitClassification } = useClassificationTracking(hives);

  // Bee press handler for classification
  const handleBeePress = useCallback((bee: HoveringBeeData) => {
    setClassificationModal({
      visible: true,
      bee,
    });
  }, []);

  // Handle classification submission
  const handleClassification = useCallback(async (classificationType: string) => {
    if (!classificationModal.bee) return;
    
    const success = await submitClassification(
      classificationModal.bee.identity.hiveId,
      classificationType
    );
    
    if (success) {
      Alert.alert(
        'Classification Recorded! ✓',
        `Thank you! You've classified bee ${classificationModal.bee.identity.name} as a ${classificationType}.`
      );
    } else {
      Alert.alert(
        'Classification Failed',
        'You may have already classified a bee from this hive today.'
      );
    }
    
    setClassificationModal({ visible: false, bee: null });
  }, [classificationModal.bee, submitClassification]);

  // Use hovering bees hook - plots temporarily empty to fix type issue
  const { hoveringBees } = useHoveringBees(hives, isDaytime, []);
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

  const farmPages = Math.ceil((totalPlots ?? plots.length) / 6);

  return (
    <>
      {verticalPage === 'expand' && farmPages <= 1 && (
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
            baseIndex={baseIndex}
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

      {/* Hovering Bees with Tags - New Feature */}
      <HoveringBeesManager 
        bees={hoveringBees} 
        onBeePress={handleBeePress}
        canClassifyBee={canClassifyHiveSync}
      />

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

      {/* Classification Modal */}
      <ClassificationModal
        visible={classificationModal.visible}
        onClose={() => setClassificationModal({ visible: false, bee: null })}
        onClassify={handleClassification}
        beeIdentifier={classificationModal.bee?.identity.name}
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
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
});
