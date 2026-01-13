import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { InventoryData } from '../../hooks/useGameState';
import { usePlayerExperience } from '../../hooks/usePlayerExperience';
import { getCropConfig } from '../../lib/cropConfig';
import type { HiveData } from '../../types/hive';
import type { PollinationFactorData } from '../../types/pollinationFactor';

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

// Get gradient colors based on crop proportions from hive data
const getHoneyGradientColors = (hive: HiveData): string[] => {
  const harvests = hive.honey?.dailyHarvests || [];
  const today = new Date().toDateString();
  
  const todaysHarvests = harvests.filter(harvest => 
    new Date(harvest.timestamp).toDateString() === today && harvest.cropId !== 'virtual_boost'
  );

  // If no real harvests but hive has honey bottles (force daytime mode), show golden gradient
  if (todaysHarvests.length === 0) {
    const honeyBottles = hive.honey?.honeyBottles || 0;
    if (honeyBottles > 0) {
      return ['#fbbf24', '#f59e0b', '#d97706']; // Golden gradient for force daytime mode
    }
    return ['#e5e7eb', '#e5e7eb']; // Grey if no harvests and no honey
  }

  // Count crop proportions
  const cropCounts: Record<string, number> = {};
  todaysHarvests.forEach(harvest => {
    const effectiveAmount = harvest.halved ? harvest.amount * 0.5 : harvest.amount;
    cropCounts[harvest.cropId] = (cropCounts[harvest.cropId] || 0) + effectiveAmount;
  });

  // Get colors from crop configs
  const colors: string[] = [];
  const sortedCrops = Object.entries(cropCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by amount
    .slice(0, 3); // Take top 3 crops

  sortedCrops.forEach(([cropId, _]) => {
    const config = getCropConfig(cropId);
    if (config && config.nectar?.honeyProfile?.color) {
      colors.push(config.nectar.honeyProfile.color);
    }
  });

  // Default to golden if no colors found
  if (colors.length === 0) {
    return ['#fbbf24', '#f59e0b'];
  }

  // Ensure at least 2 colors for gradient
  if (colors.length === 1) {
    colors.push(colors[0]);
  }

  return colors;
};

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
  const { experience, loading } = usePlayerExperience();
  const [selectedHive, setSelectedHive] = useState<HiveData | null>(null);
  const [xpModalVisible, setXPModalVisible] = useState(false);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Dashboard Row - Compact Stats */}
      <View style={styles.dashboardRow}>
        {/* Experience Card */}
        <TouchableOpacity style={styles.dashboardCard} activeOpacity={0.85} onPress={() => setXPModalVisible(true)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>⭐</Text>
            <Text style={styles.cardTitle}>Experience</Text>
          </View>
          <View style={styles.experienceContent}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : experience ? (
              <>
                <Text style={styles.levelNumber}>Level {experience.level}</Text>
                <View style={styles.experienceBar}>
                  <View style={[styles.experienceProgress, { width: `${(experience.progress || 0) * 100}%` }]} />
                </View>
                <Text style={styles.smallStat}>
                  {experience.totalXP} Total XP
                </Text>
              </>
            ) : (
              <Text style={styles.errorText}>Error loading</Text>
            )}
          </View>
        </TouchableOpacity>

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
      </View>

      {/* Hives List */}
      <View style={styles.hivesList}>
        {hives.map((currentHive, index) => (
          <TouchableOpacity
            key={currentHive.id}
            style={styles.hiveCard}
            onPress={() => setSelectedHive(currentHive)}
            activeOpacity={0.85}
          >
            <View style={styles.hiveHeader}>
              <Text style={styles.hiveTitle}>Beehive {index + 1}</Text>
              {currentHive.beeCount >= 10 && (
                <View style={styles.fullBadgeCompact}>
                  <Text style={styles.fullBadgeText}>FULL</Text>
                </View>
              )}
            </View>
            
            {/* Simplified hive visual since complex components were deleted */}
            <View style={styles.hiveVisual}>
              <View style={styles.hiveStats}>
                <View style={styles.beeCountRow}>
                  <Image 
                    source={require('../../assets/Sprites/Bee.png')}
                    style={styles.beeSpriteSmall}
                    resizeMode="contain"
                  />
                <View style={styles.beeCountRow}>
                  <Image 
                    source={require('../../assets/Sprites/Bee.png')}
                    style={styles.beeSpriteSmall}
                    resizeMode="contain"
                  />
                  <Text style={styles.beeCount}> {currentHive.beeCount}/10</Text>
                </View>
                </View>
                <View style={styles.honeyBar}>
                  <LinearGradient
                    colors={getHoneyGradientColors(currentHive) as [string, string, ...string[]]}
                    style={[styles.honeyBarFill, { width: `${((hiveNectarLevels[currentHive.id] || 0) / maxNectar) * 100}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <Text style={styles.nectarLevel}>🍯 {hiveNectarLevels[currentHive.id] || 0}/{maxNectar}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
  experienceContent: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  experienceBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  experienceProgress: {
    height: '100%',
    backgroundColor: '#10b981',
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
  hiveVisual: {
    width: '100%',
    alignItems: 'center',
  },
  hiveStats: {
    alignItems: 'center',
    gap: 8,
  },
  beeCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  beeCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  beeSpriteSmall: {
    width: 32,
    height: 32,
  },
  honeyBar: {
    width: 200,
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  honeyBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  nectarLevel: {
    fontSize: 14,
    color: '#b45309',
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
  loadingText: {
    fontSize: 12,
    color: '#78350f',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'center',
  },
});