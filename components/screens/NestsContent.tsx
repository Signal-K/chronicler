import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { HiveData } from '../../types/hive';
import type { PollinationFactorData } from '../../types/pollinationFactor';

interface NestsContentProps {
  pollinationFactor: PollinationFactorData;
  canSpawnBees: boolean;
  hive: HiveData;
}

export function NestsContent({ pollinationFactor, canSpawnBees, hive }: NestsContentProps) {

  return (
    <View style={styles.container}>
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

      {/* Single Hive Display */}
      <View style={styles.hiveContainer}>
        <View style={styles.hiveBox}>
          <Text style={styles.hiveEmoji}>🏡</Text>
          <Text style={styles.hiveName}>Your Beehive</Text>
          <View style={styles.beeCountContainer}>
            <Text style={styles.beeCount}>{hive.beeCount}</Text>
            <Text style={styles.beeLabel}>Bees</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fef3c7',
  },
  statsBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#b45309',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 24,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statsEmoji: {
    fontSize: 32,
  },
  statsInfo: {
    flex: 1,
  },
  statsScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b45309',
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spawnIndicator: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  spawnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  harvestText: {
    fontSize: 14,
    color: '#78350f',
    fontWeight: '600',
  },
  thresholdText: {
    fontSize: 14,
    color: '#78350f',
    fontWeight: '600',
  },
  hiveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiveBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  hiveEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  hiveName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 16,
  },
  beeCountContainer: {
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    minWidth: 120,
  },
  beeCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#b45309',
  },
  beeLabel: {
    fontSize: 16,
    color: '#78350f',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
