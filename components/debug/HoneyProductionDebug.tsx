import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface HoneyProductionDebugProps {
  getProductionStats: () => {
    totalHives: number;
    activeHives: number;
    completedBatches: number;
    totalHoneyProduced: number;
    activeSources: number;
    sourcesList: string[];
    lastUpdate: Date;
    isPollinationActive: boolean;
  };
  getHiveInfo: (hiveId: string) => {
    hive: any;
    summary: any;
  } | null;
  hiveIds: string[];
}

export function HoneyProductionDebug({ 
  getProductionStats, 
  getHiveInfo, 
  hiveIds 
}: HoneyProductionDebugProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedHive, setSelectedHive] = useState<string | null>(null);
  
  const stats = getProductionStats();

  if (!showDebug) {
    return (
      <Pressable 
        style={styles.toggleButton}
        onPress={() => setShowDebug(true)}
      >
        <Text style={styles.toggleText}>🍯 Show Honey Debug</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.debugPanel}>
      <View style={styles.header}>
        <Text style={styles.title}>🍯 Honey Production Debug</Text>
        <Pressable 
          style={styles.closeButton}
          onPress={() => setShowDebug(false)}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Production Overview</Text>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Hives</Text>
              <Text style={styles.statValue}>{stats.totalHives}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Active Hives</Text>
              <Text style={styles.statValue}>{stats.activeHives}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Honey Produced</Text>
              <Text style={styles.statValue}>{Math.round(stats.totalHoneyProduced)}ml</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Active Crops</Text>
              <Text style={styles.statValue}>{stats.activeSources}</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={[
              styles.pollinationStatus, 
              { color: stats.isPollinationActive ? '#4CAF50' : '#FF8F00' }
            ]}>
              {stats.isPollinationActive ? '🐝 Bees Active' : '😴 Bees Resting'}
            </Text>
            <Text style={styles.lastUpdate}>
              Updated: {stats.lastUpdate.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Active Sources */}
        {stats.sourcesList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Nectar Sources</Text>
            <View style={styles.sourcesList}>
              {stats.sourcesList.map(cropId => (
                <View key={cropId} style={styles.sourceItem}>
                  <Text style={styles.sourceName}>{cropId}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Individual Hive Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hive Details</Text>
          {hiveIds.map(hiveId => {
            const hiveInfo = getHiveInfo(hiveId);
            if (!hiveInfo) return null;

            return (
              <Pressable 
                key={hiveId}
                style={[
                  styles.hiveItem,
                  selectedHive === hiveId && styles.selectedHive
                ]}
                onPress={() => setSelectedHive(selectedHive === hiveId ? null : hiveId)}
              >
                <Text style={styles.hiveName}>Hive: {hiveId}</Text>
                <Text style={styles.hiveStatus}>
                  {hiveInfo.summary.currentProduction}
                </Text>
                
                {selectedHive === hiveId && (
                  <View style={styles.hiveDetails}>
                    <Text style={styles.detailText}>
                      Quality: {hiveInfo.summary.qualityRating}
                    </Text>
                    <Text style={styles.detailText}>
                      Total Honey: {hiveInfo.summary.totalHoney}ml
                    </Text>
                    <Text style={styles.detailText}>
                      Sources: {hiveInfo.summary.recentSources.join(', ') || 'None'}
                    </Text>
                    <Text style={styles.detailText}>
                      Today Collection: {hiveInfo.summary.todaysCollection}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: '#FFB300',
    padding: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  toggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugPanel: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 300,
    height: 400,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFB300',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFE0B2',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#FF8F00',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 6,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: '#8D6E63',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  pollinationStatus: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lastUpdate: {
    fontSize: 9,
    color: '#8D6E63',
  },
  sourcesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  sourceItem: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sourceName: {
    fontSize: 10,
    color: '#E65100',
  },
  hiveItem: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  selectedHive: {
    borderColor: '#FF8F00',
    backgroundColor: '#FFFDE7',
  },
  hiveName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
  },
  hiveStatus: {
    fontSize: 10,
    color: '#8D6E63',
    marginTop: 2,
  },
  hiveDetails: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
  },
  detailText: {
    fontSize: 9,
    color: '#8D6E63',
    marginBottom: 2,
  },
});