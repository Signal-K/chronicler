import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { InventoryData } from '../../hooks/useGameState';
import type { HiveData } from '../../types/hive';
import type { PollinationFactorData } from '../../types/pollinationFactor';
import { HiveVisual } from '../hives/HiveVisual';
import { bottleNectar, canBottleNectar, getTotalNectar } from '../../lib/nectarBottling';

interface NestsContentProps {
  pollinationFactor: PollinationFactorData;
  canSpawnBees: boolean;
  hive: HiveData;
  hives?: HiveData[];
  onBuildHive?: () => void;
  canBuildHive?: boolean;
  hiveCost?: number;
  coinBalance?: number;
  hiveNectarLevels?: Record<string, number>; // Track nectar per hive
  maxNectar?: number;
  inventory?: InventoryData;
  onInventoryUpdate?: (inventory: InventoryData) => void;
  onNectarUpdate?: (nectarLevels: Record<string, number>) => void;
}

export function NestsContent({ 
  pollinationFactor, 
  canSpawnBees, 
  hive, 
  hives = [hive],
  onBuildHive,
  canBuildHive = false,
  hiveCost = 100,
  coinBalance = 0,
  hiveNectarLevels = {},
  maxNectar = 100,
  inventory,
  onInventoryUpdate,
  onNectarUpdate,
}: NestsContentProps) {

  const handleBottleNectar = () => {
    if (!inventory || !onInventoryUpdate || !onNectarUpdate) {
      Alert.alert("Error", "Bottling system not available");
      return;
    }

    const result = bottleNectar(inventory, hiveNectarLevels);
    if (result) {
      onInventoryUpdate(result.updatedInventory);
      onNectarUpdate(result.updatedNectarLevels);
      Alert.alert(
        "Success! 🍯",
        "You bottled 10 nectar. Check your inventory!",
        [{ text: "Great!" }]
      );
    } else {
      const totalNectar = getTotalNectar(hiveNectarLevels);
      const bottles = (inventory.items || {}).glass_bottle || 0;
      
      let message = "";
      if (bottles < 1) {
        message = "You need a glass bottle. Buy one from the shop!";
      } else if (totalNectar < 10) {
        message = `You need 10 nectar (you have ${totalNectar.toFixed(1)}). Wait for your bees to produce more.`;
      } else {
        message = "Cannot bottle nectar right now.";
      }
      
      Alert.alert("Cannot Bottle", message, [{ text: "OK" }]);
    }
  };

  const canBottle = inventory ? canBottleNectar(inventory, hiveNectarLevels) : false;
  const totalNectar = getTotalNectar(hiveNectarLevels);
  const bottles = inventory ? ((inventory.items || {}).glass_bottle || 0) : 0;
  const bottledNectar = inventory ? ((inventory.items || {}).bottled_nectar || 0) : 0;

  return (
    <View style={styles.container}>
      {/* Nectar Bottling Section */}
      {inventory && (
        <View style={styles.bottlingSection}>
          <View style={styles.bottlingHeader}>
            <Text style={styles.bottlingTitle}>🍯 Nectar Bottling</Text>
            <View style={styles.bottlingStats}>
              <Text style={styles.bottlingStat}>Total Nectar: {totalNectar.toFixed(1)}/10</Text>
              <Text style={styles.bottlingStat}>Bottles: {bottles}</Text>
              <Text style={styles.bottlingStat}>Bottled: {bottledNectar}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.bottleButton, !canBottle && styles.bottleButtonDisabled]}
            onPress={handleBottleNectar}
            disabled={!canBottle}
          >
            <Text style={styles.bottleButtonText}>
              {canBottle ? "🍾 Bottle Nectar" : "Cannot Bottle"}
            </Text>
            <Text style={styles.bottleButtonSubtext}>
              Uses 1 bottle + 10 nectar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Pollination Factor Display */}
      <View style={styles.statsBanner}>
        <View style={styles.statsContent}>
          <Text style={styles.statsEmoji}>🌸</Text>
          <View style={styles.statsInfo}>
            <Text style={styles.statsScore}>
              {pollinationFactor.factor}
            </Text>
            <Text style={styles.statsLabel}>Pollination Factor</Text>
          </View>
          {canSpawnBees && (
            <View style={styles.spawnIndicator}>
              <Text style={styles.spawnText}>✨ Bees Ready!</Text>
            </View>
          )}
        </View>
        <View style={styles.harvestInfo}>
          <Text style={styles.harvestText}>
            Total Harvests: {pollinationFactor.totalHarvests}
          </Text>
          <Text style={styles.thresholdText}>
            Threshold: {pollinationFactor.threshold}
          </Text>
        </View>
      </View>

      {/* Hive Display */}
      <ScrollView 
        style={styles.hiveScrollView}
        contentContainerStyle={styles.hiveContainer}
      >
        {hives.map((currentHive, index) => (
          <View key={currentHive.id} style={styles.hiveBox}>
            <Text style={styles.hiveName}>Beehive {index + 1}</Text>
            
            {/* New visual beehive with nectar drips */}
            <HiveVisual
              hiveId={currentHive.id}
              nectarLevel={hiveNectarLevels[currentHive.id] || 0}
              maxNectar={maxNectar}
              beeCount={currentHive.beeCount}
            />

            {currentHive.beeCount >= 10 && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullBadgeText}>✨ FULL</Text>
              </View>
            )}
          </View>
        ))}

        {/* Build New Hive Button */}
        {onBuildHive && (
          <TouchableOpacity
            style={[
              styles.buildHiveButton,
              !canBuildHive && styles.buildHiveButtonDisabled
            ]}
            onPress={onBuildHive}
            disabled={!canBuildHive}
          >
            <Text style={styles.buildHiveIcon}>🏗️</Text>
            <Text style={styles.buildHiveText}>Build New Hive</Text>
            <View style={styles.costContainer}>
              <Text style={styles.costText}>💰 {hiveCost}</Text>
            </View>
            {!canBuildHive && (
              <Text style={styles.insufficientText}>
                Need {hiveCost - coinBalance} more coins
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fef3c7',
  },
  statsBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#b45309',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 12,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statsEmoji: {
    fontSize: 24,
  },
  statsInfo: {
    flex: 1,
  },
  statsScore: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b45309',
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78350f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spawnIndicator: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  spawnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  harvestText: {
    fontSize: 11,
    color: '#78350f',
    fontWeight: '600',
  },
  thresholdText: {
    fontSize: 11,
    color: '#78350f',
    fontWeight: '600',
  },
  hiveScrollView: {
    flex: 1,
  },
  hiveContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
    paddingBottom: 20,
  },
  hiveBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '95%',
    maxWidth: 340,
  },
  hiveStructure: {
    alignItems: 'center',
    marginBottom: 8,
    transform: [{ scale: 0.85 }],
  },
  hiveRoof: {
    marginBottom: -8,
  },
  roofText: {
    fontSize: 40,
    color: '#92400e',
  },
  hiveBody: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: '#92400e',
    gap: 6,
  },
  hiveLayer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  hexagon: {
    width: 40,
    height: 40,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#92400e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexText: {
    fontSize: 18,
  },
  hiveEntrance: {
    marginTop: -4,
  },
  entranceText: {
    fontSize: 20,
  },
  hiveName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  beeCountContainer: {
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#d97706',
  },
  beeCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b45309',
  },
  beeLabel: {
    fontSize: 12,
    color: '#78350f',
    fontWeight: '600',
  },
  fullBadge: {
    marginTop: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fullBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buildHiveButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#92400e',
    borderStyle: 'dashed',
    width: '95%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buildHiveButtonDisabled: {
    opacity: 0.5,
    borderColor: '#9ca3af',
  },
  buildHiveIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  buildHiveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 6,
  },
  costContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d97706',
  },
  costText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  insufficientText: {
    marginTop: 6,
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  bottlingSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#f59e0b',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  bottlingHeader: {
    marginBottom: 10,
  },
  bottlingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 6,
  },
  bottlingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  bottlingStat: {
    fontSize: 12,
    color: '#78350f',
    fontWeight: '600',
  },
  bottleButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d97706',
  },
  bottleButtonDisabled: {
    backgroundColor: '#d1d5db',
    borderColor: '#9ca3af',
  },
  bottleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  bottleButtonSubtext: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
  },
});
