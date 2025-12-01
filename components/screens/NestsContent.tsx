import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { InventoryData } from '../../hooks/useGameState';
import { bottleNectar, canBottleNectar, getTotalNectar } from '../../lib/nectarBottling';
import type { HiveData } from '../../types/hive';
import type { PollinationFactorData } from '../../types/pollinationFactor';
import { HiveVisual } from '../hives/HiveVisual';

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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Dashboard Row - Compact Stats */}
      <View style={styles.dashboardRow}>
        {/* Pollination Card */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>🌸</Text>
            <Text style={styles.cardTitle}>Pollination</Text>
          </View>
          
          <View style={styles.pollinationContent}>
            <Text style={styles.bigNumber}>{pollinationFactor.factor}</Text>
            {canSpawnBees && (
              <View style={styles.readyBadge}>
                <Text style={styles.readyText}>Bees Ready!</Text>
              </View>
            )}
            <Text style={styles.smallStat}>
              {pollinationFactor.totalHarvests} / {pollinationFactor.threshold} Harvests
            </Text>
          </View>
        </View>

        {/* Bottling Card */}
        {inventory && (
          <View style={styles.dashboardCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>🍯</Text>
              <Text style={styles.cardTitle}>Bottling</Text>
            </View>
            
            <View style={styles.bottlingContent}>
              <View style={styles.bottlingStatsRow}>
                <Text style={styles.smallStat}>Nectar: {totalNectar.toFixed(0)}/10</Text>
                <Text style={styles.smallStat}>Bottles: {bottles}</Text>
              </View>
              <Text style={styles.smallStat}>Bottled: {bottledNectar}</Text>
              
              <TouchableOpacity
                style={[styles.compactBottleButton, !canBottle && styles.disabledButton]}
                onPress={handleBottleNectar}
                disabled={!canBottle}
              >
                <Text style={styles.compactButtonText}>Bottle (10)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Hives List */}
      <View style={styles.hivesList}>
        {hives.map((currentHive, index) => (
          <View key={currentHive.id} style={styles.hiveCard}>
            <View style={styles.hiveHeader}>
              <Text style={styles.hiveTitle}>Beehive {index + 1}</Text>
              {currentHive.beeCount >= 10 && (
                <View style={styles.fullBadgeCompact}>
                  <Text style={styles.fullBadgeText}>FULL</Text>
                </View>
              )}
            </View>
            
            <HiveVisual
              hiveId={currentHive.id}
              nectarLevel={hiveNectarLevels[currentHive.id] || 0}
              maxNectar={maxNectar}
              beeCount={currentHive.beeCount}
            />
          </View>
        ))}

        {/* Build New Hive Button */}
        {onBuildHive && (
          <TouchableOpacity
            style={[
              styles.buildCard,
              !canBuildHive && styles.disabledBuildCard
            ]}
            onPress={onBuildHive}
            disabled={!canBuildHive}
          >
            <Text style={styles.buildEmoji}>🏗️</Text>
            <View>
              <Text style={styles.buildText}>Build New Hive</Text>
              <Text style={styles.costText}>💰 {hiveCost} coins</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom padding for scrolling past bottom bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3c7',
  },
  contentContainer: {
    padding: 12,
    gap: 12,
  },
  dashboardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#d97706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  pollinationContent: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  bigNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#b45309',
  },
  readyBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  readyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  smallStat: {
    fontSize: 11,
    color: '#78350f',
    fontWeight: '600',
  },
  bottlingContent: {
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottlingStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  compactBottleButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d97706',
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    borderColor: '#9ca3af',
  },
  compactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  hivesList: {
    gap: 16,
  },
  hiveCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#92400e',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hiveHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  hiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
  },
  fullBadgeCompact: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fullBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buildCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#92400e',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  disabledBuildCard: {
    opacity: 0.6,
    borderColor: '#9ca3af',
  },
  buildEmoji: {
    fontSize: 24,
  },
  buildText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  costText: {
    fontSize: 14,
    color: '#b45309',
    fontWeight: '600',
  },
});
