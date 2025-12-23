import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayerExperience } from '../../hooks/usePlayerExperience';
import type { InventoryData } from '../../hooks/useGameState';
import type { HiveData } from '../../types/hive';
import type { PollinationFactorData } from '../../types/pollinationFactor';
import { HiveVisual } from '../hives/HiveVisual';
import { HiveInfoModal } from '../hives/HiveInfoModal';
import { ExperienceBar } from '../ui/ExperienceBar';
import { ExperienceBreakdownModal } from '../ui/ExperienceBreakdownModal';

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
                <ExperienceBar
                  level={experience.level}
                  currentXP={experience.xpInCurrentLevel}
                  nextLevelXP={experience.xpNeededForNext}
                  progress={experience.progress}
                  compact={true}
                  showDetails={false}
                />
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

        {/* Bottling Card removed - use toolbar button instead */}
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
            <HiveVisual
              hiveId={currentHive.id}
              nectarLevel={hiveNectarLevels[currentHive.id] || 0}
              maxNectar={maxNectar}
              beeCount={currentHive.beeCount}
            />
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

      {/* Hive Info Modal */}
      {selectedHive && (
        <HiveInfoModal
          hive={selectedHive as any}
          summary={{
            currentProduction: '',
            todaysCollection: '',
            totalHoney: selectedHive.totalHoney || 0,
            recentSources: selectedHive.recentSources || [],
            qualityRating: selectedHive.qualityRating || '',
          }}
          onClose={() => setSelectedHive(null)}
        />
      )}

      {/* Experience Breakdown Modal */}
      {experience && (
        <ExperienceBreakdownModal
          visible={xpModalVisible}
          onClose={() => setXPModalVisible(false)}
          breakdown={{
            totalXP: experience.totalXP,
            harvestsCount: experience.harvestsCount,
            uniqueHarvests: experience.uniqueHarvests,
            pollinationEvents: experience.pollinationEvents,
            salesCompleted: experience.salesCompleted,
          }}
        />
      )}
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
