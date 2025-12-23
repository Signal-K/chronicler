import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCropConfig } from '../../lib/cropConfig';
import { HiveState } from '../../lib/honeyProduction';

interface HiveInfoModalProps {
  hive: HiveState;
  summary: {
    currentProduction: string;
    todaysCollection: string;
    totalHoney: number;
    recentSources: string[];
    qualityRating: string;
  };
  onClose: () => void;
}

export function HiveInfoModal({ hive, summary, onClose }: HiveInfoModalProps) {
  const renderCurrentBatch = () => {
    if (!hive.currentBatch || hive.currentBatch.amount === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Production</Text>
          <Text style={styles.emptyText}>No active honey production</Text>
          <Text style={styles.hint}>Bees need flowering crops to collect nectar!</Text>
        </View>
      );
    }

    const batch = hive.currentBatch;
    const progressPercentage = Math.min(100, (batch.amount / 100) * 100); // Assuming 100ml is full batch

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Batch</Text>
        
        <View style={styles.honeyPreview}>
          <View style={[styles.honeyColor, { backgroundColor: batch.color }]} />
          <View style={styles.batchInfo}>
            <Text style={styles.batchDescription}>{batch.description}</Text>
            <Text style={styles.batchAmount}>
              {Math.round(batch.amount)}ml ({progressPercentage.toFixed(0)}% full)
            </Text>
            <Text style={styles.qualityText}>Quality: {summary.qualityRating}</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>

        {batch.isComplete && (
          <Text style={styles.readyText}>✨ Batch ready for harvest!</Text>
        )}
      </View>
    );
  };

  const renderNectarSources = () => {
    if (summary.recentSources.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nectar Sources</Text>
          <Text style={styles.emptyText}>No recent nectar collection</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today Nectar Sources</Text>
        <View style={styles.sourcesList}>
          {summary.recentSources.map(cropId => {
            const config = getCropConfig(cropId);
            const nectarAmount = hive.dailyNectarCollection[cropId] || 0;
            
            if (!config) return null;

            return (
              <View key={cropId} style={styles.sourceItem}>
                <Text style={styles.sourceEmoji}>{config.emoji}</Text>
                <View style={styles.sourceInfo}>
                  <Text style={styles.sourceName}>{config.name}</Text>
                  <Text style={styles.sourceDescription}>
                    {config.nectar.honeyProfile.description}
                  </Text>
                  {nectarAmount > 0 && (
                    <Text style={styles.nectarAmount}>
                      +{Math.round(nectarAmount)} nectar collected
                    </Text>
                  )}
                </View>
                <View style={[styles.honeyDot, { backgroundColor: config.nectar.honeyProfile.color }]} />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCompletedBatches = () => {
    if (!hive.completedBatches || hive.completedBatches.length === 0) {
      return null;
    }

    const recentBatches = hive.completedBatches.slice(-3); // Show last 3 batches

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Honey Batches</Text>
        {recentBatches.map(batch => (
          <View key={batch.id} style={styles.completedBatch}>
            <View style={[styles.honeyDot, { backgroundColor: batch.color }]} />
            <View style={styles.batchDetails}>
              <Text style={styles.batchName}>{batch.description}</Text>
              <Text style={styles.batchStats}>
                {Math.round(batch.amount)}ml • Quality: {Math.round(batch.quality)}%
              </Text>
            </View>
          </View>
        ))}
        
        {hive.completedBatches.length > 3 && (
          <Text style={styles.moreText}>
            +{hive.completedBatches.length - 3} more batches stored
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>🐝 Hive Information</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {/* Summary Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Production Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summary.totalHoney}</Text>
                <Text style={styles.statLabel}>ml Honey Stored</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{hive.completedBatches?.length || 0}</Text>
                <Text style={styles.statLabel}>Batches Made</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summary.recentSources.length}</Text>
                <Text style={styles.statLabel}>Active Sources</Text>
              </View>
            </View>
          </View>

          {renderCurrentBatch()}
          {renderNectarSources()}
          {renderCompletedBatches()}

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Tips</Text>
            <Text style={styles.tipText}>
              • Sunflowers produce the highest quality nectar{'\n'}
              • Bees are most active during morning and afternoon{'\n'}
              • Different flowers create unique honey flavors{'\n'}
              • Mature crops produce more nectar than young ones
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
    backgroundColor: '#FFE0B2',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#FF8F00',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  emptyText: {
    color: '#8D6E63',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  hint: {
    color: '#FF8F00',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  honeyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  honeyColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FFB300',
  },
  batchInfo: {
    flex: 1,
  },
  batchDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  batchAmount: {
    fontSize: 12,
    color: '#8D6E63',
    marginTop: 2,
  },
  qualityText: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: '500',
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FFE0B2',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8F00',
    borderRadius: 3,
  },
  readyText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E65100',
  },
  statLabel: {
    fontSize: 10,
    color: '#8D6E63',
    textAlign: 'center',
  },
  sourcesList: {
    gap: 8,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  sourceEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  sourceDescription: {
    fontSize: 11,
    color: '#8D6E63',
    marginTop: 2,
  },
  nectarAmount: {
    fontSize: 10,
    color: '#FF8F00',
    fontWeight: '500',
    marginTop: 2,
  },
  honeyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFB300',
  },
  completedBatch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    marginBottom: 4,
  },
  batchDetails: {
    marginLeft: 8,
    flex: 1,
  },
  batchName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E65100',
  },
  batchStats: {
    fontSize: 10,
    color: '#8D6E63',
    marginTop: 2,
  },
  moreText: {
    fontSize: 11,
    color: '#FF8F00',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#8D6E63',
    lineHeight: 18,
  },
});